
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import jsconfigPaths from 'vite-jsconfig-paths' // Impor plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    jsconfigPaths() // Tambahkan plugin di sini
  ],
  // Tambahkan konfigurasi build ini untuk memancing Vercel melakukan build ulang
  build: {
    // Force rebuild timestamp: Admin Fix Final 02
    emptyOutDir: true,
  }
})
