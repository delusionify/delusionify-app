'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function ImageTransformForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!preview) {
      setError('Please select a target image')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Get upload data from session storage
      const uploadData = sessionStorage.getItem('delusionify_upload')
      if (!uploadData) {
        throw new Error('No selfie found. Please upload a photo first.')
      }

      const { selfie_url, embedding } = JSON.parse(uploadData)

      // Create generation job with image_transform mode
      const response = await fetch('/api/generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'image_transform',
          selfie_url,
          input_image_url: preview,
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
      setError(err instanceof Error ? err.message : 'Transformation failed')
      setIsLoading(false)
    }
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

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-4">Transform Your Image</h1>
      <p className="text-slate-400 mb-8">
        Upload a target image and we'll place your face in that scene using advanced face-swapping technology.
      </p>

      {/* Preview */}
      {preview && (
        <div className="mb-8 rounded-lg overflow-hidden border border-slate-600">
          <img
            src={preview}
            alt="Target Image Preview"
            className="w-full max-h-96 object-cover"
          />
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
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-slate-300 mb-2">
          {isLoading ? 'Processing...' : 'Drag and drop your target image here'}
        </p>
        <p className="text-sm text-slate-400">or click to select</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
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
            <p className="text-blue-400">Processing your image transformation...</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <form onSubmit={handleSubmit} className="mb-8">
        <button
          type="submit"
          disabled={isLoading || !preview}
          className={`w-full rounded-lg font-semibold py-3 px-4 transition-all ${
            isLoading || !preview
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin">
                <svg
                  className="h-5 w-5"
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
              <span>Transforming Image...</span>
            </div>
          ) : (
            'Transform Image'
          )}
        </button>
      </form>

      {/* Tips */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h3 className="font-semibold text-white mb-4">Tips for best results</h3>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>✓ Use images with clear, visible people (ideally front-facing)</li>
          <li>✓ Choose high-quality photos with good lighting</li>
          <li>✓ JPG, PNG, or WebP format recommended</li>
          <li>✓ File size should be under 10MB</li>
          <li>✓ Works best with single-person images for cleaner results</li>
        </ul>
      </div>
    </div>
  )
}
