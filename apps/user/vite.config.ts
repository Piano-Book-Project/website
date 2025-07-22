import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Vercel 배포를 위해 루트 경로로 변경
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});

// 변경사항 적용 및 푸시 방법

// vite.config.ts 파일의 중복된 내용을 제거하고 푸시하는 방법은 다음과 같습니다:

// 1. vite.config.ts 파일 수정

// 먼저 `vite.config.ts` 파일을 열고 내용을 다음과 같이 수정하세요:
