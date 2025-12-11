import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  // reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname), path.join(__dirname, "node_modules"), path.join(__dirname, "node_modules/bootstrap/scss")],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: true, // Allow local uploads without optimization
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
