'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'

interface Template {
  id: string
  category: string
  image_number: number
  storage_url: string
}

interface CategoriesBrowsingProps {
  onSelect: (template: Template) => void
  selected?: Template | null
}

export function CategoriesBrowsing({ onSelect, selected }: CategoriesBrowsingProps) {
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categoryImages, setCategoryImages] = useState<Record<string, Template[]>>({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data, error } = await supabase
        .from('template_images')
        .select('*')
        .order('category')
        .order('image_number')

      if (error) throw error

      const uniqueCategories = [...new Set(data?.map(t => t.category) || [])]
      setCategories(uniqueCategories)

      const grouped = (data || []).reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = []
        acc[item.category].push(item)
        return acc
      }, {} as Record<string, Template[]>)

      setCategoryImages(grouped)
      if (uniqueCategories.length > 0) {
        setSelectedCategory(uniqueCategories[0])
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin">
          <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-slate-900 border border-purple-600/30 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
        />
        <svg className="absolute right-3 top-3 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {filteredCategories.map((category) => (
          <div key={category} className="space-y-3">
            {/* Category Header */}
            <button
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedCategory === category
                  ? 'border-purple-500 bg-purple-600/10'
                  : 'border-slate-700 bg-slate-800/30 hover:border-purple-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-100 capitalize">
                  {category.replace(/_/g, ' ')}
                </h3>
                <span className="text-sm text-slate-400">
                  {categoryImages[category]?.length || 0} images
                </span>
              </div>
            </button>

            {/* Category Images */}
            {selectedCategory === category && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pl-4">
                {categoryImages[category]?.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => onSelect(template)}
                    className={`relative group overflow-hidden rounded-lg border-2 transition-all aspect-square ${
                      selected?.id === template.id
                        ? 'border-purple-500 ring-2 ring-purple-400'
                        : 'border-slate-700 hover:border-purple-400'
                    }`}
                  >
                    <Image
                      src={template.storage_url}
                      alt={`${category} ${template.image_number}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Number Badge */}
                    <div className="absolute top-2 right-2 bg-slate-900/80 px-2 py-1 rounded text-xs text-slate-300">
                      #{template.image_number}
                    </div>

                    {/* Selected Checkmark */}
                    {selected?.id === template.id && (
                      <div className="absolute top-2 left-2 bg-purple-600 rounded-full p-1">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selection Summary */}
      {selected && (
        <div className="p-4 bg-purple-600/10 border border-purple-600/30 rounded-lg">
          <p className="text-slate-200 text-sm">
            ✅ Selected: <span className="font-semibold text-purple-400">{selected.category.replace(/_/g, ' ')}</span> #{selected.image_number}
          </p>
        </div>
      )}
    </div>
  )
}
