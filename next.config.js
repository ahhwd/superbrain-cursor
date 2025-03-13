/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'zh-TW'],
    defaultLocale: 'en',
    localeDetection: true
  }
}

module.exports = nextConfig 