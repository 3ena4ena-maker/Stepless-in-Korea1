import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {prerenderStaticRoutesPlugin} from './scripts/prerenderPlugin';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  const googleMapsApiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDEKgT4EZLHN5agdtkadl7q8NHaeO_g4DE';

  return {
    base: '/',
    plugins: [react(), tailwindcss(), prerenderStaticRoutesPlugin()],
    define: {
      'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(googleMapsApiKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              return 'vendor-libs';
            }
            if (id.includes('/src/data/itineraries') || id.includes('/src/data/koreaTourApiPlaceDetails')) {
              return 'data-itineraries';
            }
          },
        },
      },
    },
  };
});
