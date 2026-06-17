'use client'

import { useState, useRef } from 'react'

interface SelfieUploadStepProps {
  onSuccess: (data: { selfie_url: string; embedding: any; embedding_error?: string }) => void
  isLoading?: boolean
}

export function SelfieUploadStep({ onSuccess, isLoading = false }: SelfieUploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    setUploadLoading(true)
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
      onSuccess({
        selfie_url: data.selfie_url,
        embedding: data.embedding,
        embedding_error: data.embedding_error,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setUploadLoading(false)
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
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold gradient-text mb-3">Upload Your Selfie</h2>
        <p className="text-slate-400 text-lg">
          Choose a clear, well-lit photo of yourself. We'll use AI to place you in luxury lifestyle scenarios.
        </p>
      </div>

      {preview && (
        <div className="rounded-xl overflow-hidden border border-slate-800 shadow-xl">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-96 object-cover"
            loading="eager"
          />
        </div>
      )}

      <div
        className={`rounded-xl border-2 border-dashed transition-all p-16 text-center cursor-pointer ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/5'
            : 'border-slate-700 bg-slate-800/50 hover:border-indigo-500/50'
        } ${uploadLoading || isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg
          className="mx-auto h-16 w-16 text-slate-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-slate-200 mb-2 text-lg font-medium">
          {uploadLoading || isLoading ? 'Uploading and analyzing...' : 'Upload your selfie to begin'}
        </p>
        <p className="text-sm text-slate-400">Drag and drop or click to select</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
          disabled={uploadLoading || isLoading}
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-900/50 bg-red-900/10 p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {(uploadLoading || isLoading) && (
        <div className="rounded-xl border border-indigo-900/30 bg-indigo-900/10 p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin">
              <svg
                className="h-5 w-5 text-indigo-400"
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
            <p className="text-indigo-300">Processing your photo...</p>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <h3 className="font-semibold text-slate-100">Photo Requirements</h3>
        <ul className="space-y-2 text-sm text-slate-400">
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">✓</span>
            <span>Clear facial features visible (face filling 30-60% of image)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">✓</span>
            <span>Well-lit photo (avoid heavy shadows)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">✓</span>
            <span>JPG, PNG, or WebP format</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">✓</span>
            <span>Max 10MB file size</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">✓</span>
            <span>Front-facing or slight angle (avoid profile)</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
