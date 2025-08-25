/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all JS, JSX, TS, and TSX files in the src folder
  ],
  theme: {
    extend: {
      colors: {
        customText: "#213070", // Your custom text color
      },
      backgroundColor: {
        "bluish-white-100": "#f0f8ff",
        "bluish-white-200": "#ebf5ff",
        "bluish-white-300": "#e3effe",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
}
