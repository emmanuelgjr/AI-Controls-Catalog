import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://emmanuelgjr.github.io',
  base: '/AI-Controls-Catalog/',
  output: 'static',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    sitemap(),
    mdx(),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    ssr: {
      noExternal: ['docx', 'jspdf', 'exceljs', 'uuid'],
    },
  },
});
