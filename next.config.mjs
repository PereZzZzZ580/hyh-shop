import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "picsum.photos"
      },
      {
        protocol: "https",
        hostname: "loremflickr.com"
      },
      {
        protocol: "https",
        hostname: "images.pexels.com"
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      },
    ],
  },
  webpack: (config) => {
    // Use project root for alias in ESM config
    config.resolve.alias["@"] = path.resolve(process.cwd(), "src");
    return config;
  }
};
export default nextConfig;
