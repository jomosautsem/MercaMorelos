import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This allows the server to be accessible on the local network
    host: true, 
    proxy: {
      // Proxy requests from /api to the backend server
      '/api': {
        target: 'http://localhost:4000', // Your backend server address
        changeOrigin: true, // Recommended for virtual hosted sites
      },
    },
  },
});
