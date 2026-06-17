'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function UploadSelfieForm() {
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

    // Upload file
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-selfie', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      const data = await response.json()

      // Store in session storage for use in next step
      sessionStorage.setItem(
        'delusionify_upload',
        JSON.stringify({
          selfie_url: data.selfie_url,
          embedding: data.embedding,
          embedding_error: data.embedding_error,
        })
      )

      // Redirect to templates
      router.push('/generate')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
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
      <h1 className="text-4xl font-bold text-white mb-4">Upload Your Selfie</h1>
      <p className="text-slate-400 mb-8">
        Choose a clear, well-lit photo of yourself. We'll use AI to place you in luxury lifestyle scenarios.
      </p>

      {/* Preview */}
      {preview && (
        <div className="mb-8 rounded-lg overflow-hidden border border-slate-600">
          <img
            src={preview}
            alt="Preview"
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
          {isLoading ? 'Uploading and analyzing...' : 'Drag and drop your selfie here'}
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
            <p className="text-blue-400">Extracting your face and uploading...</p>
          </div>
        </div>
      )}

      {/* Requirements */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h3 className="font-semibold text-white mb-4">Requirements</h3>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>✓ Clear facial features visible (face filling 30-60% of image)</li>
          <li>✓ Well-lit photo (avoid heavy shadows)</li>
          <li>✓ JPG, PNG, or WebP format</li>
          <li>✓ Max 10MB file size</li>
          <li>✓ Front-facing or slight angle (avoid profile)</li>
        </ul>
      </div>
    </div>
  )
}
