/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  // Disable static optimization for client-side routes
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Ensure client-side pages are not statically generated
  output: undefined,
}

module.exports = nextConfig;
