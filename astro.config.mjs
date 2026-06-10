import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://emmanuelgjr.github.io',
  base: '/AI-Controls-Catalog/',
  output: 'static',
  integrations: [
    react(),
    sitemap(),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    ssr: {
      noExternal: ['docx', 'jspdf', 'exceljs', 'uuid', 'fflate'],
    },
  },
});
