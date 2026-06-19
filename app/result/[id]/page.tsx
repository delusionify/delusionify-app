import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { JobResult } from '@/components/JobResult'

export default async function ResultPage({
  params,
}: {
  params: { id: string }
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-slate-100 hover:text-indigo-400 transition-colors">
            Delusionify
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/workflow" className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors text-sm">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Creation
            </Link>
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors text-sm">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <JobResult jobId={params.id} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16 py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-slate-500">
            © 2026 Delusionify. Transform your reality with premium AI.
          </p>
        </div>
      </footer>
    </div>
  )
}
