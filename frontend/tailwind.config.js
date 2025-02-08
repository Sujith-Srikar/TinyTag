/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "pulse-slow": "pulse 3s infinite",
      },
      colors: {
        dark: "#1a202c",
        darker: "#0f172a",
        btnPrimary: "#3b82f6",
        btnSecondary: "#e11d48",
      },
    },
  },
  plugins: [require("tailwindcss-text-stroke")],
};