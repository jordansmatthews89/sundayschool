/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: ['@octokit/rest'],
  },
};

export default nextConfig;
