import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { Plugin } from 'vite';

function generateIcons(): Plugin {
  return {
    name: 'generate-icons',
    async writeBundle(options) {
      const outDir = options.dir ?? 'build';
      const svg = readFileSync('static/favicon.svg');
      for (const size of [192, 512]) {
        const png = await sharp(svg).resize(size, size).png().toBuffer();
        writeFileSync(join(outDir, `icon-${size}.png`), png);
      }
    },
  };
}

export default defineConfig({
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      manifest: {
        name: 'Exam Timer',
        short_name: 'Exam Timer',
        theme_color: '#f6f2eb',
        background_color: '#f6f2eb',
        icons: [
          {
            src: 'favicon.svg',
            type: 'image/svg+xml',
            sizes: 'any',
          },
          {
            src: 'icon-192.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: 'icon-512.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],
      },
      workbox: {
        globPatterns: ['client/**/*.{js,css,html,svg,png,woff,woff2}'],
      },
    }),
    generateIcons(),
  ],
});
