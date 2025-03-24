import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: '0.0.0.0',  // 모든 IP에서 접근 가능하도록 설정
        port: 5173,  // 기본 포트 번호
    },

    plugins: [
      react(),
  ],
})
