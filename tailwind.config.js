/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#31473A',
          light: '#4A6B50'
        },
        mint: {
          DEFAULT: '#E6F2EA',
          dark: '#C8E6D0'
        },
      },
    },
  },
  plugins: [],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // se usi app directory
    './src/**/*.{js,ts,jsx,tsx}', // se i file sono in src
  ]
}
