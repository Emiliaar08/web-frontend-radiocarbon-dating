import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backend = process.env.REMAINS_API_TARGET || 'http://127.0.0.1:8000'
const storage = process.env.REMAINS_MINIO_TARGET || 'http://127.0.0.1:9000'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': { target: backend, changeOrigin: true },
      '/static/remains/': { target: backend, changeOrigin: true },
      '/minio/': {
        target: storage,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/minio/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (request) => request.removeHeader('cookie'))
        },
      },
    },
  },
})
