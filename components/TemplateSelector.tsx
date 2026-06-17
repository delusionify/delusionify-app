'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

export function TemplateSelector() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectTemplate = async (templateId: string, prompt: string) => {
    setSelectedTemplate(templateId)
    setIsLoading(true)
    setError(null)

    try {
      // Get upload data from session storage
      const uploadData = sessionStorage.getItem('delusionify_upload')
      if (!uploadData) {
        throw new Error('No selfie found. Please upload a photo first.')
      }

      const { selfie_url, embedding } = JSON.parse(uploadData)

      // Create generation job
      const response = await fetch('/api/generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'template',
          selfie_url,
          input_template: templateId,
          template_prompt: prompt,
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
      setSelectedTemplate(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-4">Choose a Lifestyle</h1>
      <p className="text-slate-400 mb-12">
        Select a template to place yourself in an aspirational scenario
      </p>

      {error && (
        <div className="mb-8 rounded-lg border border-red-900/30 bg-red-900/10 p-4">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.href = '/upload'}
            className="mt-2 text-red-300 hover:text-red-200 text-sm underline"
          >
            Go back to upload
          </button>
        </div>
      )}

      {/* Template Grid by Category */}
      {TEMPLATE_CATEGORIES.map((category) => (
        <div key={category.name} className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">{category.name}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {category.templates.map((template) => (
              <div
                key={template.id}
                className={`rounded-lg border transition-all overflow-hidden cursor-pointer ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600 hover:bg-slate-700'
                } ${isLoading && selectedTemplate === template.id ? 'opacity-70 pointer-events-none' : ''}`}
                onClick={() => !isLoading && handleSelectTemplate(template.id, template.prompt)}
              >
                {/* Image Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center relative overflow-hidden">
                  <svg
                    className="h-12 w-12 text-slate-600"
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

                  {/* Loading Spinner */}
                  {isLoading && selectedTemplate === template.id && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="animate-spin">
                        <svg
                          className="h-8 w-8 text-blue-400"
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
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                  <p className="text-sm text-slate-400 mt-2">{template.description}</p>

                  {selectedTemplate === template.id && !isLoading && (
                    <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm font-medium">
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

                  {isLoading && selectedTemplate === template.id && (
                    <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm font-medium">
                      <div className="animate-spin">
                        <svg
                          className="h-4 w-4"
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
                      Generating...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
