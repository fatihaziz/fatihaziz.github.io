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
  media: false,
  theme: {
    extend: {
      fontFamily: {
        "neue-montreal": ['NeueMontreal', 'sans-serif'],
        "juliett": ['Juliett', 'sans-serif'],
        "mangiola": ['Mangiola', 'sans-serif'],
        "mondapick": ['Mondapick', 'sans-serif'],
        "dm-sans": ['DMSans', 'sans-serif'],
        "inter": ['Inter', 'sans-serif'],
        "lexend": ['Lexend', 'sans-serif'],
        "manrope": ['Manrope', 'sans-serif'],
        "satoshi": ['Satoshi', 'sans-serif'],
        "space-grotesk": ['SpaceGrotesk', 'sans-serif'],
        "supreme": ['Supreme', 'sans-serif'],
        "switzer": ['Switzer', 'sans-serif'],
      },
    },
  },
  plugins: [],
}