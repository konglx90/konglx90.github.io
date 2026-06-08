import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://konglx90.github.io',
  outDir: 'docs',
  build: {
    assets: '_assets',
  },
});
