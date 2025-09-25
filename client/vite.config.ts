import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  build: {
    outDir: "../API/wwwroot",          // Emit the client bundle into the backend's static folder
    emptyOutDir: true,                  // Clear the output directory before building
    chunkSizeWarningLimit: 1024,        // Raise the warning threshold to 1MB
  },
  server: {
    port: 3000,
    https: true
  },
});
