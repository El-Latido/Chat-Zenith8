import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true'
    },
    build: {
      // Silenciamos la advertencia porque ahora controlamos los chunks manualmente
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // 1. Separa React y ReactDOM (núcleo de la UI)
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor-react';
            }
            // 2. Separa Firebase (es muy pesado, mejor cargarlo aparte)
            if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
              return 'vendor-firebase';
            }
            // 3. Separa librerías de UI y animaciones
            if (id.includes('node_modules/lucide-react') || id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) {
              return 'vendor-ui';
            }
            // 4. Separa librerías pesadas de IA y multimedia
            if (id.includes('node_modules/@google') || id.includes('node_modules/groq-sdk') || id.includes('node_modules/ytdl-core') || id.includes('node_modules/react-player')) {
              return 'vendor-ai-media';
            }
          }
        }
      }
    }
  };
});
