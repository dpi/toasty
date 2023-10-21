import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  define: {
    // 'process.env.NODE_ENV': '"production"'
    'process.env.NODE_ENV': '"development"'
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/main.js'),
      name: 'Toasty',
      // the proper extensions will be added
      fileName: 'toasty',
      formats: ["es"],
    },
  },
  target: "es2015",
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
