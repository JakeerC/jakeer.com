import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external images if you add a profile photo later
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  // Turbopack (Next 16 default)
  experimental: {},
};

export default nextConfig;
