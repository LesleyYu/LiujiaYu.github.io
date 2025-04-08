import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Your React app is running on port 5173
    proxy: {
      '/search': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/artist': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/artwork': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/similar': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/genes': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
