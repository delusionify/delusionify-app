'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_FORMATS = ['video/mp4', 'video/webm', 'video/quicktime']

export function VideoTransformForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileSize, setFileSize] = useState<string | null>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const handleFile = async (file: File) => {
    // Validate file type
    if (!ALLOWED_FORMATS.includes(file.type)) {
      setError('Please select a video file (MP4, WebM, or MOV)')
      return
    }

    // Validate file size
    if (file.size > MAX_VIDEO_SIZE) {
      setError(`File size must be under 50MB (current: ${formatFileSize(file.size)})`)
      return
    }

    setSelectedFile(file)
    setFileSize(formatFileSize(file.size))
    setError(null)

    // Create preview URL
    const videoUrl = URL.createObjectURL(file)
    setPreview(videoUrl)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      setError('Please select a video file')
      return
    }

    // Get upload data from session storage
    const uploadData = sessionStorage.getItem('delusionify_upload')
    if (!uploadData) {
      setError('No selfie found. Please upload a photo first.')
      router.push('/upload')
      return
    }

    const { selfie_url, embedding } = JSON.parse(uploadData)

    setIsLoading(true)
    setError(null)

    try {
      // Upload video file
      const formData = new FormData()
      formData.append('file', selectedFile)

      const uploadResponse = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const data = await uploadResponse.json()
        throw new Error(data.error || 'Video upload failed')
      }

      const uploadData = await uploadResponse.json()
      const input_video_url = uploadData.video_url

      // Create generation job
      const response = await fetch('/api/generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'video_transform',
          selfie_url,
          input_video_url,
          face_embedding: embedding,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create generation job')
      }

      const job = await response.json()

      // Store job in session and redirect to results
      sessionStorage.setItem('delusionify_job', JSON.stringify(job))
      router.push(`/result/${job.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-4">Transform Video</h1>
      <p className="text-slate-400 mb-8">
        Upload a video and we'll place your face throughout it. Works with any video: people dancing, speaking, eating, or any other action.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Video Preview */}
        {preview && (
          <div className="mb-8 rounded-lg overflow-hidden border border-slate-600">
            <video
              src={preview}
              controls
              className="w-full max-h-96 bg-black"
            />
            {fileSize && (
              <div className="bg-slate-800 px-4 py-2 text-sm text-slate-300">
                File size: {fileSize}
              </div>
            )}
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`rounded-lg border-2 border-dashed transition-all mb-8 p-12 text-center cursor-pointer ${
            isDragging
              ? 'border-blue-500 bg-blue-500/5'
              : 'border-slate-600 bg-slate-800 hover:border-slate-500'
          } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <svg
            className="mx-auto h-12 w-12 text-slate-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-slate-300 mb-2">
            {isLoading ? 'Uploading video...' : 'Drag and drop your video here'}
          </p>
          <p className="text-sm text-slate-400">or click to select</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 rounded-lg border border-red-900/30 bg-red-900/10 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mb-8 rounded-lg border border-blue-900/30 bg-blue-900/10 p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <p className="text-blue-400">Processing your video...</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !selectedFile}
          className={`w-full rounded-lg py-3 px-4 font-semibold transition-all ${
            isLoading || !selectedFile
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Processing...' : 'Transform Video'}
        </button>
      </form>

      {/* Requirements */}
      <div className="mt-8 rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h3 className="font-semibold text-white mb-4">Requirements</h3>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>✓ Video format: MP4, WebM, or MOV</li>
          <li>✓ Max file size: 50MB</li>
          <li>✓ Any video content: people dancing, speaking, eating, etc.</li>
          <li>✓ Processing time: 30-60 seconds</li>
          <li>✓ Clear face in your selfie for best results</li>
        </ul>
      </div>
    </div>
  )
}
