/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  poweredByHeader: false,
  distDir: '.next',
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig 