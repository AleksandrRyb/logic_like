import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: process.env.VITE_SERVER_ORIGIN || "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
})
