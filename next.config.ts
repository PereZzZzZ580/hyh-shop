import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Alternativa simple (usa una, no ambas):
    // domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
