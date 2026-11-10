import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // High-resolution assets in public/images/couple are pre-optimised (<=2000px, high-DPI JPEG)
    // Using unoptimized when CF_PAGES / CLOUDFLARE_WORKERS is set ensures zero paid add-ons on Cloudflare Workers,
    // while keeping Next.js responsive image optimisation active in standard Node environments.
    unoptimized: process.env.CLOUDFLARE_WORKERS === "true",
    formats: ["image/avif", "image/webp"],
  },
  serverExternalPackages: ["pg", "@prisma/client", "@prisma/adapter-pg", "@prisma/adapter-neon"],
};

export default nextConfig;
