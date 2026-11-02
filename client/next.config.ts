import type { NextConfig } from "next";

const nextConfig = {
  turbopack: {},
 // output: 'export',
  // basePath: '/sts',
  // assetPrefix: '/sts/',
  trailingSlash: true, 
  images: {
    unoptimized: true,
  },
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    config.watchOptions = {
      ignored: /node_modules|\.next/,
      poll: false,
    };
    return config;
  },
};

export default nextConfig;
