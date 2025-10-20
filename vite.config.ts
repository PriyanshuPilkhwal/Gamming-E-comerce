import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url' // <-- Import this

// --- Define __dirname in ES module scope ---
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// ------------------------------------------

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This will now work
      "@": path.resolve(__dirname, "./src"),
    },
  },
})