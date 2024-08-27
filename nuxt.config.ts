import { getAllFontCssFiles } from "./build/import_fonts";

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
});
