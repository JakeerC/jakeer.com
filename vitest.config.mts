import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { transform } from 'esbuild';

export default defineConfig({
  plugins: [
    {
      name: 'force-tsx',
      enforce: 'pre',
      async transform(code, id) {
        if (id.endsWith('.test.ts')) {
          const result = await transform(code, { loader: 'tsx', jsx: 'automatic', format: 'esm' });
          return { code: result.code, map: result.map };
        }
      }
    },
    react()
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: ['node_modules/**', '.next/**', '**/*.config.*', 'coverage/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});
