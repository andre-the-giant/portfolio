import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../build',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '',
      },
    },
  },
  plugins: [
    createHtmlPlugin({
      inject: {
        data: {
          title: 'My Portfolio', // Dynamically set a title, optional
        },
      },
      minify: true,
    }),
    {
      name: 'inline-css',
      enforce: 'post',
      generateBundle(_, bundle) {
        const htmlFile = Object.keys(bundle).find((file) => file.endsWith('.html'));
        const cssFile = Object.keys(bundle).find((file) => file.endsWith('.css'));

        if (htmlFile && cssFile) {
          const html = bundle[htmlFile];
          const css = bundle[cssFile].source;

          // Inject CSS directly into the <head> of the HTML file
          html.source = html.source.replace(
            '</head>',
            `<style>${css}</style></head>`
          );

          // Remove the CSS file from the build output
          delete bundle[cssFile];
        }
      },
    },
    viteStaticCopy({
      targets: [
        {
          src: resolve(__dirname, 'public/fonts/**/*'), // Path to match all font files
          dest: 'fonts', // Copy into the `build/fonts/` directory
        },
        {
          src: resolve(__dirname, 'public/img/**/*'), // Path to match all image files
          dest: 'img', // Copy into the `build/images/` directory
        },
      ],
    }),
  ],
});
