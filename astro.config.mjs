import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  site: 'https://konglx90.github.io',
  outDir: 'docs',
  build: {
    assets: '_assets',
  },
});
