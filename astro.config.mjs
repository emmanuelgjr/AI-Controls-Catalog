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
  // Astro 7 defaults this to 'jsx', which strips whitespace between elements.
  // Pinned to the pre-v7 behavior so rendered output is unchanged.
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    ssr: {
      noExternal: ['docx', 'jspdf', 'exceljs', 'uuid', 'fflate'],
    },
  },
});
