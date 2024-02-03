/** @type {import('next').NextConfig} */
import nextPwa from 'next-pwa';
const withPwa = nextPwa({
  dest: 'public',
});

const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  transpilePackages: ['@growiary/types'],
};

export default process.env.NODE_ENV === 'development' ? nextConfig : withPwa(nextConfig);
