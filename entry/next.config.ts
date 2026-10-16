import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: '/memories/:path*',
        destination: 'https://portfolio729.vercel.app/memories/:path*',
      },
      {
        source: '/memories',
        destination: 'https://portfolio729.vercel.app/memories/index.html',
      },
      {
        source: '/textures/:path*',
        destination: 'https://portfolio729.vercel.app/textures/:path*',
      },
      {
        source: '/audios/:path*',
        destination: 'https://portfolio729.vercel.app/audios/:path*',
      },
    ];
  },
};

export default nextConfig;
