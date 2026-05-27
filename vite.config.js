import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

// En proyectos ESM, __dirname no está disponible — lo reconstruimos
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias "@" → "./src" requerido por shadcn/ui y buenas prácticas de imports
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    // Proxy al backend Express — evita problemas de CORS en desarrollo
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
