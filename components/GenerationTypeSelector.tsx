'use client'

export type GenerationType = 'template' | 'custom' | 'reference'

interface GenerationTypeSelectorProps {
  onSelect: (type: GenerationType) => void
}

const FLOW_OPTIONS = [
  {
    type: 'template' as GenerationType,
    title: 'Templates',
    description: 'Choose from 259+ curated luxury lifestyle scenes',
    icon: '🎨',
    steps: ['Upload Selfie', 'Choose Template', 'Select Dimensions', 'Generate'],
    color: 'from-blue-600 to-blue-700',
    features: ['Face-swap technology', 'Instant generation', 'Professional quality'],
  },
  {
    type: 'custom' as GenerationType,
    title: 'Custom Prompt',
    description: 'Describe any scenario you can imagine in detail',
    icon: '✨',
    steps: ['Upload Selfie', 'Write Prompt', 'Select Dimensions', 'Generate'],
    color: 'from-purple-600 to-purple-700',
    features: ['Full creative control', 'AI-enhanced prompts', 'Unlimited scenarios'],
  },
  {
    type: 'reference' as GenerationType,
    title: 'From Reference',
    description: 'Use Instagram, TikTok, or Facebook posts as inspiration',
    icon: '📱',
    steps: ['Upload Selfie', 'Share Post URL', 'Select Dimensions', 'Generate'],
    color: 'from-pink-600 to-pink-700',
    features: ['Extract from social media', 'Face mapping', 'Style transfer'],
  },
]

export function GenerationTypeSelector({ onSelect }: GenerationTypeSelectorProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text">Choose Your Generation Method</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Each method has a distinct workflow optimized for different creative needs
        </p>
      </div>

      {/* Flow Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FLOW_OPTIONS.map((option) => (
          <button
            key={option.type}
            onClick={() => onSelect(option.type)}
            className={`group relative p-8 rounded-2xl border-2 border-slate-700 bg-gradient-to-br ${option.color} bg-opacity-10 hover:bg-opacity-20 transition-all hover:border-slate-600 overflow-hidden`}
          >
            {/* Background gradient effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

            {/* Content */}
            <div className="relative space-y-4">
              {/* Icon */}
              <div className="text-5xl">{option.icon}</div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-slate-100 text-left">{option.title}</h2>

              {/* Description */}
              <p className="text-slate-300 text-left text-sm">{option.description}</p>

              {/* Steps */}
              <div className="space-y-2 py-4 border-t border-slate-600">
                <p className="text-xs font-semibold text-slate-400 uppercase">Workflow Steps:</p>
                <div className="space-y-1">
                  {option.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                        {idx + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 pt-4 border-t border-slate-600">
                {option.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-xs text-slate-300">
                    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <div className="inline-block px-6 py-2 rounded-lg bg-slate-700 text-slate-100 font-semibold group-hover:bg-slate-600 transition-colors">
                  Start Here →
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Info Box */}
      <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6 space-y-3">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-slate-100">Can't decide?</p>
            <p className="text-sm text-slate-400">
              Start with <span className="font-medium text-slate-300">Templates</span> for the fastest results, or <span className="font-medium text-slate-300">Custom Prompt</span> for complete creative control
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
