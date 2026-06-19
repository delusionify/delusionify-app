'use client'

import { useEffect, useState } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
}

export function AnimatedStars() {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    const starCount = 40
    const newStars: Star[] = []

    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 2,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 2,
        opacity: Math.random() * 0.6 + 0.3,
      })
    }

    setStars(newStars)
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.1;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-20px) scale(1.2);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateX(0) translateY(0);
          }
          33% {
            transform: translateX(20px) translateY(-30px);
          }
          66% {
            transform: translateX(-15px) translateY(25px);
          }
        }

        .animated-star {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 5;
          animation: twinkle linear infinite, float ease-in-out infinite;
          will-change: transform, opacity;
        }
      `}</style>

      {stars.map((star) => (
        <div
          key={star.id}
          className="animated-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: `hsla(259, 84%, 50%, ${star.opacity})`,
            boxShadow: `0 0 ${star.size * 2}px hsla(259, 84%, 50%, ${star.opacity * 0.8})`,
            animationDuration: `${star.duration}s, ${star.duration * 1.5}s`,
            animationDelay: `${star.delay}s, ${star.delay * 0.5}s`,
          }}
        />
      ))}
    </>
  )
}
