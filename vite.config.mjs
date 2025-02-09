import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

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
      },
      external: [
        'chromadb',
        'chromadb-default-embed',
        '@xenova/transformers'
      ]
    },
    minify: false,
    sourcemap: true,
    emptyOutDir: true
  },
  optimizeDeps: {
    exclude: ['chromadb', '@xenova/transformers']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});