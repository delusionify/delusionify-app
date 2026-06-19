'use client'

interface Dimension {
  label: string
  ratio: string
  width: number
  height: number
  platforms: string[]
}

const DIMENSIONS: Dimension[] = [
  {
    label: 'Square',
    ratio: '1:1',
    width: 1024,
    height: 1024,
    platforms: ['Instagram Post', 'Facebook Post', 'Avatar'],
  },
  {
    label: 'Instagram Story',
    ratio: '9:16',
    width: 1080,
    height: 1920,
    platforms: ['Instagram Story', 'TikTok', 'Reels'],
  },
  {
    label: 'YouTube Thumbnail',
    ratio: '16:9',
    width: 1280,
    height: 720,
    platforms: ['YouTube', 'Twitch', 'Discord'],
  },
  {
    label: 'Facebook Banner',
    ratio: '16:9',
    width: 1200,
    height: 675,
    platforms: ['Facebook Cover', 'LinkedIn Banner'],
  },
  {
    label: 'Twitter/X',
    ratio: '3:1',
    width: 1500,
    height: 500,
    platforms: ['Twitter Header', 'LinkedIn Article'],
  },
  {
    label: 'Portrait',
    ratio: '3:4',
    width: 768,
    height: 1024,
    platforms: ['Portfolio', 'Gallery', 'Print'],
  },
]

interface DimensionSelectorProps {
  onSelect: (dimension: Dimension) => void
  selected?: Dimension | null
}

export function DimensionSelector({ onSelect, selected }: DimensionSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Output Dimensions</h3>
        <p className="text-sm text-slate-400 mb-6">Choose the format for your generated image</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {DIMENSIONS.map((dimension) => (
          <button
            key={dimension.ratio}
            onClick={() => onSelect(dimension)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selected?.ratio === dimension.ratio
                ? 'border-purple-500 bg-purple-600/10'
                : 'border-slate-700 bg-slate-800/30 hover:border-purple-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-slate-100">{dimension.label}</h4>
              <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">
                {dimension.ratio}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              {dimension.width} × {dimension.height}px
            </p>
            <div className="flex flex-wrap gap-1">
              {dimension.platforms.map((platform) => (
                <span key={platform} className="text-xs bg-slate-700/50 px-2 py-0.5 rounded text-slate-300">
                  {platform}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export type { Dimension }
