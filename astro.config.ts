import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/utils/frontmatter';

import react from '@astrojs/react';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

const mdBookPlugin = (config: { source: string; output: string; name?: string }) => ({
  name: config.name || 'mdbook-builder',
  buildStart() {
    console.log(`Building mdBook docs from ${config.source}...`);
    try {
      execSync(`mdbook build -d ${config.output} ${config.source}`, {
        stdio: 'inherit',
      });
      console.log(`mdBook build complete for ${config.source}.`);
    } catch (err) {
      console.error(`mdBook build failed for ${config.source}:`, err);
    }
  },
  handleHotUpdate({ file }) {
    if (file.includes(config.source)) {
      console.log(`Docs changed in ${config.source}, rebuilding mdBook...`);
      execSync(`mdbook build -d ${config.output} ${config.source}`, {
        stdio: 'inherit',
      });
      console.log(`mdBook rebuild complete for ${config.source}.`);
    }
  },
});

export default defineConfig({
  output: 'static',
  trailingSlash: 'ignore',

  i18n: {
    defaultLocale: 'it',
    locales: ['en', 'it'],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),
    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),
    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),
    astrowind({
      config: './src/config.yaml',
    }),
    react(),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      paraglideVitePlugin({
        project: './project.inlang',
        outdir: './src/paraglide',
      }),
      mdBookPlugin({ source: 'docs/it-renoir', output: 'dist/it/docs/renoir', name: 'mdbook-builder-it' }),
      mdBookPlugin({ source: 'docs/en-renoir', output: 'dist/en/docs/renoir', name: 'mdbook-builder-en' }),
    ],
  },
});
