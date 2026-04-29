/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#b3c5ff',
          400: '#859dff',
          500: '#5c73ff',
          600: '#4351ff',
          700: '#363edb',
          800: '#2d33b3',
          900: '#282d8f',
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'slideIn': 'slideIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}
