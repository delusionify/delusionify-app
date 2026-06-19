'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { GenerationType } from './GenerationTypeStep'
import { TemplateGallery } from './TemplateGallery'
import type { Template } from './TemplateGallery'


interface GenerationContentStepProps {
  generationType: GenerationType
  onGenerate: (params: any) => void
  isLoading: boolean
}

export function GenerationContentStep({ generationType, onGenerate, isLoading }: GenerationContentStepProps) {
  const router = useRouter()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [imageDragging, setImageDragging] = useState(false)
  const [videoDragging, setVideoDragging] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedDbTemplate, setSelectedDbTemplate] = useState<Template | null>(null)

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    setError(null)
  }

  const handleGenerateTemplate = () => {
    if (!selectedDbTemplate) {
      setError('Please select a template')
      return
    }

    onGenerate({
      mode: 'template',
      template_id: selectedDbTemplate.id,
    })
  }

  const handleGeneratePrompt = () => {
    if (!prompt.trim()) {
      setError('Please describe your desired scenario')
      return
    }

    onGenerate({
      mode: 'prompt',
      input_prompt: prompt,
    })
  }

  const handleImageChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('Image size must be under 50MB')
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    setError(null)
  }

  const handleVideoChange = async (file: File) => {
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid video file (MP4, WebM, MOV)')
      return
    }

    if (file.size > 500 * 1024 * 1024) {
      setError('Video size must be under 500MB')
      return
    }

    setVideoFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setVideoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    setError(null)
  }

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setImageDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleImageChange(files[0])
    }
  }

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setVideoDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleVideoChange(files[0])
    }
  }

  const handleGenerateImage = () => {
    if (!imageFile) {
      setError('Please select an image')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      onGenerate({
        mode: 'image_transform',
        input_image_base64: base64,
      })
    }
    reader.readAsDataURL(imageFile)
  }

  const handleGenerateVideo = () => {
    if (!videoFile) {
      setError('Please select a video')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      onGenerate({
        mode: 'video_transform',
        input_video_base64: base64,
      })
    }
    reader.readAsDataURL(videoFile)
  }

  if (generationType === 'template') {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-3">Choose a Lifestyle Scene</h2>
          <p className="text-slate-400 text-lg">
            Browse and select a template to place yourself in an aspirational scenario
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-900/50 bg-red-900/10 p-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <TemplateGallery
          onSelect={(template) => {
            setSelectedDbTemplate(template)
            setError(null)
          }}
          selectedTemplate={selectedDbTemplate}
        />

        <button
          onClick={handleGenerateTemplate}
          disabled={!selectedDbTemplate || isLoading}
          className="premium-button w-full"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>
    )
  }

  if (generationType === 'prompt') {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-3">Describe Your Vision</h2>
          <p className="text-slate-400 text-lg">
            Write a detailed description of your ideal lifestyle scenario
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-900/50 bg-red-900/10 p-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <label className="block">
            <span className="text-slate-200 font-medium mb-3 block">Your Scenario</span>
            <textarea
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value)
                setError(null)
              }}
              disabled={isLoading}
              placeholder="Me dining on a yacht in the Mediterranean, sunset lighting, luxury atmosphere..."
              className="premium-input resize-none h-32"
            />
          </label>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-sm text-slate-400 mb-3 font-medium">Example prompts</p>
            <div className="space-y-2">
              <button
                onClick={() => setPrompt('Speaking at a prestigious tech conference, cinematic lighting, professional atmosphere')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Speaking at a prestigious tech conference
              </button>
              <button
                onClick={() => setPrompt('Relaxing in a luxury spa overlooking mountain views, peaceful atmosphere, natural lighting')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Relaxing in a luxury spa overlooking mountain views
              </button>
              <button
                onClick={() => setPrompt('Walking through exclusive designer boutiques in Paris, sophisticated atmosphere, premium aesthetic')}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Walking through exclusive designer boutiques in Paris
              </button>
            </div>
          </div>
        </div>

        <button onClick={handleGeneratePrompt} disabled={!prompt.trim() || isLoading} className="premium-button w-full">
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>
    )
  }

  if (generationType === 'image') {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-3">Upload Target Image</h2>
          <p className="text-slate-400 text-lg">
            Select an image and we'll place you into the scene
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-900/50 bg-red-900/10 p-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {imagePreview && (
          <div className="rounded-xl overflow-hidden border border-slate-800 shadow-xl">
            <img src={imagePreview} alt="Preview" className="w-full max-h-96 object-cover" />
          </div>
        )}

        <div
          className={`rounded-xl border-2 border-dashed transition-all p-16 text-center cursor-pointer ${
            imageDragging
              ? 'border-indigo-500 bg-indigo-500/5'
              : 'border-slate-700 bg-slate-800/50 hover:border-indigo-500/50'
          } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
          onDrop={handleImageDrop}
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setImageDragging(true)
          }}
          onDragLeave={() => setImageDragging(false)}
          onClick={() => imageInputRef.current?.click()}
        >
          <svg className="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-slate-200 mb-2 text-lg font-medium">
            {isLoading ? 'Processing...' : 'Drag and drop your image here'}
          </p>
          <p className="text-sm text-slate-400">or click to select</p>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.currentTarget.files?.[0]) {
                handleImageChange(e.currentTarget.files[0])
              }
            }}
            disabled={isLoading}
          />
        </div>

        <button onClick={handleGenerateImage} disabled={!imageFile || isLoading} className="premium-button w-full">
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>
    )
  }

  if (generationType === 'video') {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-3">Upload Target Video</h2>
          <p className="text-slate-400 text-lg">
            Select a video and we'll place you into it
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-900/50 bg-red-900/10 p-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <div
          className={`rounded-xl border-2 border-dashed transition-all p-16 text-center cursor-pointer ${
            videoDragging
              ? 'border-indigo-500 bg-indigo-500/5'
              : 'border-slate-700 bg-slate-800/50 hover:border-indigo-500/50'
          } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
          onDrop={handleVideoDrop}
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setVideoDragging(true)
          }}
          onDragLeave={() => setVideoDragging(false)}
          onClick={() => videoInputRef.current?.click()}
        >
          <svg className="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-slate-200 mb-2 text-lg font-medium">
            {isLoading ? 'Processing...' : 'Drag and drop your video here'}
          </p>
          <p className="text-sm text-slate-400">or click to select (MP4, WebM, MOV)</p>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              if (e.currentTarget.files?.[0]) {
                handleVideoChange(e.currentTarget.files[0])
              }
            }}
            disabled={isLoading}
          />
        </div>

        {videoFile && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-sm text-slate-300">
              Video selected: <span className="font-medium text-slate-100">{videoFile.name}</span>
            </p>
          </div>
        )}

        <button onClick={handleGenerateVideo} disabled={!videoFile || isLoading} className="premium-button w-full">
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>
    )
  }

  return null
}
