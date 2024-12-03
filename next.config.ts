import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true
  },
  env: {
    PINATA_JWT: process.env.PINATA_JWT,
    WALLET_CONNECT_ID:  process.env.WALLET_CONNECT_ID
  }
};

export default nextConfig;
