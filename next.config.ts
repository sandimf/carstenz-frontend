import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://api.ranupani.my.id/api/v1/:path*', 
      },
      {
        source: '/api/python-proxy/:path*',
        destination: 'https://python.ranupani.my.id/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
