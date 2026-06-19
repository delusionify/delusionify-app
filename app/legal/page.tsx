import Link from 'next/link'
import Image from 'next/image'

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="relative w-8 h-8">
              <Image
                src="/delusionify_logo.png"
                alt="Delusionify Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-slate-100">Delusionify</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold gradient-text mb-8">Legal Notice</h1>

          <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Disclaimer</h2>
              <p>
                The information provided on the Delusionify platform is for educational and entertainment purposes only. While we strive to ensure accuracy, we make no warranties regarding the completeness, accuracy, or reliability of any content on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Intellectual Property Rights</h2>
              <p>
                All content on Delusionify, including text, graphics, logos, images, and software, is the property of Delusionify or its content suppliers and is protected by international copyright laws. Unauthorized reproduction or distribution of this material is prohibited.
              </p>
              <p>
                Users retain ownership of any content they upload to Delusionify, but grant us a license to use, copy, modify, and distribute such content for the purposes of providing our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Liability Limitation</h2>
              <p>
                In no event shall Delusionify be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, resulting from your use or inability to use the platform or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Third-Party Links</h2>
              <p>
                Delusionify may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of these external sites. Your use of third-party sites is at your own risk and subject to their terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">User Generated Content</h2>
              <p>
                Users are responsible for any content they upload to Delusionify. You represent and warrant that any content you upload does not violate any laws, infringe upon any rights, or contain any malicious code. Delusionify reserves the right to remove any content that violates these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Delusionify, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising out of your use of the platform or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Modification of Terms</h2>
              <p>
                Delusionify reserves the right to modify these legal terms at any time. Changes become effective immediately upon posting to the website. Your continued use of the platform following any such modifications constitutes your acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Severability</h2>
              <p>
                If any provision of this legal notice is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect, and the invalid provision shall be modified to the minimum extent necessary to make it valid.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Entire Agreement</h2>
              <p>
                This legal notice, together with our Privacy Policy and Terms & Conditions, constitutes the entire agreement between you and Delusionify regarding your use of the platform and supersedes all prior or contemporaneous communications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">Contact Information</h2>
              <p>
                For questions regarding this legal notice or to report violations, please contact us at legal@delusionify.com.
              </p>
            </section>

            <p className="text-sm text-slate-500 pt-8">Last Updated: June 2024</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-24 py-12">
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

              <div className="flex gap-4 mt-6 md:mt-0">
                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors" title="TikTok">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 11-2.4-2.4c.23 0 .46.04.68.09V9.24c-.29-.05-.58-.08-.88-.08a5.5 5.5 0 105.5 5.5V9.38a7.21 7.21 0 004.86 1.81V6.92a4.9 4.9 0 01-.73-.23z" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-pink-400 transition-colors" title="Instagram">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors" title="Facebook">
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
