/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        neocentra: {
          navy: {
            DEFAULT: "#0A2540",
            light: "#1A365D",
            dark: "#061527",
          },
          blue: {
            DEFAULT: "#0066FF",
            light: "#3B82F6",
            dark: "#0052CC",
            subtle: "#EBF3FF",
          },
          emerald: {
            DEFAULT: "#10B981",
            light: "#34D399",
            dark: "#059669",
            subtle: "#ECFDF5",
          },
          gold: {
            DEFAULT: "#F59E0B",
            light: "#FBBF24",
            dark: "#D97706",
          },
          danger: {
            DEFAULT: "#EF4444",
            light: "#F87171",
            dark: "#DC2626",
            subtle: "#FEF2F2",
          },
          bg: {
            light: "#F8FAFC",
            dark: "#0B0F19",
            card: "#FFFFFF",
            cardDark: "#131B2E",
          },
          border: {
            light: "#E2E8F0",
            dark: "#1E293B",
          },
        },
      },
      fontFamily: {
        sans: ["System", "sans-serif"],
      },
    },
  },
  plugins: [],
};
