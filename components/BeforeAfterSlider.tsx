'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface SliderProps {
  before: string
  after: string
  title?: string
}

export default function BeforeAfterSlider({ before, after, title }: SliderProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleTouchStart = () => {
    setIsDragging(true)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = (x / rect.width) * 100
    setPosition(Math.max(0, Math.min(100, percentage)))
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchend', handleTouchEnd)
      return () => {
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging])

  return (
    <div className="space-y-3 md:space-y-4">
      {title && <h3 className="text-base md:text-lg font-semibold text-slate-100 text-center">{title}</h3>}
      <div
        ref={containerRef}
        className="relative w-full h-48 md:h-96 rounded-xl overflow-visible cursor-col-resize select-none touch-none"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
        }}
      >
        {/* Portal Glow */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 0 2px rgba(168, 85, 247, 0.3), 0 0 40px rgba(168, 85, 247, 0.3), inset 0 0 40px rgba(168, 85, 247, 0.1)',
          }}
        />

        {/* Animated Portal Border */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none opacity-60 animate-spin-slow"
          style={{
            background: 'conic-gradient(from 0deg, rgba(168, 85, 247, 0.5), rgba(147, 51, 234, 0.3), rgba(168, 85, 247, 0.5))',
            animation: 'spin 8s linear infinite',
          }}
        />
        {/* Before Image */}
        <div className="absolute inset-0 w-full h-full rounded-xl overflow-hidden">
          <Image
            src={before}
            alt="Before"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* After Image - Clipped */}
        <div
          className="absolute inset-0 h-full overflow-hidden transition-all rounded-xl"
          style={{ width: `${position}%` }}
        >
          <Image
            src={after}
            alt="After"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Divider Handle */}
        <div
          className="absolute top-0 h-full w-1 bg-gradient-to-b from-purple-400 via-purple-300 to-purple-400 transition-all"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50 flex items-center justify-center">
            <div className="flex gap-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Position Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-slate-100 font-medium">
          {Math.round(position)}%
        </div>
      </div>
    </div>
  )
}
