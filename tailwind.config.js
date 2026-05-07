/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#EDFAF5',
          100: '#C6F0E0',
          200: '#8FDFC4',
          500: '#0F9B71',
          600: '#0D8A64',
          700: '#0A7254',
        },
        amber: {
          50:  '#FEF9EE',
          100: '#FDECC8',
          400: '#F4A72A',
          500: '#E8960F',
          600: '#C97D0A',
        },
        surface: {
          light: '#FAFAF8',
          dark:  '#0E1014',
        },
        card: {
          light: '#FFFFFF',
          dark:  '#171B20',
        },
        border: {
          light: '#E8E6E1',
          dark:  '#272C33',
        },
      },
    },
  },
  plugins: [],
}
