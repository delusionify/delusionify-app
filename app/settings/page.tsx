import { currentUser } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default async function SettingsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/delusionify_white_logo.png"
              alt="Delusionify Logo"
              width={180}
              height={50}
              className="h-24 w-auto"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/workflow"
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
              title="New Generation"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
            <Link
              href="/history"
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
              title="History"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Link>
            <Link
              href="/billing"
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
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Settings</h1>
            <p className="text-slate-400">Manage your account preferences</p>
          </div>

          {/* Account Section */}
          <div className="premium-card p-8">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">Account Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                <p className="text-slate-100 bg-slate-800/50 rounded-lg p-3 font-mono text-sm">
                  {user?.emailAddresses[0]?.emailAddress}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">User ID</label>
                <p className="text-slate-300 bg-slate-800/50 rounded-lg p-3 font-mono text-sm">
                  {user?.id}
                </p>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="premium-card p-8">
            <h2 className="text-xl font-semibold text-slate-100 mb-6">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                <label className="text-slate-100 font-medium cursor-pointer">Email notifications</label>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-600 bg-slate-700" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                <label className="text-slate-100 font-medium cursor-pointer">Marketing emails</label>
                <input type="checkbox" className="w-5 h-5 rounded border-slate-600 bg-slate-700" />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border border-red-900/50 rounded-xl bg-red-900/10 backdrop-blur-xl p-8">
            <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>
            <p className="text-red-300/80 text-sm mb-6">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="px-6 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-500/20">
              Delete Account
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-8 border-b border-slate-800">
              <div className="relative w-8 h-8 mb-6 md:mb-0">
                <Image
                  src="/delusionify_icon.png"
                  alt="Delusionify Icon"
                  fill
                  className="object-contain"
                />
              </div>

              <p className="text-sm text-slate-500">
                © 2026 Delusionify. Transform your reality with premium AI.
              </p>

              <div className="flex gap-8 mt-6 md:mt-0">
                <a href="#" className="text-slate-400 hover:text-purple-500 transition-colors" title="TikTok">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 11-2.4-2.4c.23 0 .46.04.68.09V9.24c-.29-.05-.58-.08-.88-.08a5.5 5.5 0 105.5 5.5V9.38a7.21 7.21 0 004.86 1.81V6.92a4.9 4.9 0 01-.73-.23z" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-purple-500 transition-colors" title="Instagram">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-purple-500 transition-colors" title="Facebook">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
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
