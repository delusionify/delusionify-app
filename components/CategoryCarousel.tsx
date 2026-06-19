'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'

interface Category {
  name: string
  category: string
  examples: Array<{
    image: string
    label: string
  }>
}

const CATEGORIES: Category[] = [
  {
    name: 'Luxury Hotels',
    category: '5star_hotels',
    examples: [
      { image: '/templates/5star_hotels/hotel_selfie.jpg', label: 'Hotel Luxury' },
      { image: '/templates/5star_hotels/hotel_selfie_2.jpg', label: 'Suite' },
      { image: '/templates/5star_hotels/selfie_hotel_3.jpg', label: 'Penthouse' },
      { image: '/templates/5star_hotels/crown_plaza.jpg', label: 'Lobby' },
    ],
  },
  {
    name: 'Exotic Beaches',
    category: 'beaches',
    examples: [
      { image: '/templates/beaches/bali_selfie.jpg', label: 'Bali Paradise' },
      { image: '/templates/beaches/miami_beach_selfie.jpg', label: 'Miami Beach' },
      { image: '/templates/beaches/selfie_beach.jpg', label: 'Beach Life' },
      { image: '/templates/beaches/bali_beach_2.jpg', label: 'Tropical' },
    ],
  },
  {
    name: 'Adventure',
    category: 'exotic_locations',
    examples: [
      { image: '/templates/exotic_locations/safari_quad.webp', label: 'Safari' },
      { image: '/templates/exotic_locations/grand_canyon_selfie.jpg', label: 'Grand Canyon' },
      { image: '/templates/exotic_locations/elephant_selfie.jpg', label: 'Wildlife' },
      { image: '/templates/exotic_locations/rhino_selfie.jpg', label: 'Exotic Trip' },
    ],
  },
  {
    name: 'Famous Landmarks',
    category: 'famous_landmarks',
    examples: [
      { image: '/templates/famous_landmarks/venice selfie.jpg', label: 'Venice' },
      { image: '/templates/famous_landmarks/sphi9nx selfie.jpg', label: 'Egypt' },
      { image: '/templates/famous_landmarks/taj mahal.jpg', label: 'Asia' },
      { image: '/templates/famous_landmarks/eiffle_tower.jpg', label: 'Europe' },
    ],
  },
  {
    name: 'Helicopter Tours',
    category: 'helicopters',
    examples: [
      { image: '/templates/helicopters/heli1.jpg', label: 'Scenic Flight' },
      { image: '/templates/helicopters/heli2.jpg', label: 'Sky View' },
      { image: '/templates/helicopters/heli3.jpg', label: 'Aerial Tour' },
      { image: '/templates/helicopters/heli4.jpg', label: 'Heli Ride' },
    ],
  },
  {
    name: 'Private Jets',
    category: 'private_jets',
    examples: [
      { image: '/templates/private_jets/images (1).jpg', label: 'Jet Interior' },
      { image: '/templates/private_jets/images (2).jpg', label: 'Luxury Cabin' },
      { image: '/templates/private_jets/images (3).jpg', label: 'First Class' },
      { image: '/templates/private_jets/images (4).jpg', label: 'Sky Lounge' },
    ],
  },
  {
    name: 'Superyachts',
    category: 'yachts',
    examples: [
      { image: '/templates/yachts/images (1).jpg', label: 'Yacht Deck' },
      { image: '/templates/yachts/images (2).jpg', label: 'Sea Voyage' },
      { image: '/templates/yachts/images (3).jpg', label: 'Yacht Party' },
      { image: '/templates/yachts/images (5).jpg', label: 'Ocean Luxury' },
    ],
  },
  {
    name: 'Fine Dining',
    category: 'restaurants',
    examples: [
      { image: '/templates/restaurants/images (1).jpg', label: 'Michelin Star' },
      { image: '/templates/restaurants/images (2).jpg', label: 'Gourmet' },
      { image: '/templates/restaurants/images (3).jpg', label: 'Luxury Dining' },
      { image: '/templates/restaurants/images (4).jpg', label: 'Fine Wine' },
    ],
  },
  {
    name: 'Mansions',
    category: 'mansions',
    examples: [
      { image: '/templates/mansions/images (1).jpg', label: 'Grand Mansion' },
      { image: '/templates/mansions/images (2).jpg', label: 'Luxury Estate' },
      { image: '/templates/mansions/images (3).jpg', label: 'Dream Home' },
      { image: '/templates/mansions/images (4).jpg', label: 'Palace' },
    ],
  },
  {
    name: 'Penthouse',
    category: 'penthouse_apartments',
    examples: [
      { image: '/templates/penthouse_apartments/images (1).jpg', label: 'City View' },
      { image: '/templates/penthouse_apartments/images (2).jpg', label: 'Skyline' },
      { image: '/templates/penthouse_apartments/images (3).jpg', label: 'Rooftop' },
      { image: '/templates/penthouse_apartments/images (4).jpg', label: 'Luxury Apt' },
    ],
  },
  {
    name: 'Infinity Pools',
    category: 'infinity_pools',
    examples: [
      { image: '/templates/infinity_pools/images (1).jpg', label: 'Infinity Edge' },
      { image: '/templates/infinity_pools/images (2).jpg', label: 'Pool Paradise' },
      { image: '/templates/infinity_pools/images (3).jpg', label: 'Sky Pool' },
      { image: '/templates/infinity_pools/images (4).jpg', label: 'Resort' },
    ],
  },
  {
    name: 'Supercars',
    category: 'supercars',
    examples: [
      { image: '/templates/supercars/images (1).jpg', label: 'Ferrari' },
      { image: '/templates/supercars/images (2).jpg', label: 'Lamborghini' },
      { image: '/templates/supercars/images (3).jpg', label: 'Sports Car' },
      { image: '/templates/supercars/images (4).jpg', label: 'Luxury Auto' },
    ],
  },
  {
    name: 'Ski Resorts',
    category: 'ski_resorts',
    examples: [
      { image: '/templates/ski_resorts/images (1).jpg', label: 'Alpine' },
      { image: '/templates/ski_resorts/images (2).jpg', label: 'Snow Peak' },
      { image: '/templates/ski_resorts/images (3).jpg', label: 'Winter Sport' },
      { image: '/templates/ski_resorts/images (4).jpg', label: 'Ski Lodge' },
    ],
  },
  {
    name: 'Casinos',
    category: 'casinos',
    examples: [
      { image: '/templates/casinos/casino_1.jpg', label: 'Vegas Night' },
      { image: '/templates/casinos/casino_2.jpg', label: 'Poker Table' },
      { image: '/templates/casinos/las_vegas.jpg', label: 'Las Vegas' },
      { image: '/templates/casinos/poker.jpg', label: 'High Stakes' },
    ],
  },
  {
    name: 'Luxury Spas',
    category: 'spas',
    examples: [
      { image: '/templates/spas/images (1).jpg', label: 'Wellness' },
      { image: '/templates/spas/images (2).jpg', label: 'Spa Retreat' },
      { image: '/templates/spas/images (3).jpg', label: 'Relaxation' },
      { image: '/templates/spas/images (4).jpg', label: 'Massage' },
    ],
  },
  {
    name: 'Art Galleries',
    category: 'art_galleries',
    examples: [
      { image: '/templates/art_galleries/art_gallery_selfie_2.webp', label: 'Gallery' },
      { image: '/templates/art_galleries/art_gallery.jpg', label: 'Museum' },
      { image: '/templates/art_galleries/art_2.jpg', label: 'Fine Art' },
      { image: '/templates/art_galleries/art_3.jpg', label: 'Exhibition' },
    ],
  },
  {
    name: 'Jet Ski',
    category: 'jetski',
    examples: [
      { image: '/templates/jetski/images (1).jpg', label: 'Water Sports' },
      { image: '/templates/jetski/images (2).jpg', label: 'Speed Boat' },
      { image: '/templates/jetski/images (3).jpg', label: 'Ocean Fun' },
      { image: '/templates/jetski/images (4).jpg', label: 'Adrenaline' },
    ],
  },
  {
    name: 'Mountains',
    category: 'mountains',
    examples: [
      { image: '/templates/mountains/images (1).jpg', label: 'Peak' },
      { image: '/templates/mountains/images (2).jpg', label: 'Summit' },
      { image: '/templates/mountains/images (3).jpg', label: 'Alpine' },
      { image: '/templates/mountains/images (4).jpg', label: 'Landscape' },
    ],
  },
  {
    name: 'Luxury Pools',
    category: 'pools',
    examples: [
      { image: '/templates/pools/images (1).jpg', label: 'Pool Party' },
      { image: '/templates/pools/images (2).jpg', label: 'Resort Pool' },
      { image: '/templates/pools/images (3).jpg', label: 'Swim' },
      { image: '/templates/pools/images (4).jpg', label: 'Aquatic' },
    ],
  },
  {
    name: 'Wine Cellars',
    category: 'wine_cellars',
    examples: [
      { image: '/templates/wine_cellars/images (1).jpg', label: 'Vintage' },
      { image: '/templates/wine_cellars/images (2).jpg', label: 'Cellar' },
      { image: '/templates/wine_cellars/images (3).jpg', label: 'Wine' },
      { image: '/templates/wine_cellars/images (4).jpg', label: 'Collection' },
    ],
  },
  {
    name: 'Luxury Car Interiors',
    category: 'luxury_car_interiors',
    examples: [
      { image: '/templates/luxury_car_interiors/images (1).jpg', label: 'Bentley' },
      { image: '/templates/luxury_car_interiors/images (2).jpg', label: 'Rolls Royce' },
      { image: '/templates/luxury_car_interiors/images (3).jpg', label: 'Interior' },
      { image: '/templates/luxury_car_interiors/images (4).jpg', label: 'Luxury' },
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
    <div className="space-y-6 md:space-y-8 px-2 md:px-0">
      <h2 className="text-2xl md:text-4xl font-bold gradient-text text-center">Featured Categories</h2>

      <div className="relative overflow-hidden">
        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-4 md:gap-8 overflow-x-auto scroll-smooth pb-4 px-2 md:px-4 touch-pan-x"
          style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map((category) => (
            <div key={category.name} className="flex-shrink-0 w-full md:w-1/3">
              <div className="relative group glow-card p-4 md:p-6 space-y-3 md:space-y-4 rounded-2xl border border-purple-600/40 bg-slate-900/80 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-600/60">
                <h3 className="text-base md:text-xl font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                  {category.name}
                </h3>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  {category.examples.map((example, idx) => (
                    <div key={idx} className="relative group">
                      <div className="relative h-24 md:h-32 rounded-lg overflow-hidden bg-slate-800 border border-purple-600/20 group-hover:border-purple-600/60 transition-all">
                        <Image
                          src={example.image}
                          alt={example.label}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
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
