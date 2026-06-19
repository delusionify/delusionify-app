import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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

export default async function BillingPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-slate-100 hover:text-indigo-400 transition-colors">
            Delusionify
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
              href="/settings"
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
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold gradient-text mb-4">Subscription Plans</h1>
            <p className="text-slate-400 text-lg">Choose the perfect plan for your creative needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`premium-card relative overflow-hidden p-8 transition-all duration-300 ${
                  plan.featured
                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105'
                    : 'hover:shadow-lg hover:shadow-indigo-500/10'
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-1 text-xs font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-slate-100">{plan.name}</h3>
                  <p className="text-sm text-slate-400 mt-2">{plan.description}</p>
                </div>

                <div className="mt-8 mb-8">
                  <span className="text-5xl font-bold gradient-text">{plan.price}</span>
                  <span className="text-slate-400 ml-3 text-sm">{plan.period}</span>
                </div>

                <div className="space-y-4 mb-8 pb-8 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-300">{plan.images} images/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-300">{plan.videos} videos/month</span>
                  </div>
                </div>

                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
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
          <div className="mt-16 premium-card p-12">
            <h2 className="text-2xl font-bold gradient-text mb-8">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-slate-100 mb-2">Can I change my plan anytime?</h3>
                <p className="text-slate-400">Yes, you can upgrade or downgrade your plan anytime. Changes will reflect in your next billing cycle.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100 mb-2">What payment methods do you accept?</h3>
                <p className="text-slate-400">We accept all major credit cards, debit cards, and digital payment methods through Stripe.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100 mb-2">Is there a free trial?</h3>
                <p className="text-slate-400">Yes, new users get a free trial with 5 images to explore our platform.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100 mb-2">What if I need more generations?</h3>
                <p className="text-slate-400">You can always add credits for additional generations at any time.</p>
              </div>
            </div>
          </div>
        </div>
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
