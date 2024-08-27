import { getAllFontCssFiles } from "./plugins/import_fonts"


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css',
    ...getAllFontCssFiles()
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  plugins: [  ]
})
