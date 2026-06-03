/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          dark: '#1e1e2d',
          light: '#f5f5f9',
          primary: '#696cff',
          muted: '#a1acb8'
        }
      }
    },
  },
  plugins: [],
}
