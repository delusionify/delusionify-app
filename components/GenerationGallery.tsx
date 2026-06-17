'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Job {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  output_image_url?: string
  input_template?: string
  created_at: string
  error_message?: string
}

export function GenerationGallery() {
  const [generations, setGenerations] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGenerations = async () => {
      try {
        const response = await fetch('/api/generations')

        if (!response.ok) {
          const data = await response.json()
          setError(data.error || 'Failed to fetch generations')
          setIsLoading(false)
          return
        }

        const data = await response.json()
        setGenerations(data)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch generations')
        setIsLoading(false)
      }
    }

    fetchGenerations()
  }, [])

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin mb-4">
          <svg
            className="h-12 w-12 text-blue-400 mx-auto"
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
        <p className="text-slate-400">Loading your generations...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-900/30 bg-red-900/10 p-6">
        <p className="text-red-400 mb-4">{error}</p>
        <Link
          href="/upload"
          className="inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Start Creating
        </Link>
      </div>
    )
  }

  if (generations.length === 0) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-slate-500 mb-4"
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
        <p className="text-slate-400 mb-4">No generations yet. Start by uploading a selfie!</p>
        <Link
          href="/upload"
          className="inline-block rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Upload Selfie
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {generations.map((gen) => (
          <div
            key={gen.id}
            className="rounded-lg border border-slate-700 bg-slate-800 overflow-hidden hover:border-slate-600 hover:bg-slate-700 transition-all"
          >
            {/* Image */}
            {gen.output_image_url ? (
              <Link href={`/result/${gen.id}`}>
                <div className="relative aspect-square overflow-hidden cursor-pointer group">
                  <Image
                    src={gen.output_image_url}
                    alt={`Generation ${gen.id}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              </Link>
            ) : (
              <div className="aspect-square bg-slate-700 flex items-center justify-center">
                {gen.status === 'processing' || gen.status === 'pending' ? (
                  <div className="text-center">
                    <div className="animate-spin">
                      <svg
                        className="h-8 w-8 text-blue-400 mx-auto mb-2"
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
                    <p className="text-sm text-slate-400">Generating...</p>
                  </div>
                ) : gen.status === 'failed' ? (
                  <div className="text-center">
                    <svg className="h-8 w-8 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="text-sm text-red-400">Failed</p>
                  </div>
                ) : (
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
                )}
              </div>
            )}

            {/* Info */}
            <div className="p-4">
              <h3 className="font-semibold text-white truncate">{gen.input_template || 'Custom'}</h3>
              <p className="text-sm text-slate-400 mt-1">
                {new Date(gen.created_at).toLocaleDateString()}
              </p>

              {gen.status === 'completed' && gen.output_image_url && (
                <div className="mt-3 space-y-2">
                  <Link
                    href={`/result/${gen.id}`}
                    className="block rounded bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    View & Share
                  </Link>
                  <a
                    href={gen.output_image_url}
                    download
                    className="block rounded border border-slate-600 px-3 py-2 text-center text-sm font-medium text-slate-300 hover:border-slate-500 hover:bg-slate-700 transition-colors"
                  >
                    Download
                  </a>
                </div>
              )}

              {gen.status === 'failed' && gen.error_message && (
                <p className="mt-3 text-xs text-red-400">{gen.error_message}</p>
              )}

              {(gen.status === 'processing' || gen.status === 'pending') && (
                <Link
                  href={`/result/${gen.id}`}
                  className="mt-3 block rounded bg-blue-600/50 px-3 py-2 text-center text-sm font-medium text-blue-200 hover:bg-blue-600 transition-colors"
                >
                  Check Status
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create More Button */}
      <div className="mt-12 text-center">
        <Link
          href="/upload"
          className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Create More Realities
        </Link>
      </div>
    </div>
  )
}
