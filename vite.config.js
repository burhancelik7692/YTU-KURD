import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import * as path from 'path'; 

export default defineConfig({
  root: './', // Kök dizinini belirtiyoruz
  resolve: {
    alias: {
      // Rollup hatasını gidermek için alias
      '@/src': path.resolve(__dirname, 'src'), 
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png'],
      manifest: {
        name: 'YTU Kurdî - Komeleya Xwendekaran',
        short_name: 'YTU Kurdî',
        description: 'Zanîngeha Yıldız Teknîk - Komeleya Kurdî',
        theme_color: '#1e3a8a',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})