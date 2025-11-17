import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Use remotePatterns instead of `domains` (domains is deprecated)
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
    // removed `domains` because it's deprecated in favor of remotePatterns
  },
};

export default nextConfig;
