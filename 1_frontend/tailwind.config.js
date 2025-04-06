/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // <--- wichtig für JSX
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
