import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      _editor: fileURLToPath(new URL('./src/components', import.meta.url)),
      _utils: fileURLToPath(new URL('./src/utils', import.meta.url)),
      _composables: fileURLToPath(new URL('./src/composables', import.meta.url)),
    },
  },
});
