'use client'

import { useState } from 'react'

interface ReferenceURLInputProps {
  onSelect: (url: string, isVideo: boolean) => void
}

export function ReferenceURLInput({ onSelect }: ReferenceURLInputProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const validateAndSubmit = async () => {
    setError(null)

    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    // Simple URL validation
    try {
      const urlObj = new URL(url)
      const isValidPlatform = ['instagram.com', 'facebook.com', 'tiktok.com', 'twitter.com', 'x.com'].some(
        domain => urlObj.hostname.includes(domain)
      )

      if (!isValidPlatform) {
        setError('Please enter a valid Instagram, Facebook, TikTok, or Twitter/X link')
        return
      }

      setIsLoading(true)

      // Detect if it's a video URL
      const isVideo = urlObj.href.includes('reel') || urlObj.href.includes('video') || urlObj.href.includes('/v/')

      onSelect(url, isVideo)
    } catch {
      setError('Please enter a valid URL')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-2">Reference Image or Video</h3>
        <p className="text-sm text-slate-400">
          Share a link from Instagram, Facebook, TikTok, or Twitter/X. We'll extract and analyze it.
        </p>
      </div>

      {/* URL Input */}
      <div className="space-y-3">
        <label className="block">
          <span className="text-slate-200 font-medium mb-2 block">Post URL</span>
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setError(null)
            }}
            placeholder="https://instagram.com/p/... or https://tiktok.com/@.../video/..."
            className="w-full px-4 py-3 bg-slate-900 border border-purple-600/30 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
          />
        </label>

        {error && (
          <div className="rounded-lg border border-red-900/50 bg-red-900/10 p-3">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Platform Examples */}
        <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-4 space-y-2">
          <p className="text-sm font-medium text-slate-300">Supported Platforms:</p>
          <div className="space-y-1">
            <p className="text-xs text-slate-400">
              📸 <span className="font-mono text-slate-300">instagram.com/p/ABC123...</span>
            </p>
            <p className="text-xs text-slate-400">
              🎬 <span className="font-mono text-slate-300">instagram.com/reel/ABC123...</span>
            </p>
            <p className="text-xs text-slate-400">
              👥 <span className="font-mono text-slate-300">facebook.com/watch/?v=ABC123</span>
            </p>
            <p className="text-xs text-slate-400">
              🎵 <span className="font-mono text-slate-300">tiktok.com/@user/video/123456</span>
            </p>
            <p className="text-xs text-slate-400">
              𝕏 <span className="font-mono text-slate-300">twitter.com/user/status/123456</span>
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={validateAndSubmit}
        disabled={!url.trim() || isLoading}
        className="premium-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Extracting...' : 'Extract & Continue'}
      </button>

      {/* Info Box */}
      <div className="rounded-lg bg-blue-900/10 border border-blue-700/30 p-4">
        <p className="text-sm text-blue-200">
          💡 <span className="font-medium">Tip:</span> Use public posts for best results. We'll extract the image/video and map the person for faceswap transformation.
        </p>
      </div>
    </div>
  )
}
