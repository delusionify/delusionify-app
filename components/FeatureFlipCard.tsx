'use client'

import { useState } from 'react'

interface FeatureFlipCardProps {
  title: string
  description: string
  icon: React.ReactNode
  steps: Array<{
    number: number
    title: string
    description: string
  }>
}

export function FeatureFlipCard({ title, description, icon, steps }: FeatureFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className="relative w-full h-80 cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front of card */}
        <div
          className="premium-card p-8 text-center space-y-3 flex flex-col items-center justify-center w-full h-full"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <div className="flex justify-center">{icon}</div>
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          <p className="text-slate-400 text-sm">{description}</p>
          <p className="text-xs text-purple-400 mt-4">Hover to see usage steps</p>
        </div>

        {/* Back of card */}
        <div
          className="premium-card p-6 text-left flex flex-col w-full h-full"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <h3 className="text-base font-semibold text-purple-300 mb-3 flex-shrink-0">How to Use</h3>
          <div className="space-y-2 overflow-hidden">
            {steps.map((step) => (
              <div key={step.number} className="space-y-0.5">
                <div className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold text-xs flex-shrink-0 mt-0.5">{step.number}.</span>
                  <div className="min-w-0">
                    <p className="text-slate-100 text-xs font-medium leading-tight">{step.title}</p>
                    <p className="text-slate-400 text-xs leading-tight">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
