import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

interface FaceSwapInput {
  selfieUrl: string
  templateUrl: string
}

interface FaceSwapResult {
  imageUrl: string
  jobId: string
}

export async function performFaceSwap(input: FaceSwapInput): Promise<FaceSwapResult> {
  try {
    console.log('Starting face swap...')
    console.log('Selfie:', input.selfieUrl)
    console.log('Template:', input.templateUrl)

    // Use InsightFace + PuLID via Replicate for identity-preserving face swap
    const output = await replicate.run('zsxkzm/face-swap:00efbde38f4e5d4514bc37e0b4e2c0cf5912256fe01a3abf6db98e50e3b0b6e8', {
      inputs: {
        source_image: input.selfieUrl,
        target_image: input.templateUrl,
        improved_quality: true,
      },
    }) as string[]

    if (!output || output.length === 0) {
      throw new Error('No output from face swap model')
    }

    return {
      imageUrl: output[0],
      jobId: Date.now().toString(),
    }
  } catch (error) {
    console.error('Face swap error:', error)
    throw new Error(`Face swap failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Alternative: Use InsightFace directly for more control
export async function performFaceSwapAdvanced(input: FaceSwapInput): Promise<FaceSwapResult> {
  try {
    console.log('Starting advanced face swap with InsightFace + PuLID...')

    // Extract face embedding from selfie
    const faceEmbedding = await replicate.run(
      'daanelson/insightface:06c35fef8d1e1cf0e1be8f22a78a1b1330f9f7ca7e66c8cd48d5e955f2c5a969',
      {
        inputs: {
          image: input.selfieUrl,
        },
      }
    )

    // Perform face swap with PuLID for identity preservation
    const output = await replicate.run('daanelson/face-swap:c359b7ba9cf07c4cc3d283885da82e88b13dfa05ce57e5561b6aaca568dd5b3f', {
      inputs: {
        source_image: input.selfieUrl,
        target_image: input.templateUrl,
      },
    }) as string[]

    if (!output || output.length === 0) {
      throw new Error('No output from advanced face swap')
    }

    return {
      imageUrl: output[0],
      jobId: Date.now().toString(),
    }
  } catch (error) {
    console.error('Advanced face swap error:', error)
    throw new Error(`Advanced face swap failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
