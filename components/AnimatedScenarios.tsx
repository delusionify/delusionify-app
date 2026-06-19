'use client'

import { useEffect, useState } from 'react'

const SCENARIOS = [
  'You on a private jet',
  'Eating dinner with Donald Trump',
  'Driving a Ferrari',
  'Rolex on your wrist',
  'Day out with the Kardashians',
]

export function AnimatedScenarios() {
  const [displayText, setDisplayText] = useState('')
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentScenario = SCENARIOS[currentScenarioIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting) {
      // Typing forward
      if (displayText.length < currentScenario.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentScenario.substring(0, displayText.length + 1))
        }, 50)
      } else {
        // Pause before deleting
        timeout = setTimeout(() => {
          setIsDeleting(true)
        }, 2500)
      }
    } else {
      // Deleting backward
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1))
        }, 30)
      } else {
        // Move to next scenario
        setCurrentScenarioIndex((prev) => (prev + 1) % SCENARIOS.length)
        setIsDeleting(false)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, currentScenarioIndex, isDeleting])

  return (
    <div className="text-base sm:text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed h-8 md:h-10 flex items-center justify-center font-medium px-2 py-4 md:py-6">
      <span className="relative">
        {displayText}
        <span className="animate-sparkle absolute -top-1 -right-2 md:-right-3 text-lg md:text-xl">✨</span>
      </span>
    </div>
  )
}
