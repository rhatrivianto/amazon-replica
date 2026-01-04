
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import jsconfigPaths from 'vite-jsconfig-paths' // Nonaktifkan sementara untuk debugging

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // jsconfigPaths() // Nonaktifkan sementara
  ],
  build: {
    emptyOutDir: true,
  }
})
