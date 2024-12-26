const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Control dark pseudo-selector by ancestor's "dark" class
  darkMode: "class",
  // Scan these files for Tailwind classes
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      // Necessary color utilities
      transparent: colors.transparent,
      current: colors.current,
      // Primary accent color
      primary: { 400: "#AE849A", 500: "#8f5e77", 600: "#6F495C" },
      // Grayscale
      gray: colors.zinc,
      ash: {
        400: "#9DC0BC",
        500: "#86A59F",
        600: "#6E8A81",
        700: "#576F64",
        800: "#8FA09E",
      },
      // Gradient colors
      neon: {
        blue: colors.blue[500],
        pink: colors.pink[500],
        purple: colors.purple[500],
        teal: colors.teal[400],
        green: colors.green[500],
        sky: colors.sky[500],
        amber: colors.amber[500],
        red: colors.red[500],
      },
      ...colors,
    },
    extend: {
      fontFamily: {
        sans: ["Avenir Next", "Helvetica Neue", "sans-serif"],
      },
      // backgroundImage: {'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))' },
    },
  },
  plugins: [],
};
