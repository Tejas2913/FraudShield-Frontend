import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    strictPort: false,  // allow Vite to shift port if 5173 is taken
    cors: false,        // let backend handle CORS, don't double-handle
    // NOTE: We bypass the proxy entirely and hit the backend directly
    // from api.js (baseURL: http://localhost:8000) to avoid proxy
    // stripping Authorization headers.
  },
})
