/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://plearn-tracking-be.fly.dev/api/:path*',
      }
    ]
  }
}

export default nextConfig
