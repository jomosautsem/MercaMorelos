import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This allows the server to be accessible on the local network
    host: true, 
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // The address of your backend server
        changeOrigin: true,
      },
    },
  },
});