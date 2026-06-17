'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { GenerationType } from './GenerationTypeStep'

const TEMPLATE_CATEGORIES = [
  {
    name: 'Founder Pack',
    templates: [
      {
        id: 'ted-stage',
        name: 'TED Stage',
        description: 'Speaking at a world-class conference stage',
        prompt: 'Professional speaker giving a presentation on a grand TED-style stage, cinematic lighting, high production value, audience in background, premium event atmosphere',
      },
      {
        id: 'podcast',
        name: 'Podcast Studio',
        description: 'Professional podcast interview setup',
        prompt: 'Sitting in a professional podcast studio with high-end microphone, comfortable studio setting, warm lighting, professional atmosphere, podcast equipment visible',
      },
      {
        id: 'conference',
        name: 'Business Conference',
        description: 'Networking at a premium business conference',
        prompt: 'At a luxury business conference, modern venue, professional networking event, premium atmosphere, business casual attire, networking background',
      },
    ],
  },
  {
    name: 'Luxury Pack',
    templates: [
      {
        id: 'private-jet',
        name: 'Private Jet',
        description: 'Boarding or relaxing in a private jet',
        prompt: 'Inside a luxury private jet cabin, comfortable seating, high-end interior, window view of clouds, premium aircraft setting, cinematic lighting',
      },
      {
        id: 'yacht',
        name: 'Yacht',
        description: 'Luxury yacht in exotic waters',
        prompt: 'On a luxury yacht in tropical waters, beautiful ocean background, sunset lighting, premium yacht deck, lifestyle aesthetic, cinematic photography',
      },
      {
        id: 'penthouse',
        name: 'Penthouse',
        description: 'Modern luxury penthouse with city view',
        prompt: 'In a modern luxury penthouse apartment, floor-to-ceiling windows, city skyline background, elegant interior design, sunset lighting, premium aesthetic',
      },
      {
        id: 'michelin',
        name: 'Michelin Restaurant',
        description: 'Fine dining at a Michelin-starred restaurant',
        prompt: 'Dining at an upscale Michelin-starred restaurant, elegant table setting, premium presentation, sophisticated atmosphere, fine dining aesthetic, mood lighting',
      },
    ],
  },
  {
    name: 'Travel Pack',
    templates: [
      {
        id: 'maldives',
        name: 'Maldives',
        description: 'Tropical island paradise with overwater bungalow',
        prompt: 'In the Maldives on a tropical island, clear turquoise water, white sand beach, overwater bungalow, sunset atmosphere, paradise setting, luxury travel',
      },
      {
        id: 'dubai',
        name: 'Dubai',
        description: 'Luxury Dubai with iconic architecture',
        prompt: 'In Dubai, modern luxury city, iconic architecture, gold-lit buildings, luxury shopping area, sunset lighting, premium urban lifestyle, cinematic',
      },
      {
        id: 'monaco',
        name: 'Monaco',
        description: 'Glamorous Mediterranean coast',
        prompt: 'In Monaco on the French Riviera, glamorous coastline, Mediterranean sea, luxury yacht background, premium atmosphere, sunset lighting, high-end lifestyle',
      },
      {
        id: 'santorini',
        name: 'Santorini',
        description: 'Iconic Greek island with sunset views',
        prompt: 'In Santorini Greece, white buildings and blue domes, Mediterranean views, golden hour sunset, romantic atmosphere, luxury travel aesthetic, cinematic',
      },
    ],
  },
]

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

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    setError(null)
  }

  const handleGenerateTemplate = () => {
    if (!selectedTemplate) {
      setError('Please select a template')
      return
    }

    const template = TEMPLATE_CATEGORIES.flatMap((c) => c.templates).find(
      (t) => t.id === selectedTemplate
    )

    if (!template) {
      setError('Template not found')
      return
    }

    onGenerate({
      mode: 'template',
      template_id: selectedTemplate,
      template_prompt: template.prompt,
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
          <h2 className="text-3xl font-bold gradient-text mb-3">Choose a Lifestyle</h2>
          <p className="text-slate-400 text-lg">
            Select a template to place yourself in an aspirational scenario
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-900/50 bg-red-900/10 p-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <div className="space-y-12">
          {TEMPLATE_CATEGORIES.map((category) => (
            <div key={category.name}>
              <h3 className="text-2xl font-semibold text-slate-100 mb-6">{category.name}</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    disabled={isLoading}
                    className={`premium-card group overflow-hidden text-left transition-all duration-300 ${
                      selectedTemplate === template.id
                        ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
                        : ''
                    } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
                      <svg className="h-12 w-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>

                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-slate-100">{template.name}</h4>
                      <p className="text-sm text-slate-400 mt-2">{template.description}</p>

                      {selectedTemplate === template.id && (
                        <div className="mt-4 flex items-center gap-2 text-indigo-400 text-sm font-medium">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Selected
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleGenerateTemplate} disabled={!selectedTemplate || isLoading} className="premium-button w-full">
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
