import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const layers = ['app', 'widgets', 'features', 'entities', 'shared'];

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores(['.next/**', 'out/**', 'coverage/**', '.superpowers/**', 'playwright-report/**', 'test-results/**', 'next-env.d.ts']),
  ...layers.map((layer, index) => ({
    files: [`src/${layer}/**/*.{ts,tsx}`],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            regex: '^@/(?:widgets|features|entities)/[^/]+/.+',
            message: 'Import another slice through its public index.ts.',
          },
          ...(index > 0 ? [{
            group: layers.slice(0, index + 1).flatMap((name) => [`@/${name}`, `@/${name}/**`]),
            message: 'FSD layers depend downward. Use relative imports within your own slice.',
          }] : []),
        ],
      }],
    },
  })),
]);
