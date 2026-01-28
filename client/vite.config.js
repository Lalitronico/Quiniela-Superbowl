import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true
      }
    }
  },
  build: {
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React ecosystem
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Animation library (large, separate chunk)
          'framer': ['framer-motion']
        }
      }
    },
    // Enable source maps for debugging in production
    sourcemap: false,
    // Minification
    minify: 'esbuild',
    // Target modern browsers for smaller bundles
    target: 'es2020'
  }
})
