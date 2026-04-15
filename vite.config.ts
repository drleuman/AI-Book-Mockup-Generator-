
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const appPort = Number(env.VITE_PORT || 5174);
  const bffTarget = env.VITE_BFF_TARGET || 'http://localhost:8790';

  return {
    plugins: [react()],
    server: {
      port: appPort,
      host: true,
      proxy: {
        '/api/mockups': {
          target: bffTarget,
          changeOrigin: true,
          secure: false,
        },
        '/health': {
          target: bffTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port: appPort,
      host: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
