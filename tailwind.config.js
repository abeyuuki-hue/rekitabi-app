/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        shrine: {
          darkred: '#8B0000',
          gold: '#D4AF37',
          bg: '#FDFBF7',
          card: '#FFFFFF',
        },
      },
      fontFamily: {
        serif: ['"Hiragino Mincho ProN"', '"Yu Mincho"', 'serif'],
      },
    },
  },
  plugins: [],
};