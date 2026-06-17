'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const FAQS: FAQItem[] = [
  {
    question: 'How does Delusionify use AI to transform my photos?',
    answer: 'Delusionify uses advanced AI technology trained on over 50,000 luxury lifestyle scenarios. When you upload your selfie, our system extracts your unique facial features using state-of-the-art face embedding technology. We then seamlessly place your face into your chosen scenario using premium FLUX image generation combined with PuLID face consistency algorithms. This ensures your face looks natural, proportional, and indistinguishable from professional photography.',
  },
  {
    question: 'Are the generated images 100% undetectable?',
    answer: 'Yes. Our AI is specifically trained to produce images that are indistinguishable from authentic photography. Every image goes through multiple quality checks to ensure professional-grade results. The images are optimized for print, social media, and professional use. We use cutting-edge face-swapping technology that maintains natural lighting, shadows, and skin tone consistency, making them virtually impossible to detect as AI-generated.',
  },
  {
    question: 'How many images can I generate per month?',
    answer: 'It depends on your subscription plan. The Starter plan includes 20 images (one-time purchase), Creator plan includes 50 images per month, and our Pro plan includes 150 images per month. You can upgrade at any time or purchase additional credit packs. If you need more generations, you can easily add more credits to your account without changing your subscription.',
  },
  {
    question: 'Can I use the generated images for commercial purposes?',
    answer: 'Yes! All images generated with Delusionify are yours to use. You can use them for personal projects, social media content, professional portfolios, or even commercial purposes. You own the rights to your generated content. However, remember that any recognizable people in the base images should not be used commercially without their permission (applies to template backgrounds).',
  },
  {
    question: 'What file formats and resolutions do you support?',
    answer: 'All generated images are delivered in high-quality formats suitable for professional use. Images are generated in 4K resolution (2160p) by default, which is perfect for printing, social media, and digital displays. You can download images as PNG (with transparency support) or JPEG (compressed, smaller file size). Videos are delivered in MP4 format with H.264 encoding, optimized for streaming and social media platforms.',
  },
  {
    question: 'How fast are generations typically completed?',
    answer: 'Image generations typically complete within 15-30 seconds, allowing you to see results almost instantly. Custom prompt generations take slightly longer (20-40 seconds) because the AI enhances your prompt first for better results. Video transformations are more intensive and typically complete within 30-60 seconds depending on video length and complexity. You\'ll receive real-time status updates as your generation processes.',
  },
  {
    question: 'Do you offer a free trial or sample generations?',
    answer: 'Yes! New users receive a free trial with 2 free image generations from our preset template categories. The trial allows you to test our technology on curated luxury lifestyle templates. Note: prompt enhancement and custom prompts are not available in the free trial, and video transformations require a paid plan. The trial credits never expire, so you can use them whenever you\'re ready.',
  },
  {
    question: 'How do I ensure the best results with custom prompts?',
    answer: 'Our AI automatically enhances your prompts using GPT-5 mini, so even simple descriptions work well. For best results, include details like lighting conditions (sunset, golden hour), atmosphere (luxury, professional, exotic), location context, clothing style, and any specific mood you want. For example: "Me dining on a yacht in the Mediterranean with sunset lighting, champagne, luxury atmosphere" will produce better results than just "Me on a yacht". Our system learns from your preferences and improves over time.',
  },
  {
    question: 'Can I transform videos with Delusionify?',
    answer: 'Absolutely! Our video transformation feature allows you to upload any video (MP4, WebM, MOV) and seamlessly place your face into the scene. Videos can be up to 500MB and any length. Our advanced video AI (LivePortrait and Kling) maintains natural head movements, facial expressions, and expressions while ensuring your face stays consistently recognizable throughout the video. Videos are perfect for creating TikTok, Instagram Reels, or YouTube Shorts content.',
  },
  {
    question: 'Is my data and privacy protected?',
    answer: 'Your privacy is our top priority. All uploaded images and generated content are encrypted and stored securely. We never use your data for training purposes, and all processing is done on secure servers. You can delete your account and all associated data at any time. We comply with GDPR and CCPA regulations. Your facial embeddings are processed only for generation purposes and are never shared with third parties.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and digital payment methods through Stripe. Your payment information is always encrypted and secure. For monthly subscriptions, you can cancel anytime before your next billing date. One-time purchases like the Starter pack are non-refundable but never expire.',
  },
  {
    question: 'Can I upgrade or downgrade my subscription plan?',
    answer: 'Yes, you can upgrade or downgrade your plan anytime from your account settings. Upgrades take effect immediately, and you\'ll only pay the difference for the remainder of your current billing cycle. Downgrades take effect on your next renewal date. If you upgrade from Creator to Pro mid-month, you\'ll be charged the prorated difference. There are no cancellation fees or penalties for switching plans.',
  },
]

export function FAQAccordion() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {FAQS.map((faq, index) => (
        <button
          key={index}
          onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          className="premium-card w-full p-6 text-left transition-all duration-200 hover:border-purple-600/50"
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-slate-100">{faq.question}</h3>
            <svg
              className={`h-5 w-5 text-purple-400 flex-shrink-0 transition-transform duration-300 ${
                expandedIndex === index ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>

          {expandedIndex === index && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
