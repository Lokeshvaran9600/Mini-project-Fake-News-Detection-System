import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  base: '/', // ✅ IMPORTANT for Vercel

  plugins: [react()],

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    target: 'esnext',
    outDir: 'dist', // ✅ MUST be dist for Vercel
  },

  server: {
    port: 3000,
    open: true,
  },
})
