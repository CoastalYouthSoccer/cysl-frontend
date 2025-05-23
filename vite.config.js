// Plugins
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    sourcemap: true,
  },
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    Vuetify({
      autoImport: true,
    }),
    Components(),
  ],
  define: { 'process.env': process.env },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  optimizeDeps: {
    include: ["vuetify"],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
  },
});
