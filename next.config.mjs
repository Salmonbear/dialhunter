/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'parkersjewellers.co.uk',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'grabawatch.com',
        port: '',
        pathname: '/cdn/shop/files/**',
      },
      {
        protocol: 'https',
        hostname: 'www.vintagemasters.eu',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.chrono24.com',
        port: '',
        pathname: '/images/uhren/**',
      },
      {
        protocol: 'https',
        hostname: 'img.chrono24.com',
        port: '',
        pathname: '/images/uhren/**',
      },
      {
        protocol: 'https',
        hostname: 'www.omegawatches.com',
        port: '',
        pathname: '/media/catalog/product/**', 
      },
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/s/files/**', 
      },
      {
        protocol: 'https',
        hostname: 'watchesofdistinction.com',
        port: '',
        pathname: '/wp-content/uploads/**', 
      },
    ],
  },
};

export default nextConfig; 