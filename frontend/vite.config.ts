import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vitePluginForArco } from '@arco-plugins/vite-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePluginForArco({
      style: true,
      varsInjectScope: ['*']
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'arcoblue-6': '#66ccff'
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});