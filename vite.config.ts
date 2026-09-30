import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Vercel and local builds retain the existing root deployment.
  base: mode === 'github-pages' ? '/index-archive/' : '/',
}));
