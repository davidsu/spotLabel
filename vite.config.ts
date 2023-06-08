import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './',
    rollupOptions: {
      input: {
        app: './main.html', // default
      },
    },
  },
  plugins: [react()],
})
