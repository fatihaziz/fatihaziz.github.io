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
  runtimeConfig: {
    // Legacy write lock (superseded by lunar auth, kept for non-lunar guards).
    writeSecret: process.env.NUXT_WRITE_SECRET || '',
    // Lunar tracker accounts: access key doubles as X-Api-Key token.
    // Empty = that account is disabled (fail closed).
    lunarDevKey: process.env.NUXT_LUNAR_DEV_KEY || '',
    lunarProductKey: process.env.NUXT_LUNAR_PRODUCT_KEY || '',
    // Lunar tracker notifications + GitHub sync (all optional; empty = off).
    telegramBotToken: process.env.NUXT_TELEGRAM_BOT_TOKEN || '',
    telegramChatId: process.env.NUXT_TELEGRAM_CHAT_ID || '',
    githubToken: process.env.NUXT_GITHUB_TOKEN || '',
    public: {
      // Absolute origin of the Lunar tracker API for static (gh-pages) builds,
      // e.g. https://fatihaziz-web.fly.dev - empty = same origin (Fly / dev).
      lunarApiBase: process.env.NUXT_PUBLIC_LUNAR_API_BASE || '',
    },
  },
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
      title: 'Muhammad Fatih Al-Aziz - Fintech Platform Engineer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Fintech platform engineer with 8+ years in software and 6+ years building live retail-brokerage systems: CRM, back office, payments, KYC, PAMM, commissions, and MetaTrader integrations in Rust, Go, and TypeScript.' },
        { name: 'author', content: 'Muhammad Fatih Al-Aziz' },
        { name: 'theme-color', content: '#0b0406' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'fatihaziz.com' },
        { property: 'og:title', content: 'Muhammad Fatih Al-Aziz - Fintech Platform Engineer' },
        { property: 'og:description', content: 'Brokerage CRM, back office, and trading infrastructure. Rust, Go, TypeScript. Yogyakarta, GMT+7, remote-first.' },
        { property: 'og:url', content: 'https://fatihaziz.com' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Muhammad Fatih Al-Aziz - Fintech Platform Engineer' },
        { name: 'twitter:description', content: 'Brokerage CRM, back office, and trading infrastructure. Rust, Go, TypeScript.' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }, // Default favicon
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '144x144', href: '/android-chrome-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/android-chrome-512x512.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        // Aetherveil fonts -- Frieren/Himmel vibe (Roman caps + elegant serif)
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap',
        },
      ]
    }
  }
});
