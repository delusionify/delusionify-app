import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { performFaceSwap } from '@/lib/faceswap'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface GenerateRequest {
  mode: 'template' | 'custom' | 'video'
  selfieUrl: string
  templateId?: string
  customPrompt?: string
  videoUrl?: string
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: GenerateRequest = await request.json()

    // Validate input
    if (!body.selfieUrl) {
      return NextResponse.json(
        { error: 'Selfie image is required' },
        { status: 400 }
      )
    }

    if (body.mode === 'template' && !body.templateId) {
      return NextResponse.json(
        { error: 'Template ID is required for template mode' },
        { status: 400 }
      )
    }

    // Create job record
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        user_id: userId,
        mode: body.mode,
        status: 'processing',
        selfie_url: body.selfieUrl,
        input_template: body.templateId || null,
        input_prompt: body.customPrompt || null,
        input_video_url: body.videoUrl || null,
      })
      .select()
      .single()

    if (jobError) {
      return NextResponse.json(
        { error: 'Failed to create job' },
        { status: 500 }
      )
    }

    // Process based on mode
    let outputUrl: string | null = null
    let error: string | null = null

    try {
      if (body.mode === 'template') {
        // Get template image
        const { data: template, error: templateError } = await supabase
          .from('template_images')
          .select('storage_url')
          .eq('id', body.templateId)
          .single()

        if (templateError || !template) {
          throw new Error('Template not found')
        }

        // Perform face swap
        const result = await performFaceSwap({
          selfieUrl: body.selfieUrl,
          templateUrl: template.storage_url,
        })

        outputUrl = result.imageUrl
      } else if (body.mode === 'custom') {
        // Custom prompt generation would use FLUX + InsightFace
        // For now, placeholder
        error = 'Custom mode not yet implemented'
      } else if (body.mode === 'video') {
        // Video generation would use LivePortrait + Kling
        // For now, placeholder
        error = 'Video mode not yet implemented'
      }
    } catch (processError) {
      error = processError instanceof Error ? processError.message : 'Unknown error'
    }

    // Update job with result
    const { error: updateError } = await supabase
      .from('jobs')
      .update({
        status: error ? 'failed' : 'completed',
        output_image_url: outputUrl,
        error_message: error,
        updated_at: new Date().toISOString(),
      })
      .eq('id', job.id)

    if (updateError) {
      console.error('Failed to update job:', updateError)
    }

    return NextResponse.json({
      jobId: job.id,
      status: error ? 'failed' : 'completed',
      outputUrl,
      error,
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Generation failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const jobId = request.nextUrl.searchParams.get('jobId')

    if (!jobId) {
      // Return all jobs for user
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json(jobs)
    } else {
      // Return specific job
      const { data: job, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .eq('user_id', userId)
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(job)
    }
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}
