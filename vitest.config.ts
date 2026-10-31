import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],
  test: {
    include: ['app/src/**/*.test.ts', 'server/src/**/*.test.ts'],
    coverage: { provider: 'v8', reporter: ['text', 'lcov'], reportsDirectory: 'coverage', include: ['app/src/**/*.{ts,vue}', 'server/src/**/*.ts'], exclude: ['**/*.test.ts', 'app/src/main.ts'] },
  },
})
