import { createMDX } from "fumadocs-mdx/next";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "http://clinic-nginx:80/api/v1/:path*",
      },
      {
        source: "/api/python-proxy/:path*",
        destination: "http://python-service:8001/api/v1/:path*",
      },
    ];
  },
};

export default createMDX()(nextConfig);
