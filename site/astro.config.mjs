import { defineConfig } from 'astro/config';

// built output goes to ../docs so github pages can serve main /docs, no workflow
export default defineConfig({
  site: 'https://mirageglobe.github.io',
  base: '/soluna',
  outDir: '../docs',
});
