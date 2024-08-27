/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        "neue-montreal": ['NeueMontreal', 'sans-serif'],
        "juliett": ['Juliett', 'sans-serif'],
        // "neue-montreal": ['NeueMontreal', 'sans-serif'],
        // "neue-montreal": ['NeueMontreal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}