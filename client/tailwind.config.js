/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F97316', // Orange 500 (Saffron)
        primaryDark: '#C2410C', // Orange 700
        secondary: '#F59E0B', // Amber 500
        accent: '#4B5563', // Gray 600
        spiritual: '#FFF7ED', // Orange 50
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Minimalistic font
      }
    },
  },
  plugins: [],
}
