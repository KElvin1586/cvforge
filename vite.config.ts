import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      'work-1-ceublgxrbbzgaldp.prod-runtime.all-hands.dev',
      'work-2-ceublgxrbbzgaldp.prod-runtime.all-hands.dev',
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
