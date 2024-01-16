/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "173.255.198.245",
      },
    ],
  },
};

module.exports = nextConfig;
