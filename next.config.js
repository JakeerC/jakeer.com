/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ['src'],
  },
  images: {
    domains: [
      'res.cloudinary.com',

      // Spotify Album
      'i.scdn.co',
    ],
  },
};

module.exports = nextConfig;
