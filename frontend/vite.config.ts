import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  plugins: [
    vue(),
    vueJsx(),
    ...(process.env.NODE_ENV !== 'production' ? [vueDevTools()] : []),
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

          if (id.includes('championFull.json')) return 'champion-data'
          if (id.includes('youtube.json')) return 'youtube-data'  
          if (id.includes('item.json')) return 'item-data'
          if (id.includes('runesReforged.json')) return 'runes-data'
          if (id.includes('dictionnaire.json')) return 'dictionary-data'
          
          if (id.includes('node_modules/vue-i18n')) return 'vue-i18n'
          if (id.includes('node_modules/chart.js')) return 'charts'
          if (id.includes('node_modules/axios')) return 'http'
          if (id.includes('node_modules/@vue-office/excel')) return 'excel'
          if (id.includes('node_modules/html2canvas')) return 'canvas'
          if (id.includes('node_modules/dom-to-image-more')) return 'image-export'
          
          if (id.includes('locales/')) return 'i18n-data'
          if (id.includes('/views/')) {
            const viewMatch = id.match(/views\/([^/]+)\.vue/)
            if (viewMatch) return `view-${viewMatch[1].toLowerCase()}`
          }
          
          if (id.includes('Selection/')) return 'selection-components'
          if (id.includes('Tooltip/')) return 'tooltip-components'
          if (id.includes('Admin/')) return 'admin-components'
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name ? assetInfo.name.split('.') : ['']
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash].[ext]`
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash].[ext]`
          }
          return `assets/[name]-[hash].[ext]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    assetsInlineLimit: 0,
    sourcemap: true,
    chunkSizeWarningLimit: 25, 
    target: 'es2020',
    
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production', 
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        safari10: true
      }
    }
  },
  optimizeDeps: {
    include: ['uuid', 'vue-i18n']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    },
    headers: {
      'Permissions-Policy': ''
    }
  },
  json: {
    stringify: true
  }
})