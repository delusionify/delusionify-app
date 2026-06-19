'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'

interface SideScrollerProps {
  direction: 'down' | 'up'
  images?: 'left' | 'right'
}

const LEFT_IMAGES = [
  '/templates/yachts/images (1).jpg',
  '/templates/supercars/images (1).jpg',
  '/templates/private_jets/images (1).jpg',
  '/templates/mansions/images (1).jpg',
  '/templates/penthouse_apartments/images (1).jpg',
  '/templates/ski_resorts/images (1).jpg',
  '/templates/helicopters/heli1.jpg',
  '/templates/infinity_pools/images (1).jpg',
  '/templates/casinos/casino_1.jpg',
  '/templates/spas/images (1).jpg',
]

const RIGHT_IMAGES = [
  '/templates/5star_hotels/hotel_selfie.jpg',
  '/templates/beaches/bali_selfie.jpg',
  '/templates/exotic_locations/safari_quad.webp',
  '/templates/famous_landmarks/venice selfie.jpg',
  '/templates/art_galleries/art_gallery_selfie_2.webp',
  '/templates/luxury_car_interiors/images (1).jpg',
  '/templates/jetski/images (1).jpg',
  '/templates/mountains/images (1).jpg',
  '/templates/pools/images (1).jpg',
  '/templates/wine_cellars/images (1).jpg',
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
