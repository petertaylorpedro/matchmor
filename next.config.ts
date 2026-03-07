import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
  return {
    beforeFiles: [
      { source: '/', destination: '/api/home' },
      { source: '/privacy', destination: '/api/privacy' },
      { source: '/terms', destination: '/api/terms' },
    ],
  }
},
export default nextConfig
