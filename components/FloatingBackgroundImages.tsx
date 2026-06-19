'use client'

import { useEffect, useState } from 'react'

const CATEGORY_IMAGES = [
  '/templates/5star_hotels/ritz_suite.jpg',
  '/templates/beaches/bali_selfie.jpg',
  '/templates/exotic_locations/safari_quad.webp',
  '/templates/famous_landmarks/eiffle_tower.jpg',
  '/templates/helicopters/heli2.jpg',
  '/templates/private_jets/images (2).jpg',
  '/templates/yachts/images (3).jpg',
  '/templates/restaurants/images (2).jpg',
  '/templates/mansions/images (1).jpg',
  '/templates/penthouse_apartments/images (2).jpg',
  '/templates/infinity_pools/images (1).jpg',
  '/templates/supercars/images (3).jpg',
  '/templates/ski_resorts/images (1).jpg',
  '/templates/spas/images (2).jpg',
  '/templates/art_galleries/art_gallery.jpg',
  '/templates/jetski/images (1).jpg',
]

interface FloatingImg {
  id: number
  src: string
  top: number
  left: number
  size: number
  duration: number
  delay: number
}

export function FloatingBackgroundImages() {
  const [images, setImages] = useState<FloatingImg[]>([])

  useEffect(() => {
    const imageCount = 6
    const newImages: FloatingImg[] = []
    const sizes = [120, 150, 180]

    for (let i = 0; i < imageCount; i++) {
      newImages.push({
        id: i,
        src: CATEGORY_IMAGES[i % CATEGORY_IMAGES.length],
        top: Math.random() * 70,
        left: Math.random() * 85,
        size: sizes[i % sizes.length],
        duration: 25 + Math.random() * 15,
        delay: i * 0.5,
      })
    }

    setImages(newImages)
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.15;
          }
          50% {
            transform: translateY(-30px) rotate(8deg);
            opacity: 0.2;
          }
        }
        .floating-img {
          animation: float linear infinite;
          position: fixed;
          border-radius: 1rem;
          background-size: cover;
          background-position: center;
          filter: blur(2px);
          pointer-events: none;
          z-index: -1;
        }
      `}</style>

      {images.map((img) => (
        <div
          key={img.id}
          className="floating-img"
          style={{
            width: `${img.size}px`,
            height: `${img.size}px`,
            top: `${img.top}%`,
            left: `${img.left}%`,
            backgroundImage: `url('${img.src}')`,
            animationDuration: `${img.duration}s`,
            animationDelay: `${img.delay}s`,
          }}
        />
      ))}
    </>
  )
}
