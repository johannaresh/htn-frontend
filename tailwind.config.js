/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Black and white theme with subtle accents
        gray: {
          950: '#0a0a0a',
        },
      },
    },
  },
  plugins: [],
}
