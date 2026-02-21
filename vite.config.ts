import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // Dev server config
  server: {
    host: '0.0.0.0',
    port: 5175,
    strictPort: true,
    allowedHosts: true,
  },

  // Preview server (used by `vite preview` after build)
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5175,
    allowedHosts: true,
  },

  // Production build
  build: {
    sourcemap: false,       // No source maps in production (security)
    minify: 'esbuild',      // Fast minification
    target: 'es2020',
    rollupOptions: {
      output: {
        // Split vendor chunks for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react', 'sonner'],
        },
      },
    },
  },

  // Strip all console.* and debugger in production builds
  esbuild: mode === 'production' ? { drop: ['console', 'debugger'] } : {},
}))
