/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'light-bg': '#E8E8E8',
        'dark-bg': '#0A0A0A',
        accent: '#00D9FF',
        'text-muted': '#6B6B6B',
        'card-bg': '#1A1A1A',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
