'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'

interface SideScrollerProps {
  direction: 'down' | 'up'
  images?: 'left' | 'right'
}

const LEFT_IMAGES = [
  '/templates/yachts/1.jpg',
  '/templates/supercars/1.jpg',
  '/templates/private_jets/1.jpg',
  '/templates/mansions/1.jpg',
  '/templates/penthouse_apartments/1.jpg',
  '/templates/ski_resorts/1.jpg',
  '/templates/helicopters/1.jpg',
  '/templates/infinity_pools/1.jpg',
  '/templates/casinos/1.jpg',
  '/templates/spas/1.jpg',
]

const RIGHT_IMAGES = [
  '/templates/5star_hotels/1.jpg',
  '/templates/beaches/1.jpg',
  '/templates/exotic_locations/1.jpg',
  '/templates/famous_landmarks/1.jpg',
  '/templates/art_galleries/1.jpg',
  '/templates/luxury_car_interiors/1.jpg',
  '/templates/jetski/1.jpg',
  '/templates/mountains/1.jpg',
  '/templates/pools/1.jpg',
  '/templates/wine_cellars/1.jpg',
]

export function SideImageScroller({ direction, images = 'left' }: SideScrollerProps) {
  const IMAGES = images === 'left' ? LEFT_IMAGES : RIGHT_IMAGES
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    let scrollInterval: NodeJS.Timeout
    let isScrolling = true

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (isScrolling && scroller) {
          if (direction === 'down') {
            scroller.scrollTop += 1
            if (scroller.scrollTop >= scroller.scrollHeight - scroller.clientHeight - 10) {
              scroller.scrollTop = 0
            }
          } else {
            scroller.scrollTop -= 1
            if (scroller.scrollTop <= 0) {
              scroller.scrollTop = scroller.scrollHeight - scroller.clientHeight
            }
          }
        }
      }, 30)
    }

    startAutoScroll()

    const handleMouseEnter = () => {
      isScrolling = false
    }

    const handleMouseLeave = () => {
      isScrolling = true
    }

    scroller.addEventListener('mouseenter', handleMouseEnter)
    scroller.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearInterval(scrollInterval)
      scroller.removeEventListener('mouseenter', handleMouseEnter)
      scroller.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [direction])

  return (
    <div
      ref={containerRef}
      className="hidden lg:flex h-full w-32 flex-col"
    >
      <div
        ref={scrollerRef}
        className="flex flex-col gap-4 overflow-hidden h-full"
      >
        {IMAGES.map((img, idx) => (
          <div
            key={idx}
            className="relative h-60 w-42 flex-shrink-0 rounded-2xl overflow-hidden border border-purple-600/30 hover:border-purple-600/60 transition-all"
            style={{
              backgroundImage: `url('${img}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        {/* Duplicate images for seamless loop */}
        {IMAGES.map((img, idx) => (
          <div
            key={`duplicate-${idx}`}
            className="relative h-60 w-42 flex-shrink-0 rounded-2xl overflow-hidden border border-purple-600/30 hover:border-purple-600/60 transition-all"
            style={{
              backgroundImage: `url('${img}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
      </div>
    </div>
  )
}
