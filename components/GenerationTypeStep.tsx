'use client'

import { useState } from 'react'

export type GenerationType = 'template' | 'prompt' | 'image' | 'video'

interface GenerationTypeStepProps {
  onSelect: (type: GenerationType) => void
  selectedType?: GenerationType | null
}

export function GenerationTypeStep({ onSelect, selectedType }: GenerationTypeStepProps) {
  const [hoveredType, setHoveredType] = useState<GenerationType | null>(null)

  const types: Array<{
    id: GenerationType
    title: string
    description: string
    icon: React.ReactNode
  }> = [
    {
      id: 'template',
      title: 'From Template',
      description: 'Choose from curated lifestyle scenarios',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 6a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4z"
          />
        </svg>
      ),
    },
    {
      id: 'prompt',
      title: 'From Prompt',
      description: 'Describe your ideal scenario',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
    {
      id: 'image',
      title: 'From Image',
      description: 'Place yourself in any image',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: 'video',
      title: 'From Video',
      description: 'Appear in any video scene',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      ),
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold gradient-text mb-3">Choose Generation Type</h2>
        <p className="text-slate-400 text-lg">
          Select how you'd like to generate your transformation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {types.map((type) => {
          const isSelected = selectedType === type.id
          const isHovered = hoveredType === type.id

          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              onMouseEnter={() => setHoveredType(type.id)}
              onMouseLeave={() => setHoveredType(null)}
              className={`premium-card group p-8 text-left transition-all duration-300 ${
                isSelected
                  ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105'
                  : isHovered
                    ? 'border-indigo-500/50 scale-102'
                    : ''
              }`}
            >
              <div
                className={`inline-flex items-center justify-center h-16 w-16 rounded-xl mb-4 transition-all duration-300 ${
                  isSelected || isHovered
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40'
                    : 'bg-slate-800 text-indigo-400'
                }`}
              >
                {type.icon}
              </div>

              <h3 className="text-xl font-semibold text-slate-100 mb-2 group-hover:text-indigo-300 transition-colors">
                {type.title.replace(/'/g, '&apos;')}
              </h3>
              <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
                {type.description}
              </p>

              {isSelected && (
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
            </button>
          )
        })}
      </div>
    </div>
  )
}
