/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: false,
    },
    basePath: isProd ? '/air-in-pipes' : '',
    assetPrefix: isProd ? '/air-in-pipes/' : '',
  };
  
  module.exports = nextConfig;