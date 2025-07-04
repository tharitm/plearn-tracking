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
    const isProduction = process.env.NODE_ENV === 'production'
    return [
      {
        source: '/api/:path*',
        destination: isProduction 
          ? 'https://plearn-tracking-be.fly.dev/api/:path*'
          : 'http://localhost:3001/api/:path*',
      }
    ]
  }
}

export default nextConfig
