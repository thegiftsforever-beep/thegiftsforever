/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['mongoose'],
  images: {
    loader: 'custom',
    loaderFile: './lib/imageLoader.js',
    // images uploaded from the admin are stored in MongoDB and served from /api/uploads/**
    localPatterns: [{ pathname: '/api/uploads/**' }, { pathname: '/**' }],
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
};
export default nextConfig;
