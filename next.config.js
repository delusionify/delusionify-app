/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'wibnoeiflzsnorcvglms.supabase.co',
      'replicate.delivery',
    ],
    unoptimized: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
