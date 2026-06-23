import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'node:fs';
import path from 'path';
import {defineConfig} from 'vite';

const copyDotfiles = {
  name: 'copy-dotfiles',
  closeBundle() {
    copyFileSync(
      path.resolve(__dirname, 'public/.htaccess'),
      path.resolve(__dirname, 'dist/.htaccess')
    );
  },
};

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [react(), tailwindcss(), copyDotfiles],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Serve index.html for all non-asset paths so React Router handles routing
      historyApiFallback: true,
    },
  };
});
