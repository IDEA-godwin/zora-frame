import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true
  },
  env: {
    PINATA_JWT: process.env.PINATA_JWT
  }
};

export default nextConfig;
