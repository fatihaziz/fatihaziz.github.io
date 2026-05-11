import { getAllFontCssFiles } from "./build/import_fonts.ts";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: [
    "~/assets/css/main.css", // Ensure this path is correct and the file exists
    ...getAllFontCssFiles(), // Ensure this function returns correct paths
  ],
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/color-mode"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  ssr: false,
  plugins: [],
  components: true,
  experimental: {
    appManifest: false,
  },
  // Workaround for nuxt#30461 / nuxt#33606: Vite optimizer pre-transforms the
  // dead-code `import("#app-manifest")` in node_modules/nuxt/dist/app/composables/manifest.js
  // and fails to resolve it. Mirror the official Nuxt fix from PR nuxt/nuxt#30587:
  // alias to an empty stub so Vite resolves the import even though it's never executed.
  vite: {
    resolve: {
      alias: {
        '#app-manifest': 'unenv/dist/runtime/mock/empty.mjs',
      },
    },
    optimizeDeps: {
      // Don't pre-bundle the manifest module -- it has the dead import that breaks resolution.
      exclude: ['nuxt/dist/app/composables/manifest.js'],
    },
  },
  app:{
    head: {
      title: 'FatihAziz.com - Backend & Server Nerd',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Website About Fatih Aziz' },
        // Add other meta tags here
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }, // Default favicon
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '144x144', href: '/android-chrome-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/android-chrome-512x512.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  }
});
