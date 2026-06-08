import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: false,   // 不复制 public/
  build: {
    outDir: 'public/vendor',
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/clock-entry.jsx',
      output: {
        entryFileNames: 'vendor.js',
        format: 'iife',
      },
    },
  },
});
