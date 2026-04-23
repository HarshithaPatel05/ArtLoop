/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        artloop: {
          maroon: "#800000",
          brown: "#3e2723",
          clay: "#a1887f",
          earth: "#fdf6e3",
          saffron: "#ff9933",
        }
      }
    },
  },
  plugins: [],
}
