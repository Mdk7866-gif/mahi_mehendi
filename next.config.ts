import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Use remotePatterns instead of `domains`
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    // Optimize image loading
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
  },
  // Enable compression
  compress: true,
  // NOTE: `swcMinify` removed because Next.js 16+ (with Turbopack) doesn't accept it in NextConfig.
  // If you really need special minification, rely on the default production optimizer or configure an external bundler.
};

export default nextConfig;
