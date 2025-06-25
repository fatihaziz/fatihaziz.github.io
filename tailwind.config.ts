import type { Config } from 'tailwindcss'

const config: Config = {
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
      colors: {
        sienna: '#A0522D',
        beige: '#F5F5DC',
        'rpg-text': '#5D4037', // Dark brown for main text (as used in modal)
      },
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
        "supreme": ['Supreme-Variable', 'Supreme-Regular', 'sans-serif'], // Corrected mapping
        "switzer": ['Switzer', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
