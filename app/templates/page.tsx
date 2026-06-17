import { currentUser, redirectToSignIn } from '@clerk/nextjs'
import Link from 'next/link'

const TEMPLATES = [
  // Founder Pack
  { id: 'ted-stage', name: 'TED Stage', category: 'Founder Pack', description: 'Speaking at a world-class conference' },
  { id: 'podcast', name: 'Podcast Studio', category: 'Founder Pack', description: 'Professional podcast interview setup' },
  { id: 'conference', name: 'Business Conference', category: 'Founder Pack', description: 'Networking at a premium conference' },

  // Luxury Pack
  { id: 'private-jet', name: 'Private Jet', category: 'Luxury Pack', description: 'Boarding or relaxing in a private jet' },
  { id: 'yacht', name: 'Yacht', category: 'Luxury Pack', description: 'Luxury yacht in exotic waters' },
  { id: 'penthouse', name: 'Penthouse', category: 'Luxury Pack', description: 'Modern luxury penthouse view' },
  { id: 'michelin', name: 'Michelin Restaurant', category: 'Luxury Pack', description: 'Fine dining experience' },

  // Travel Pack
  { id: 'maldives', name: 'Maldives', category: 'Travel Pack', description: 'Tropical island paradise' },
  { id: 'dubai', name: 'Dubai', category: 'Travel Pack', description: 'Luxury shopping and architecture' },
  { id: 'monaco', name: 'Monaco', category: 'Travel Pack', description: 'Glamorous Mediterranean coast' },
  { id: 'santorini', name: 'Santorini', category: 'Travel Pack', description: 'Iconic Greek island sunsets' },
]

export default async function TemplatesPage() {
  const user = await currentUser()

  if (!user) {
    redirectToSignIn()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-900/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold text-white hover:text-slate-300">
            Delusionify
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-4">Lifestyle Templates</h1>
        <p className="text-slate-400 mb-12">Choose a scenario to place yourself in</p>

        {/* Templates Grid */}
        <div className="space-y-8">
          {['Founder Pack', 'Luxury Pack', 'Travel Pack'].map((category) => (
            <div key={category}>
              <h2 className="text-2xl font-semibold text-white mb-4">{category}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {TEMPLATES.filter(t => t.category === category).map((template) => (
                  <div key={template.id} className="rounded-lg border border-slate-700 bg-slate-800 overflow-hidden hover:border-slate-600 hover:bg-slate-700 transition-all cursor-pointer">
                    <div className="aspect-video bg-slate-700 flex items-center justify-center">
                      <svg className="h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white">{template.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">{template.description}</p>
                      <button className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
