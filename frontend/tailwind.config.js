/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  // darkMode: "media",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#DC2626", // Red 600 - Consistent with the header & buttons
        primaryDark: "#B91C1C", // Darker red for dark mode contrast
        primaryLight: "#EF4444", // Lighter red for hover effects
        secondary: "#F59E0B", // Amber 500
        ternary: "#14B8A6", // Teal 500
        ternaryLight: "#2DD4BF", // Teal 400
        whiteBlue: "#EFF6FF", // Blue 50
        grayColor: "#6B7280", // Gray 500
        dark: "#1F2937", // Gray 800
        darkBg: "#111827", // Dark background
        darkCard: "#1E293B", // Dark mode card
        darkText: "#E5E7EB", // Light gray text
      },

      // height: {
      //   "leaflet-container": "100%",
      // },
      // width: {
      //   "leaflet-container": "100%",
      // },
    },
  },

  /* Custom styles for Leaflet */

  plugins: [],
};
