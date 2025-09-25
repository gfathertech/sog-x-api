import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa' // PWA plugin

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables FIRST
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:4001' // Default to common API port
  
  console.log('API URL:', apiUrl) // Debug logging

  return {
    plugins: [
      react(),
      // PWA configuration
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'SOG-X API',
          short_name: 'SOG-X API',
          description: 'Your app description',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'web-app-manifest-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'web-app-manifest-pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    server: {
      port: 5173, // Client runs on port 3000
      proxy: {
        '/api': {
          target: apiUrl, // Server runs on different port/URL
          changeOrigin: true,
          secure: false,
          // rewrite: (path) => path.replace(/^\/api/, '') // Uncomment if your API doesn't use /api prefix
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@lib': path.resolve(__dirname, './src/lib'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@shared': path.resolve(__dirname, '../../../server'), // Monorepo shared code
      }
    },
    // Build configuration for production
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production'
    },
    // Preview configuration (for testing production build)
    preview: {
      port: 3000,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})