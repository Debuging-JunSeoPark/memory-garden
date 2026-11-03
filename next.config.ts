import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep the repository's curated guidance stable during local development.
  agentRules: false,
  // This repository is nested inside a separate pnpm project.
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },
};

export default nextConfig;
