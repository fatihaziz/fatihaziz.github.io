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
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        "neue-montreal": ['NeueMontreal', 'sans-serif'],
        "juliett": ['Juliett', 'sans-serif'],
        "mangiola": ['Mangiola', 'sans-serif'],
        "mondapick": ['Mondapick', 'sans-serif'],
      },
    },
  },
  plugins: [],
}