'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import Image from 'next/image'
import { SelfieUploadStep } from '@/components/SelfieUploadStep'
import { GenerationTypeStep, type GenerationType } from '@/components/GenerationTypeStep'
import { GenerationContentStep } from '@/components/GenerationContentStep'

type WorkflowStep = 1 | 2 | 3

interface UploadData {
  selfie_url: string
  embedding: any
  embedding_error?: string
}

export default function WorkflowPage() {
  const { userId, isLoaded } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(1)
  const [uploadData, setUploadData] = useState<UploadData | null>(null)
  const [generationType, setGenerationType] = useState<GenerationType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in')
    }
  }, [isLoaded, userId, router])

  useEffect(() => {
    const uploadDataStr = sessionStorage.getItem('delusionify_upload')
    if (uploadDataStr) {
      try {
        const data = JSON.parse(uploadDataStr)
        setUploadData(data)
        setCurrentStep(2)
      } catch (e) {
        console.error('Failed to parse upload data', e)
      }
    }
  }, [])

  const handleSelfieUploadSuccess = (data: UploadData) => {
    setUploadData(data)
    sessionStorage.setItem('delusionify_upload', JSON.stringify(data))
    setCurrentStep(2)
    setError(null)
  }

  const handleGenerationTypeSelect = (type: GenerationType) => {
    setGenerationType(type)
    setCurrentStep(3)
    setError(null)
  }

  const handleGenerationTypeBack = () => {
    setGenerationType(null)
    setCurrentStep(2)
  }

  const handleGenerate = async (params: any) => {
    setIsLoading(true)
    setError(null)

    try {
      if (!uploadData) {
        throw new Error('No selfie found. Please upload a photo first.')
      }

      const requestBody = {
        ...params,
        selfie_url: uploadData.selfie_url,
        face_embedding: uploadData.embedding,
      }

      const response = await fetch('/api/generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create generation job')
      }

      const job = await response.json()

      sessionStorage.setItem('delusionify_job', JSON.stringify(job))
      router.push(`/result/${job.id}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Generation failed'
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    )
  }

  if (!userId) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-2 md:gap-4">
          <button
            onClick={() => router.push('/')}
            className="hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <Image
              src="/delusionify_white_logo.png"
              alt="Delusionify Logo"
              width={140}
              height={40}
              className="h-14 md:h-24 w-auto"
            />
          </button>

          {/* Step Indicators */}
          <div className="hidden sm:flex items-center gap-2 md:gap-4">
            <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''}`}>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </div>
            <div className="h-1 w-8 bg-slate-800"></div>
            <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''}`}>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="h-1 w-8 bg-slate-800"></div>
            <div className={`step-indicator ${currentStep >= 3 ? 'active' : ''}`}>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM15.657 14.243a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM11 17a1 1 0 102 0v-1a1 1 0 10-2 0v1zM5.757 15.657a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707zM2 10a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.757 4.343a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707z" />
              </svg>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/history')}
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
              title="View History"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
              title="Settings"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
              </svg>
            </button>
            <button
              onClick={() => router.push('/billing')}
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
              title="Billing"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
        {currentStep === 1 && (
          <SelfieUploadStep onSuccess={handleSelfieUploadSuccess} isLoading={isLoading} />
        )}

        {currentStep === 2 && (
          <GenerationTypeStep onSelect={handleGenerationTypeSelect} selectedType={generationType} />
        )}

        {currentStep === 3 && generationType && (
          <div className="space-y-6 md:space-y-8">
            <button
              onClick={handleGenerationTypeBack}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors mb-3 md:mb-4 text-sm md:text-base"
            >
              <svg className="h-4 md:h-5 w-4 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <GenerationContentStep
              generationType={generationType}
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>
        )}

        {error && (
          <div className="mt-6 md:mt-8 rounded-xl border border-red-900/50 bg-red-900/10 p-4 text-sm md:text-base">
            <p className="text-red-300">{error}</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16 py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-slate-500">
            © 2026 Delusionify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
