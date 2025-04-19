import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.keep': 'text',
      },
    },
  },
  plugins: [
    tailwindcss(),
  ],
})