'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'

export interface Template {
  id: string
  category: string
  image_number: number
  image_name: string
  storage_url: string
}

interface TemplateGalleryProps {
  onSelect: (template: Template) => void
  selectedTemplate?: Template | null
}

export function TemplateGallery({ onSelect, selectedTemplate }: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data, error } = await supabase
        .from('template_images')
        .select('*')
        .order('category', { ascending: true })
        .order('image_number', { ascending: true })

      if (error) throw error

      setTemplates(data || [])

      // Extract unique categories
      const uniqueCategories = [...new Set(data?.map(t => t.category) || [])]
      setCategories(uniqueCategories as string[])
      if (uniqueCategories.length > 0) {
        setSelectedCategory(uniqueCategories[0])
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = !selectedCategory || template.category === selectedCategory
    const matchesSearch = !searchQuery ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const groupedByCategory = categories.reduce((acc, category) => {
    const categoryTemplates = filteredTemplates.filter(t => t.category === category)
    if (categoryTemplates.length > 0) {
      acc[category] = categoryTemplates
    }
    return acc
  }, {} as Record<string, Template[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin">
          <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          </svg>
        </div>
        <span className="ml-3 text-slate-300">Loading templates...</span>
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

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-800">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            {category.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="space-y-8">
        {Object.entries(groupedByCategory).map(([category, categoryTemplates]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-slate-200 mb-4 capitalize">
              {category.replace(/_/g, ' ')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categoryTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => onSelect(template)}
                  className={`relative group overflow-hidden rounded-lg border-2 transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-purple-500 ring-2 ring-purple-400'
                      : 'border-slate-700 hover:border-purple-400'
                  }`}
                >
                  <div className="relative w-full aspect-square bg-slate-900">
                    <Image
                      src={template.storage_url}
                      alt={`${category} ${template.image_number}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-white text-xs font-medium">
                      #{template.image_number}
                    </span>
                  </div>

                  {/* Selected Badge */}
                  {selectedTemplate?.id === template.id && (
                    <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">No templates found matching your search</p>
        </div>
      )}

      {/* Selection Info */}
      {selectedTemplate && (
        <div className="p-4 bg-purple-600/10 border border-purple-600/30 rounded-lg">
          <p className="text-slate-200 text-sm">
            ✅ Selected: <span className="font-semibold text-purple-400">{selectedTemplate.category.replace(/_/g, ' ')}</span> #{selectedTemplate.image_number}
          </p>
        </div>
      )}
    </div>
  )
}
