import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
      },
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules/vue-i18n')) {
            return 'vue-i18n'
          }
          if (id.includes('champion.json')) {
            return 'champion-data'
          }
          if (id.includes('locales/')) {
            return 'i18n'
          }
        }
      }
    },
    assetsInlineLimit: 0,
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    target: 'es2020'
  },
  optimizeDeps: {
    include: ['uuid', 'vue-i18n']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3500',
        changeOrigin: true
      }
    }
  },
  json: {
    stringify: true
  }
})