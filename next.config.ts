import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://localhost:9000/api/v1/:path*', // Laravel
      },
      {
        source: '/api/python-proxy/:path*',
        destination: 'http://localhost:8001/api/v1/:path*', // Python
      },
    ];
  },
};
export default nextConfig;
