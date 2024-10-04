/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}", // Material Tailwind components
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}", // Material Tailwind theme
  ],
  theme: {
    extend: {
      fontFamily: {
        yellowtail: ["Yellowtail", "cursive"], // Define Yellowtail font
      },
    },
  },
  plugins: [], // Remove direct plugin require here
};
