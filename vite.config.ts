import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Served from movahedi.ca/tabletop/ — assets must resolve under that path.
  base: '/tabletop/',
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
