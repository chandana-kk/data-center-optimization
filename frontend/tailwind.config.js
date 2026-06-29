/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#05070f",
        panel: "rgba(13, 19, 38, 0.76)",
        border: "rgba(143, 173, 255, 0.17)",
        primary: "#3b82f6",
        secondary: "#8b5cf6",
        accent: "#22d3ee"
      },
      boxShadow: {
        glow: "0 0 36px rgba(34, 211, 238, 0.18)"
      }
    }
  },
  plugins: []
};
