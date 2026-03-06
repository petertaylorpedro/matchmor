import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/matchmor-founding.html',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
