import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    // allow external tunnel hostnames (e.g., ngrok) to reach the preview server
    allowedHosts: ['.ngrok-free.dev', 'proscience-merry-timeworn.ngrok-free.dev'],
  },
})
