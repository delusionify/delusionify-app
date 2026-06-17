import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'Delusionify - Reality Transformation Platform',
  description: 'Transform yourself into any lifestyle or scenario with AI',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gradient-to-br from-slate-950 to-slate-900">{children}</body>
      </html>
    </ClerkProvider>
  )
}
