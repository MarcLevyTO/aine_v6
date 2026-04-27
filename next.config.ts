import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable standalone output so the production Docker image can copy a minimal
  // server bundle instead of the full node_modules tree.
  output: 'standalone',
};

export default nextConfig;
