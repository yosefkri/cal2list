import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    base: './',
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      chunkSizeWarningLimit: 600,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV ?? mode),
    },
  }
})


