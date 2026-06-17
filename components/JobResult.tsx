'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Job {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  mode?: string
  output_image_url?: string
  output_video_url?: string
  error_message?: string
  input_template?: string
  created_at: string
}

export function JobResult({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/generation/${jobId}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError('Job not found')
          } else {
            const data = await response.json()
            setError(data.error || 'Failed to fetch job')
          }
          setIsLoading(false)
          return
        }

        const data = await response.json()
        setJob(data)

        // Stop polling if job is completed or failed
        if (data.status === 'completed' || data.status === 'failed') {
          if (pollingInterval) {
            clearInterval(pollingInterval)
            setPollingInterval(null)
          }
          setIsLoading(false)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch job')
        setIsLoading(false)
      }
    }

    // Initial fetch
    fetchJob()

    // Set up polling for in-progress jobs
    const interval = setInterval(fetchJob, 2000) // Poll every 2 seconds
    setPollingInterval(interval)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [jobId])

  if (isLoading && !job) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="animate-spin mb-4">
          <svg
            className="h-12 w-12 text-indigo-400 mx-auto"
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
        <p className="text-slate-400">Loading your generation...</p>
      </div>
    )
  }

  if (error && !job) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-xl border border-red-900/50 bg-red-900/10 p-6">
          <h2 className="text-lg font-semibold text-red-400 mb-2">Error</h2>
          <p className="text-red-300 mb-4">{error}</p>
          <Link href="/workflow" className="premium-button">
            Try Again
          </Link>
        </div>
      </div>
    )
  }

  if (!job) {
    return null
  }

  // Processing state
  if (job.status === 'processing' || job.status === 'pending') {
    const isVideoMode = job.mode === 'video_transform'
    const processingMessage = job.status === 'pending'
      ? (isVideoMode ? 'Preparing your video transformation...' : 'Preparing your image generation...')
      : (isVideoMode ? 'Transforming video with your face...' : 'Generating your lifestyle image with FLUX AI...')
    const estimatedTime = isVideoMode ? '30-60 seconds' : '15-30 seconds'

    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="premium-card border-indigo-500/30 bg-indigo-900/5 p-8">
          <div className="animate-spin mb-4">
            <svg
              className="h-12 w-12 text-indigo-400 mx-auto"
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
          <h2 className="text-2xl font-bold gradient-text text-center mb-3">
            {isVideoMode ? 'Transforming Your Video' : 'Creating Your Reality'}
          </h2>
          <p className="text-indigo-200/80 text-center mb-2">
            {processingMessage}
          </p>
          <p className="text-sm text-indigo-300/60 text-center">
            This usually takes {estimatedTime}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="premium-card p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white text-sm font-bold">
                ✓
              </div>
              <div className="flex-grow">
                <p className="text-slate-300 text-sm font-medium">Face extracted and ready</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white text-sm font-bold animate-pulse">
                ⟳
              </div>
              <div className="flex-grow">
                <p className="text-slate-300 text-sm font-medium">{isVideoMode ? 'Transforming video' : 'Generating image'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Failed state
  if (job.status === 'failed') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-xl border border-red-900/50 bg-red-900/10 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-red-400 mb-2">Generation Failed</h2>
            <p className="text-red-300 mb-4">{job.error_message || 'Unknown error occurred'}</p>
          </div>
          <div className="space-y-2">
            <Link href="/workflow" className="premium-button w-full">
              Try Again
            </Link>
            <Link href="/" className="premium-button-secondary w-full">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Completed state
  const isVideoMode = job.mode === 'video_transform'
  const outputUrl = isVideoMode ? job.output_video_url : job.output_image_url

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Your Transformation</h1>
        <p className="text-slate-400">
          {isVideoMode ? 'Your face has been seamlessly integrated throughout the video' : "Your lifestyle transformation is ready"}
        </p>
      </div>

      {/* Video Display */}
      {isVideoMode && job.output_video_url && (
        <div className="premium-card overflow-hidden">
          <video
            src={job.output_video_url}
            controls
            className="w-full bg-black"
          />
        </div>
      )}

      {/* Image Display */}
      {!isVideoMode && job.output_image_url && (
        <div className="premium-card overflow-hidden">
          <div className="relative aspect-square">
            <Image
              src={job.output_image_url}
              alt="Generated image"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Download */}
        <a
          href={outputUrl}
          download
          className="premium-card group p-6 text-center hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
        >
          <svg
            className="h-6 w-6 text-indigo-400 mx-auto mb-3 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <h3 className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">Download</h3>
          <p className="text-sm text-slate-400">Save to your device</p>
        </a>

        {/* Share to Social */}
        <button
          onClick={() => {
            const text = 'I just transformed my reality with Delusionify! Check out this AI-generated lifestyle image.'
            const url = window.location.href
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
            window.open(twitterUrl, '_blank')
          }}
          className="premium-card group p-6 text-center hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
        >
          <svg
            className="h-6 w-6 text-indigo-400 mx-auto mb-3 group-hover:scale-110 transition-transform"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8.29 20c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
          <h3 className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">Share</h3>
          <p className="text-sm text-slate-400">Show your friends</p>
        </button>

        {/* Create Another */}
        <Link
          href="/workflow"
          className="premium-card group p-6 text-center hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
        >
          <svg
            className="h-6 w-6 text-indigo-400 mx-auto mb-3 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <h3 className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">Create Another</h3>
          <p className="text-sm text-slate-400">Generate more realities</p>
        </Link>
      </div>

      {/* View History Link */}
      <div className="flex justify-center pt-4">
        <Link href="/history" className="premium-button-secondary">
          View All Generations
        </Link>
      </div>
    </div>
  )
}
