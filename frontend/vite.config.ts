import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    https: {
      key: fs.readFileSync('./certs/10.228.56.157-key.pem'),
      cert: fs.readFileSync('./certs/10.228.56.157.pem'),
    },
  },
});