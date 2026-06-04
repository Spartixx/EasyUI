/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/stories', '**/*.stories.*'],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
  test: {
    name: 'storybook',
    passWithNoTests: true,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({}),
      instances: [{ browser: 'chromium' }],
    },
    projects: [{
      extends: true,
      plugins: [
        storybookTest({ configDir: path.join(dirname, '.storybook') }),
      ]
    }],
  },
});
