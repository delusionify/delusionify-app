'use client'

import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative w-48 h-14">
              <Image
                src="/delusionify_white_logo.png"
                alt="Delusionify Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <p className="text-slate-300 text-lg">Turn your delusions into reality</p>
        </div>

        <div className="premium-card p-8">
          <SignIn routing="hash" />
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Experience the future of AI-powered lifestyle transformations
        </p>
      </div>

      <style jsx>{`
        :global(.cl-rootBox) {
          --colors-danger: rgb(239, 68, 68);
          --colors-primary: rgb(147, 51, 234);
          color: rgb(226, 232, 240);
        }

        :global(.cl-formButtonPrimary) {
          background-color: rgb(147, 51, 234);
          color: white;
        }

        :global(.cl-formButtonPrimary:hover) {
          background-color: rgb(126, 34, 206);
        }

        :global(.cl-card) {
          background-color: transparent;
          border: none;
          box-shadow: none;
        }

        :global(.cl-socialButtonsBlockButton) {
          border-color: rgb(51, 65, 85);
          color: rgb(226, 232, 240);
        }

        :global(.cl-socialButtonsBlockButton:hover) {
          background-color: rgb(30, 41, 59);
          border-color: rgb(148, 163, 184);
        }

        :global(.cl-dividerLine) {
          background-color: rgb(51, 65, 85);
        }

        :global(.cl-dividerText) {
          color: rgb(148, 163, 184);
        }

        :global(.cl-formFieldLabel) {
          color: rgb(226, 232, 240) !important;
          font-weight: 600;
        }

        :global(.cl-formFieldInput) {
          background-color: rgb(15, 23, 37);
          border-color: rgb(51, 65, 85);
          color: rgb(226, 232, 240) !important;
        }

        :global(.cl-formFieldInput::placeholder) {
          color: rgb(100, 116, 139) !important;
        }

        :global(.cl-formFieldInput:focus) {
          border-color: rgb(147, 51, 234);
          box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
        }

        :global(.cl-footerActionLink) {
          color: rgb(147, 51, 234);
        }

        :global(.cl-footerActionLink:hover) {
          color: rgb(168, 85, 247);
        }

        :global(.cl-headerTitle) {
          color: rgb(226, 232, 240) !important;
        }

        :global(.cl-headerSubtitle) {
          color: rgb(148, 163, 184) !important;
        }

        :global(body) {
          color: rgb(226, 232, 240);
        }

        :global(.cl-socialButtonsBlockButton svg) {
          color: rgb(226, 232, 240) !important;
          fill: rgb(226, 232, 240) !important;
        }

        :global(.cl-socialButtonsBlockButton svg path) {
          fill: rgb(226, 232, 240) !important;
          stroke: rgb(226, 232, 240) !important;
        }

        :global(.cl-socialButtonsBlockButton img) {
          display: block !important;
          width: 20px !important;
          height: 20px !important;
          object-fit: contain !important;
        }

        :global(.cl-socialButtonsBlockButton__icon) {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        :global(.cl-button__icon) {
          width: 20px !important;
          height: 20px !important;
          display: block !important;
        }

        :global(.cl-socialButtonsBlockButton svg) {
          filter: brightness(1) !important;
        }

        :global(.cl-socialButtonsBlockButton > span svg) {
          color: white !important;
          fill: white !important;
        }

        :global(.cl-socialButtonsBlockButton__icon svg) {
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  )
}
