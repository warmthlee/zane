import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Windows 的 Hyper-V/WinNAT 会保留 5088–5187 等端口段，Vite 默认 5173 会 EACCES。
    // 固定到未保留的 3000；被占用时 Vite 仍会自动顺延。
    port: 3000,
    proxy: {
      // 本地联调把 /api 转发到 ASP.NET Core；生产由 Nginx 反代同名前缀。
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    clearMocks: true,
  },
})
