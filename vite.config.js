import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  css: {
    // Wyłącz mapy źródłowe dla CSS
    sourceMap: false,
  },
});
