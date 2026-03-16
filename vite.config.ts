import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/", // importante para Vercel si usás rutas relativas
  plugins: [react()],
  define: {
    global: {},
  },
  build: {
    outDir: 'dist',
  },
  server: {
    historyApiFallback: true,
  }
});
