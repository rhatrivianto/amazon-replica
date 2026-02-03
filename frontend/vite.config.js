
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// // import jsconfigPaths from 'vite-jsconfig-paths' // Nonaktifkan sementara untuk debugging

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     // jsconfigPaths() // Nonaktifkan sementara
//   ],
//   build: {
//     emptyOutDir: true,
//   }
// })

// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Pastikan ini ada
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})