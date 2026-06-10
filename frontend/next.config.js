/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.illusorydesignstudios.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/employee/:path*',
        destination: '/packages/employee/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ],
    }]
  }
};

module.exports = nextConfig;

