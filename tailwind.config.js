/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          500: '#1f9fb8',
          600: '#1585a0',
          700: '#0f6b84',
        },
        slate: {
          25: '#f8fafc',
        },
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(15, 118, 110, 0.15)',
      },
    },
  },
  plugins: [],
}
