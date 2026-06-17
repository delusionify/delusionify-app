'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const EXAMPLE_PROMPTS = [
  'Me dining on a luxury superyacht in the Mediterranean',
  'Speaking at a TED conference on an iconic stage',
  'At the top of Mount Everest with a breathtaking view',
  'Relaxing in a private jet with champagne',
  'In a Michelin-starred restaurant enjoying fine dining',
  'Walking the red carpet at a major film premiere',
  'Surfing massive waves in Hawaii at sunset',
  'At the helm of a luxury sports car on a coastal road',
]

export function PromptInput() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) {
      setError('Please enter a prompt')
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

      // Create generation job with prompt mode
      const response = await fetch('/api/generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'prompt',
          selfie_url,
          input_prompt: prompt,
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

  const handleSelectExample = (examplePrompt: string) => {
    setPrompt(examplePrompt)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-4">Write Your Custom Prompt</h1>
      <p className="text-slate-400 mb-8">
        Describe an aspirational scenario you'd like to see yourself in. Be creative and specific!
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

      {/* Example Prompts */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Example prompts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {EXAMPLE_PROMPTS.map((example, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectExample(example)}
              className="text-left rounded-lg border border-slate-700 bg-slate-800 p-3 hover:border-slate-600 hover:bg-slate-700 transition-all"
            >
              <p className="text-sm text-slate-300 line-clamp-2">{example}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">
            Your prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Me dining on a luxury superyacht in the Mediterranean, golden hour lighting, premium interior..."
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            rows={6}
            disabled={isLoading}
          />
          <p className="mt-2 text-xs text-slate-400">
            {prompt.length} characters • Be specific about location, clothing, lighting, and mood
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`w-full rounded-lg font-semibold py-3 px-4 transition-all ${
            isLoading || !prompt.trim()
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
              <span>Enhancing prompt and generating...</span>
            </div>
          ) : (
            'Generate My Image'
          )}
        </button>
      </form>

      {/* Tips */}
      <div className="mt-12 rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h3 className="font-semibold text-white mb-4">Tips for better results</h3>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>✓ Include specific locations (luxury yacht, private jet, mountain peak)</li>
          <li>✓ Describe the lighting and atmosphere (golden hour, candlelit, sunset)</li>
          <li>✓ Mention clothing or accessories relevant to the scene</li>
          <li>✓ Add mood and emotions (celebratory, sophisticated, adventurous)</li>
          <li>✓ Be descriptive but concise (2-3 sentences works best)</li>
        </ul>
      </div>
    </div>
  )
}
