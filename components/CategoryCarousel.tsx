'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'

interface Category {
  name: string
  examples: Array<{
    before: string
    after: string
  }>
}

const CATEGORIES: Category[] = [
  {
    name: 'Founder Pack',
    examples: [
      { before: '/placeholder-before-1.jpg', after: '/placeholder-after-1.jpg' },
      { before: '/placeholder-before-2.jpg', after: '/placeholder-after-2.jpg' },
    ],
  },
  {
    name: 'Luxury Pack',
    examples: [
      { before: '/placeholder-before-3.jpg', after: '/placeholder-after-3.jpg' },
      { before: '/placeholder-before-4.jpg', after: '/placeholder-after-4.jpg' },
    ],
  },
  {
    name: 'Travel Pack',
    examples: [
      { before: '/placeholder-before-5.jpg', after: '/placeholder-after-5.jpg' },
      { before: '/placeholder-before-6.jpg', after: '/placeholder-after-6.jpg' },
    ],
  },
  {
    name: 'Adventure Pack',
    examples: [
      { before: '/placeholder-before-1.jpg', after: '/placeholder-after-1.jpg' },
      { before: '/placeholder-before-2.jpg', after: '/placeholder-after-2.jpg' },
    ],
  },
  {
    name: 'Celebrity Pack',
    examples: [
      { before: '/placeholder-before-3.jpg', after: '/placeholder-after-3.jpg' },
      { before: '/placeholder-before-4.jpg', after: '/placeholder-after-4.jpg' },
    ],
  },
  {
    name: 'Elite Pack',
    examples: [
      { before: '/placeholder-before-5.jpg', after: '/placeholder-after-5.jpg' },
      { before: '/placeholder-before-6.jpg', after: '/placeholder-after-6.jpg' },
    ],
  },
  {
    name: 'Exotic Pack',
    examples: [
      { before: '/placeholder-before-1.jpg', after: '/placeholder-after-1.jpg' },
      { before: '/placeholder-before-2.jpg', after: '/placeholder-after-2.jpg' },
    ],
  },
  {
    name: 'VIP Pack',
    examples: [
      { before: '/placeholder-before-3.jpg', after: '/placeholder-after-3.jpg' },
      { before: '/placeholder-before-4.jpg', after: '/placeholder-after-4.jpg' },
    ],
  },
  {
    name: 'Premium Pack',
    examples: [
      { before: '/placeholder-before-5.jpg', after: '/placeholder-after-5.jpg' },
      { before: '/placeholder-before-6.jpg', after: '/placeholder-after-6.jpg' },
    ],
  },
]

export default function CategoryCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    let scrollInterval: NodeJS.Timeout
    let isScrolling = true

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (carousel && isScrolling) {
          carousel.scrollLeft += 2 // Smooth pixel-by-pixel scrolling

          // Reset to beginning when reaching the end
          if (carousel.scrollLeft >= carousel.scrollWidth - carousel.offsetWidth - 10) {
            carousel.scrollLeft = 0
          }
        }
      }, 30) // Update every 30ms for smooth animation
    }

    startAutoScroll()

    // Pause on hover
    const handleMouseEnter = () => {
      isScrolling = false
    }

    const handleMouseLeave = () => {
      isScrolling = true
    }

    carousel.addEventListener('mouseenter', handleMouseEnter)
    carousel.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearInterval(scrollInterval)
      carousel.removeEventListener('mouseenter', handleMouseEnter)
      carousel.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div className="space-y-8">
      <h2 className="text-3xl md:text-4xl font-bold gradient-text text-center">Featured Categories</h2>

      <div className="relative overflow-hidden">
        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-8 overflow-x-auto scroll-smooth pb-4 px-4"
          style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map((category) => (
            <div key={category.name} className="flex-shrink-0 w-full md:w-1/3">
              <div className="relative group glow-card p-6 space-y-4 rounded-2xl border border-purple-600/40 bg-slate-900/80 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-600/60">
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                  {category.name}
                </h3>
                <div className="space-y-4">
                  {category.examples.map((example, idx) => (
                    <div key={idx} className="flex gap-3">
                      {/* Before */}
                      <div className="flex-1 relative h-32 rounded-lg overflow-hidden bg-slate-800 border border-purple-600/20 group-hover:border-purple-600/60 transition-all">
                        <Image
                          src={example.before}
                          alt={`${category.name} before example ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {/* After */}
                      <div className="flex-1 relative h-32 rounded-lg overflow-hidden bg-slate-800 border border-purple-600/20 group-hover:border-purple-600/60 transition-all">
                        <Image
                          src={example.after}
                          alt={`${category.name} after example ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        div[style*='scrollbar-width'] {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        div[style*='scrollbar-width']::-webkit-scrollbar {
          display: none;
        }

        .glow-card {
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.2), inset 0 0 20px rgba(168, 85, 247, 0.05);
        }

        .glow-card:hover {
          box-shadow: 0 0 40px rgba(168, 85, 247, 0.4), 0 0 60px rgba(168, 85, 247, 0.3),
            inset 0 0 20px rgba(168, 85, 247, 0.1);
        }
      `}</style>
    </div>
  )
}
