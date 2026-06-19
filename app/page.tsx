'use client'

import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import BeforeAfterSlider from '@/components/BeforeAfterSlider'
import CategoryCarousel from '@/components/CategoryCarousel'
import { FAQAccordion } from '@/components/FAQAccordion'
import { AnimatedScenarios } from '@/components/AnimatedScenarios'
import { FeatureFlipCard } from '@/components/FeatureFlipCard'
import { SideImageScroller } from '@/components/SideImageScroller'

const PLANS = [
  {
    name: 'Starter',
    price: '$4.99',
    period: 'one-time',
    images: 20,
    videos: 2,
    description: 'First-time users',
  },
  {
    name: 'Creator',
    price: '$9.99',
    period: '/month',
    images: 50,
    videos: 6,
    description: 'Most popular',
    featured: true,
  },
  {
    name: 'Pro',
    price: '$19.99',
    period: '/month',
    images: 150,
    videos: 20,
    description: 'Heavy creators',
  },
]

export default function Page() {
  const { userId } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
            <Image
              src="/delusionify_white_logo.png"
              alt="Delusionify Logo"
              width={140}
              height={40}
              className="h-16 md:h-24 w-auto"
            />
          </Link>

          <div className="flex items-center gap-4 md:gap-8">
            {/* Navigation Tabs - Hidden on mobile */}
            <nav className="hidden lg:flex items-center gap-6">
              <a href="#features" className="text-slate-300 hover:text-purple-400 text-sm font-medium transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-slate-300 hover:text-purple-400 text-sm font-medium transition-colors">
                Pricing
              </a>
              <a href="#faqs" className="text-slate-300 hover:text-purple-400 text-sm font-medium transition-colors">
                FAQ's
              </a>
            </nav>

            {/* Buttons Section */}
            <div className="flex items-center gap-2 md:gap-4">
              {userId ? (
                /* Logged in: Show settings icon */
                <Link
                  href="/settings"
                  className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
                  title="User Settings"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>
              ) : (
                /* Not logged in: Show buttons */
                <>
                  <Link
                    href="/sign-in"
                    className="shimmer-button flex items-center gap-2 text-xs md:text-sm px-3 md:px-6 py-2 md:py-3"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                  <Link
                    href="/workflow"
                    className="premium-button text-xs md:text-sm px-4 md:px-8 py-2 md:py-3"
                  >
                    Create Now
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
              title="Mobile menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-xl px-4 py-4">
            <nav className="flex flex-col gap-4">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-purple-400 font-medium transition-colors py-2"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-purple-400 font-medium transition-colors py-2"
              >
                Pricing
              </a>
              <a
                href="#faqs"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-purple-400 font-medium transition-colors py-2"
              >
                FAQ's
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section with Side Scrollers */}
        <div className="relative">
          {/* Left Scroller - Absolute Positioning */}
          <div className="absolute left-0 top-0 bottom-0 hidden lg:flex">
            <SideImageScroller direction="down" images="left" />
          </div>

          {/* Hero Section */}
          <div
            className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6 py-2 md:py-6 relative rounded-3xl overflow-hidden"
          >
          {/* Background with mask - separate from text */}
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              backgroundImage: 'url(/hero-bg-fade.jpg)',
              backgroundSize: '50%',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              backgroundRepeat: 'no-repeat',
              maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0) 80%)',
              WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0) 80%)',
              zIndex: 0,
            }}
          />

          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-slate-950/60" style={{ zIndex: 1 }} />

          {/* Content wrapper - TEXT NOT AFFECTED BY MASK */}
          <div className="relative z-10">
          {/* Star Rating */}
          <div className="flex justify-center gap-0.5 md:gap-1 text-lg md:text-2xl">
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
          </div>

          <h1 className="leading-tight">
            <span className="text-3xl sm:text-4xl md:text-6xl font-bold text-slate-100">Turn Any Delusion Into </span>
            <span className="text-4xl sm:text-5xl md:text-8xl font-bold bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 bg-clip-text text-transparent animate-gradient-flow drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.8))' }}>Reality</span>
          </h1>
          <AnimatedScenarios />
          <p className="text-xs sm:text-sm md:text-lg text-slate-200 italic max-w-3xl mx-auto leading-relaxed font-light px-2">
            Premium AI-powered transformations trained on 50k+ luxury scenarios. 100% undetectable, ultra-realistic, high-quality results.
          </p>
          <div className="flex flex-col items-center gap-4 md:gap-6 pt-2 md:pt-4">
            <Link href={userId ? '/workflow' : '/sign-in'} className="premium-button text-sm md:text-lg px-8 md:px-12 py-3 md:py-4">
              Start Creating
            </Link>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-center text-xs md:text-sm text-slate-400 w-full">
              <div className="space-y-1 w-1/2 md:w-auto">
                <p className="text-base md:text-lg font-semibold text-purple-400">4.8★</p>
                <p className="text-xs">User Rating</p>
              </div>
              <div className="hidden md:block w-px bg-slate-700" />
              <div className="space-y-1 w-1/2 md:w-auto">
                <p className="text-base md:text-lg font-semibold text-purple-400">367</p>
                <p className="text-xs">Active Creators</p>
              </div>
              <div className="hidden md:block w-px bg-slate-700" />
              <div className="space-y-1 w-1/2 md:w-auto">
                <p className="text-base md:text-lg font-semibold text-purple-400">11.3K+</p>
                <p className="text-xs">Images Generated</p>
              </div>
              <div className="hidden md:block w-px bg-slate-700" />
              <div className="space-y-1 w-1/2 md:w-auto">
                <p className="text-base md:text-lg font-semibold text-purple-400">4.8K+</p>
                <p className="text-xs">Videos Created</p>
              </div>
            </div>
          </div>
          </div>
        </div>

          {/* Right Scroller - Absolute Positioning */}
          <div className="absolute right-0 top-0 bottom-0 hidden lg:flex">
            <SideImageScroller direction="up" images="right" />
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-12 md:mt-20 max-w-5xl mx-auto px-2 md:px-0">
          <div className="premium-card p-6 md:p-8 text-center space-y-3 md:space-y-4">
            <div className="flex justify-center">
              <svg className="h-10 md:h-12 w-10 md:w-12 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-100">Advanced AI Technology</h3>
            <p className="text-sm md:text-base text-slate-400">Trained on 50k+ scenarios, custom-tuned LLM, state-of-the-art face embedding</p>
          </div>

          <div className="premium-card p-6 md:p-8 text-center space-y-3 md:space-y-4">
            <div className="flex justify-center">
              <svg className="h-10 md:h-12 w-10 md:w-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-100">100% Undetectable</h3>
            <p className="text-sm md:text-base text-slate-400">Indistinguishable from real photos, professional-grade quality</p>
          </div>

          <div className="premium-card p-6 md:p-8 text-center space-y-3 md:space-y-4">
            <div className="flex justify-center">
              <svg className="h-10 md:h-12 w-10 md:w-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-100">Lightning Fast</h3>
            <p className="text-sm md:text-base text-slate-400">Results in seconds, premium processing</p>
          </div>
        </div>

        {/* Before/After Slider Section */}
        <div className="max-w-5xl mx-auto mt-12 md:mt-20 space-y-6 md:space-y-8 px-2 md:px-0">
          <h2 className="text-2xl md:text-4xl font-bold gradient-text text-center">See The Magic</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <BeforeAfterSlider
              before="/placeholder-before-1.jpg"
              after="/placeholder-after-1.jpg"
              title="Example 1"
            />
            <BeforeAfterSlider
              before="/placeholder-before-2.jpg"
              after="/placeholder-after-2.jpg"
              title="Example 2"
            />
          </div>
        </div>

        {/* Category Carousel Section */}
        <div className="max-w-6xl mx-auto mt-20">
          <CategoryCarousel />
        </div>

        {/* Template Features Section */}
        <div id="features" className="max-w-5xl mx-auto mt-12 md:mt-20 space-y-6 md:space-y-8 scroll-mt-20 px-2 md:px-0">
          <h2 className="text-2xl md:text-4xl font-bold gradient-text text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <FeatureFlipCard
              title="Templates"
              description="Curated luxury lifestyle templates ready to use"
              icon={
                <svg className="h-12 w-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
              steps={[
                {
                  number: 1,
                  title: 'Upload Your Selfie',
                  description: 'Take a clear photo of yourself or upload an existing one',
                },
                {
                  number: 2,
                  title: 'Choose a Template',
                  description: 'Browse our curated luxury lifestyle templates',
                },
                {
                  number: 3,
                  title: 'Generate',
                  description: 'AI creates your transformation in seconds',
                },
              ]}
            />

            <FeatureFlipCard
              title="Custom Prompts"
              description="Describe any scenario you can imagine"
              icon={
                <svg className="h-12 w-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              }
              steps={[
                {
                  number: 1,
                  title: 'Upload Your Selfie',
                  description: 'Take a clear photo of yourself or upload an existing one',
                },
                {
                  number: 2,
                  title: 'Write Your Scenario',
                  description: 'Describe any luxury lifestyle scenario you want to appear in',
                },
                {
                  number: 3,
                  title: 'AI Enhancement',
                  description: 'GPT-5 mini enhances your prompt for better results',
                },
                {
                  number: 4,
                  title: 'Generate',
                  description: 'FLUX creates a stunning image matching your vision',
                },
              ]}
            />

            <FeatureFlipCard
              title="Images & Videos"
              description="Transform any image or video you provide"
              icon={
                <svg className="h-12 w-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              steps={[
                {
                  number: 1,
                  title: 'Upload Your Selfie',
                  description: 'Take a clear photo of yourself or upload an existing one',
                },
                {
                  number: 2,
                  title: 'Choose Your Media',
                  description: 'Upload a target image or video you want to transform into',
                },
                {
                  number: 3,
                  title: 'Face Swap',
                  description: 'Advanced AI replaces the face while preserving your identity',
                },
                {
                  number: 4,
                  title: 'Download',
                  description: 'Get your transformed image or video instantly',
                },
              ]}
            />
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="max-w-6xl mx-auto mt-12 md:mt-20 space-y-8 md:space-y-12 scroll-mt-20 px-2 md:px-0">
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl font-bold gradient-text mb-3 md:mb-4">Subscription Plans</h2>
            <p className="text-sm md:text-lg text-slate-400">Choose the perfect plan for your creative needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`premium-card relative overflow-hidden p-6 md:p-8 transition-all duration-300 ${
                  plan.featured
                    ? 'border-purple-600 shadow-lg shadow-purple-600/20 md:scale-105'
                    : 'hover:shadow-lg hover:shadow-purple-600/10'
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-1 text-xs font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="mt-3 md:mt-4">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-100">{plan.name}</h3>
                  <p className="text-xs md:text-sm text-slate-400 mt-2">{plan.description}</p>
                </div>

                <div className="mt-6 md:mt-8 mb-6 md:mb-8">
                  <span className="text-4xl md:text-5xl font-bold gradient-text">{plan.price}</span>
                  <span className="text-slate-400 ml-2 md:ml-3 text-xs md:text-sm">{plan.period}</span>
                </div>

                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-slate-800">
                  <div className="flex items-center gap-2 md:gap-3">
                    <svg className="h-4 md:h-5 w-4 md:w-5 text-purple-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base text-slate-300">{plan.images} images/month</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <svg className="h-4 md:h-5 w-4 md:w-5 text-purple-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base text-slate-300">{plan.videos} videos/month</span>
                  </div>
                </div>

                <button
                  className={`w-full py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                    plan.featured
                      ? 'premium-button'
                      : 'premium-button-secondary'
                  }`}
                >
                  {plan.period === 'one-time' ? 'Get Starter' : `Subscribe to ${plan.name}`}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div id="faqs" className="mt-12 md:mt-16 scroll-mt-20 px-2 md:px-0">
            <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-6 md:mb-8">Frequently Asked Questions</h2>
            <FAQAccordion />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16 md:mt-24 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-6 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6 md:mb-8 pb-6 md:pb-8 border-b border-slate-800">
              {/* Left - Logo */}
              <div className="relative w-40 h-14 md:w-48 md:h-16">
                <Image
                  src="/delusionify_white_logo.png"
                  alt="Delusionify Logo"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Center - Copyright */}
              <p className="text-xs md:text-sm text-slate-500">
                © 2026 Delusionify. Transform your reality with premium AI.
              </p>

              {/* Right - Social Icons */}
              <div className="flex gap-6 md:gap-8 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-slate-400 hover:text-purple-500 transition-colors"
                  title="TikTok"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 11-2.4-2.4c.23 0 .46.04.68.09V9.24c-.29-.05-.58-.08-.88-.08a5.5 5.5 0 105.5 5.5V9.38a7.21 7.21 0 004.86 1.81V6.92a4.9 4.9 0 01-.73-.23z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-purple-500 transition-colors"
                  title="Instagram"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-purple-500 transition-colors"
                  title="Facebook"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-xs md:text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-slate-100 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-slate-700">|</span>
              <Link href="/terms" className="hover:text-slate-100 transition-colors">
                Terms & Conditions
              </Link>
              <span className="text-slate-700">|</span>
              <Link href="/legal" className="hover:text-slate-100 transition-colors">
                Legal Notice
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
