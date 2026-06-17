import { updateJobStatus, supabaseServer } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Replicate sends webhook with status updates
    const { id, status, output, error } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing job ID' }, { status: 400 })
    }

    // Map Replicate status to our status
    let jobStatus: 'pending' | 'processing' | 'completed' | 'failed' = 'processing'
    if (status === 'succeeded') jobStatus = 'completed'
    if (status === 'failed' || status === 'canceled') jobStatus = 'failed'

    // Update job with result
    const updates: any = { status: jobStatus }

    if (jobStatus === 'completed' && output) {
      // Output is typically a URL for the generated image
      updates.output_image_url = output
    }

    if (jobStatus === 'failed') {
      updates.error_message = error || 'Generation failed'
    }

    await updateJobStatus(id, jobStatus, updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}
