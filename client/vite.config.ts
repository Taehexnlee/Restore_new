import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  build: {
    outDir: "../API/wwwroot",          // ← 빌드 산출물 API로!
    emptyOutDir: true,                  // 빌드 시 출력 폴더 비우기
    chunkSizeWarningLimit: 1024,        // 경고 임계값(1MB) 상향
  },
  server: {
    port: 3000,
    https: true
  },
});