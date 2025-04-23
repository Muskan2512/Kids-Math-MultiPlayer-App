/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#FACC15",
        accent: "#22C55E",
      },
      fontFamily: {
        fun: ["Comic Sans MS", "cursive", "sans-serif"],
      },
      animation: {
        spinSlow: "spin 8s linear infinite",
        bounceSlow: "bounce 3s infinite",
        'pulse-slow': 'pulse 10s infinite',
      },
    },
  },
  plugins: [],
};
