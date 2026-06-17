import { auth } from '@clerk/nextjs'
import { createJob, updateJobStatus } from '@/lib/supabase'
import { generateImageWithFLUX, waitForPrediction, faceSwapImage, generateVideoWithKlingOrLivePortrait } from '@/lib/replicate'
import { NextRequest, NextResponse } from 'next/server'

async function enhancePromptWithGPT(userPrompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at enhancing lifestyle and aspiration prompts for AI image generation. Take a user\'s prompt and expand it with vivid, specific details about lighting, atmosphere, setting, and cinematic quality. Make it production-ready for FLUX image generation. Keep the core idea but make it more detailed and visually rich. Return only the enhanced prompt, no explanation.',
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`GPT enhancement failed: ${error.error?.message || 'Unknown error'}`)
  }

  const data = await response.json()
  const enhancedPrompt = data.choices?.[0]?.message?.content?.trim()

  if (!enhancedPrompt) {
    throw new Error('Failed to generate enhanced prompt')
  }

  return enhancedPrompt
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { mode, selfie_url, input_template, input_prompt, input_video_url, template_prompt, face_embedding, input_image_url } = body

    if (!mode) {
      return NextResponse.json({ error: 'Mode is required' }, { status: 400 })
    }

    if (mode === 'template' && !input_template) {
      return NextResponse.json({ error: 'Template is required for template mode' }, { status: 400 })
    }

    if (mode === 'prompt' && !input_prompt) {
      return NextResponse.json({ error: 'Prompt is required for prompt mode' }, { status: 400 })
    }

    if (mode === 'image_transform' && !input_image_url) {
      return NextResponse.json({ error: 'Target image is required for image_transform mode' }, { status: 400 })
    }

    if (mode === 'video_transform' && !input_video_url) {
      return NextResponse.json({ error: 'Target video is required for video_transform mode' }, { status: 400 })
    }

    // Create job in Supabase with pending status
    const job = await createJob(userId, mode, {
      selfie_url,
      input_template,
      input_prompt,
      input_video_url,
      input_image_url,
    })

    // Process generation asynchronously
    // Don't await - return job immediately
    processGeneration(job.id, mode, template_prompt || input_prompt, face_embedding, input_prompt, selfie_url, input_image_url, input_video_url).catch(err => {
      console.error('Background generation error:', err)
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to create generation job' },
      { status: 500 }
    )
  }
}

// Background generation process
async function processGeneration(
  jobId: string,
  mode: string,
  prompt: string,
  faceEmbedding?: string,
  userPrompt?: string,
  selfieUrl?: string,
  targetImageUrl?: string,
  targetVideoUrl?: string
) {
  try {
    // Update to processing
    await updateJobStatus(jobId, 'processing')

    if (mode === 'image_transform') {
      // Handle image transformation with face swap
      if (!targetImageUrl) {
        throw new Error('Target image URL is required for image_transform mode')
      }

      if (!selfieUrl) {
        throw new Error('Selfie URL is required for face swap')
      }

      // Perform face swap: extract face from selfie and place on target image
      const prediction = await faceSwapImage(selfieUrl, targetImageUrl)

      // Wait for prediction to complete
      const completed = await waitForPrediction(prediction.id)

      if (completed.status === 'succeeded' && completed.output) {
        // Get the output URL
        const outputUrl = Array.isArray(completed.output)
          ? completed.output[0]
          : completed.output

        // Update job with completed status and output
        await updateJobStatus(jobId, 'completed', {
          output_image_url: outputUrl,
        })
      } else if (completed.status === 'failed') {
        await updateJobStatus(jobId, 'failed', {
          error_message: completed.error || 'Face swap generation failed',
        })
      }
    } else if (mode === 'video_transform') {
      // Handle video transformation
      if (!targetVideoUrl) {
        throw new Error('Target video URL is required for video transformation')
      }

      const prediction = await generateVideoWithKlingOrLivePortrait(targetVideoUrl, faceEmbedding || '')

      // Wait for prediction to complete (video generation takes longer)
      const completed = await waitForPrediction(prediction.id, 120000) // 2 minute timeout for video

      if (completed.status === 'succeeded' && completed.output) {
        // Get the output URL
        const outputUrl = Array.isArray(completed.output)
          ? completed.output[0]
          : completed.output

        // Update job with completed status and output
        await updateJobStatus(jobId, 'completed', {
          output_video_url: outputUrl,
        })
      } else if (completed.status === 'failed') {
        await updateJobStatus(jobId, 'failed', {
          error_message: completed.error || 'Video transformation failed',
        })
      }
    } else {
      // Handle image generation (existing logic for template and prompt modes)
      let finalPrompt = prompt

      // For prompt mode, enhance the user's prompt with GPT
      if (mode === 'prompt' && userPrompt) {
        try {
          finalPrompt = await enhancePromptWithGPT(userPrompt)
        } catch (enhanceError) {
          console.warn('Failed to enhance prompt with GPT, using original:', enhanceError)
          finalPrompt = userPrompt
        }
      }

      // Call FLUX with face embedding for identity preservation
      const prediction = await generateImageWithFLUX(finalPrompt, faceEmbedding || '')

      // Wait for prediction to complete
      const completed = await waitForPrediction(prediction.id)

      if (completed.status === 'succeeded' && completed.output) {
        // Get the output URL
        const outputUrl = Array.isArray(completed.output)
          ? completed.output[0]
          : completed.output

        // Update job with completed status and output
        await updateJobStatus(jobId, 'completed', {
          output_image_url: outputUrl,
        })
      } else if (completed.status === 'failed') {
        await updateJobStatus(jobId, 'failed', {
          error_message: completed.error || 'FLUX generation failed',
        })
      }
    }
  } catch (error) {
    console.error(`Generation failed for job ${jobId}:`, error)
    await updateJobStatus(jobId, 'failed', {
      error_message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
