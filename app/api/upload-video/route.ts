import { auth } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_FORMATS = ['video/mp4', 'video/webm', 'video/quicktime']

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

    // Validate file type
    if (!ALLOWED_FORMATS.includes(file.type)) {
      return NextResponse.json(
        { error: 'File must be a video (MP4, WebM, or MOV)' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      )
    }

    // Upload to Supabase Storage
    const fileName = `${userId}-${Date.now()}.${getFileExtension(file.type)}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
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
      .from('videos')
      .getPublicUrl(`${userId}/${fileName}`)

    const publicUrl = urlData.publicUrl

    return NextResponse.json(
      {
        success: true,
        video_url: publicUrl,
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

function getFileExtension(mimeType: string): string {
  switch (mimeType) {
    case 'video/mp4':
      return 'mp4'
    case 'video/webm':
      return 'webm'
    case 'video/quicktime':
      return 'mov'
    default:
      return 'mp4'
  }
}
