import { defineConfig } from 'vite';

// base './' makes the build work from any sub-path (GitHub Pages, Netlify, S3...).
export default defineConfig({
  base: './',
  build: { chunkSizeWarningLimit: 600 },
  test: { environment: 'jsdom', include: ['src/test/**/*.test.ts'] },
});
