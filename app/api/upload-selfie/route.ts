import { auth } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import { extractFaceEmbedding } from '@/lib/replicate'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get form data with file
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB' }, { status: 400 })
    }

    // Upload to Supabase Storage
    const fileName = `${userId}-${Date.now()}.${file.name.split('.').pop()}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('selfies')
      .upload(`${userId}/${fileName}`, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('selfies')
      .getPublicUrl(`${userId}/${fileName}`)

    const publicUrl = urlData.publicUrl

    // Extract face embedding using InsightFace
    let embedding = null
    let embeddingError = null

    try {
      const embeddingJson = await extractFaceEmbedding(publicUrl)
      embedding = embeddingJson
    } catch (error) {
      console.error('Face extraction error:', error)
      embeddingError = error instanceof Error ? error.message : 'Face extraction failed'
      // Don't fail here - user can still proceed, but without identity preservation
    }

    return NextResponse.json(
      {
        success: true,
        selfie_url: publicUrl,
        embedding: embedding ? JSON.parse(embedding) : null,
        embedding_error: embeddingError,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    )
  }
}
