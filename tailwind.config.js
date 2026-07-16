/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        camp: {
          orange: '#FF6B35',
          purple: '#6B2D5C',
          yellow: '#FFC93C',
        },
      },
    },
  },
  plugins: [],
};
