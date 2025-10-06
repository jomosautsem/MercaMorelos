import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Esto es opcional, pero ayuda a que se abra automáticamente
    open: true, 
  },
});