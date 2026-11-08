import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['agents/**/*.test.js', 'tests/repository/**/*.test.mjs', 'src/**/*.test.{ts,tsx}'],
  },
});
