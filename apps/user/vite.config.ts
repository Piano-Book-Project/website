import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  base: '/website/', // GitHub Pages용 base 경로
  plugins: [react()],
});
