import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist' },
  server: {
    port: 5173,
    // Em desenvolvimento as chamadas /api vao para o Azure Functions Core Tools.
    // Publicado no Static Web Apps, /api ja e servido no mesmo dominio.
    proxy: {
      '/api': {
        target: 'http://localhost:7071',
        changeOrigin: true,
      },
    },
  },
});
