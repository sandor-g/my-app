/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#232323',
        secondary: '#71717A',
      },
      width: {
        'sidebar': '420px',
        'sidebar-min': '360px',
      }
    },
  },
  plugins: [],
}
