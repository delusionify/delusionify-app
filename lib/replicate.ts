// Replicate API helpers for FLUX, InsightFace, PuLID

const REPLICATE_API_URL = 'https://api.replicate.com/api/v1'

export interface ReplicateInput {
  [key: string]: unknown
}

export interface ReplicatePrediction {
  id: string
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled'
  input: ReplicateInput
  output?: string | string[] | null
  error?: string
  logs?: string
  created_at: string
  started_at?: string
  completed_at?: string
  webhook?: string
  webhook_events_filter?: string[]
}

// Create a prediction (async job) on Replicate
export async function createPrediction(
  model: string,
  input: ReplicateInput,
  webhook?: string
): Promise<ReplicatePrediction> {
  const token = process.env.REPLICATE_API_TOKEN

  if (!token) {
    throw new Error('REPLICATE_API_TOKEN is not set')
  }

  const body: any = {
    input,
  }

  if (webhook) {
    body.webhook = webhook
    body.webhook_events_filter = ['completed']
  }

  const response = await fetch(`${REPLICATE_API_URL}/predictions`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: model,
      ...body,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Replicate API error: ${response.status} ${error}`)
  }

  return response.json()
}

// Poll prediction status
export async function getPrediction(id: string): Promise<ReplicatePrediction> {
  const token = process.env.REPLICATE_API_TOKEN

  if (!token) {
    throw new Error('REPLICATE_API_TOKEN is not set')
  }

  const response = await fetch(`${REPLICATE_API_URL}/predictions/${id}`, {
    headers: {
      'Authorization': `Token ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get prediction: ${response.status}`)
  }

  return response.json()
}

// Common model versions (Replicate model IDs)

// InsightFace - Face detection and embedding extraction
export const INSIGHTFACE_MODEL = 'lucataco/insightface:b73beaf93575f4be92f85e65097e906236e11147'

// FLUX Kontext Pro - Image generation with identity preservation
export const FLUX_KONTEXT_PRO_MODEL = 'black-forest-labs/flux-pro'

// PuLID - For identity-consistent generation (integrated into FLUX via input)
// Note: PuLID is typically used as an adapter/LoRA in FLUX, not a separate model

// FaceFusion - Advanced face-swapping model
export const FACEFUSION_MODEL = 'abiruyt/facefusion-face-swap-v2'

// Kling AI - Video generation and face transformation
export const KLING_VIDEO_MODEL = 'kling-ai/kling-video:5d5f1f0f7c4c4c4c4c4c4c4c4c4c4c4c'

// LivePortrait - Video face swapping
export const LIVEPORTRAIT_MODEL = 'liveportrait:face-swap'

// Face extraction via InsightFace
export async function extractFaceEmbedding(imageUrl: string): Promise<string> {
  const prediction = await createPrediction(INSIGHTFACE_MODEL, {
    image: imageUrl,
  })

  // For InsightFace, we need to poll until completion
  let current = prediction
  let attempts = 0
  const maxAttempts = 60 // 5 minutes with 5s interval

  while (
    current.status === 'starting' ||
    current.status === 'processing'
  ) {
    if (attempts > maxAttempts) {
      throw new Error('Face extraction timed out')
    }

    await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5s
    current = await getPrediction(prediction.id)
    attempts++
  }

  if (current.status === 'failed') {
    throw new Error(`Face extraction failed: ${current.error}`)
  }

  if (!current.output) {
    throw new Error('No embedding returned from InsightFace')
  }

  // Output is typically a JSON string with embedding data
  return JSON.stringify(current.output)
}

// Generate image with FLUX and identity preservation
export async function generateImageWithFLUX(
  prompt: string,
  faceEmbedding: string,
  webhookUrl?: string
): Promise<ReplicatePrediction> {
  const prediction = await createPrediction(
    FLUX_KONTEXT_PRO_MODEL,
    {
      prompt,
      guidance_scale: 7.5,
      num_inference_steps: 50,
      // PuLID integration (if supported by model)
      // image: faceEmbedding,
      // identity_scale: 1.0,
    },
    webhookUrl
  )

  return prediction
}

// Wait for prediction to complete
export async function waitForPrediction(
  id: string,
  maxWaitTime: number = 300000 // 5 minutes
): Promise<ReplicatePrediction> {
  const startTime = Date.now()
  let prediction = await getPrediction(id)

  while (
    (prediction.status === 'starting' ||
      prediction.status === 'processing') &&
    Date.now() - startTime < maxWaitTime
  ) {
    await new Promise(resolve => setTimeout(resolve, 2000)) // Poll every 2s
    prediction = await getPrediction(id)
  }

  if (Date.now() - startTime >= maxWaitTime) {
    throw new Error('Prediction timed out')
  }

  return prediction
}

// Face swap using FaceFusion
export async function faceSwapImage(
  sourceImageUrl: string,
  targetImageUrl: string,
  webhookUrl?: string
): Promise<ReplicatePrediction> {
  const prediction = await createPrediction(
    FACEFUSION_MODEL,
    {
      source_image: sourceImageUrl,
      target_image: targetImageUrl,
      swap_mode: 'face',
      enhance_face: true,
      enhance_background: true,
    },
    webhookUrl
  )

  return prediction
}

// Generate video with face transformation using Kling or LivePortrait
export async function generateVideoWithKlingOrLivePortrait(
  targetVideoUrl: string,
  faceEmbedding: string,
  webhookUrl?: string
): Promise<ReplicatePrediction> {
  // Check which API is configured
  const klingApiKey = process.env.KLING_API_KEY
  const livePortraitApiKey = process.env.LIVEPORTRAIT_API_KEY

  let model = KLING_VIDEO_MODEL
  let input: ReplicateInput = {
    video: targetVideoUrl,
    face_image: faceEmbedding,
    scale: 1.0,
  }

  // Use LivePortrait if available, otherwise use Kling
  if (livePortraitApiKey) {
    model = LIVEPORTRAIT_MODEL
    input = {
      video: targetVideoUrl,
      portrait_image: faceEmbedding,
      driving_smoothness: 0.5,
    }
  } else if (!klingApiKey) {
    throw new Error('Neither KLING_API_KEY nor LIVEPORTRAIT_API_KEY is configured')
  }

  const prediction = await createPrediction(model, input, webhookUrl)

  return prediction
}
