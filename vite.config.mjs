import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: 'out/webview',
    rollupOptions: {
      input: 'src/webview/main.ts',
      output: {
        entryFileNames: '[name].js',
        format: 'iife',
        name: 'app'
      }
    },
    minify: false,
    sourcemap: true,
    emptyOutDir: true
  }
});