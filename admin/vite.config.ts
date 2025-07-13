import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// gh-pages 환경 base 경로 자동 설정
const isGhPages = process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES === 'true';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 배포를 위한 base URL 설정
  base: isGhPages ? '/website/' : '/',
  server: {
    port: 5173,
    host: 'localhost',
    // 프록시 설정 - API 요청을 백엔드로 전달
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
    // 보안 헤더 설정
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
    // CORS 설정
    cors: {
      origin: ['http://localhost:3002'], // 백엔드 서버 주소
      credentials: true,
    },
  },
  // 빌드 설정
  build: {
    outDir: 'dist',
    // 소스맵 비활성화 (보안상)
    sourcemap: false,
    // 청크 크기 경고 임계값
    chunkSizeWarningLimit: 1000,
    // 빌드 최적화
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: 'index.html',
        ...(isGhPages && { '404': 'index.html' })
      },
      output: {
        // 청크 파일명 설정
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
        },
        // 청크 파일명 해시 제거 (GitHub Pages 캐싱 문제 해결)
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  // 환경 변수 설정
  define: {
    __DEV__: process.env.NODE_ENV === 'development',
  },
  // 최적화 설정
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material', '@mui/icons-material'],
  },
})
