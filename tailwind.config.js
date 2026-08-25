/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        popover: {
          DEFAULT: "var(--color-popover)",
          foreground: "var(--color-popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
          light: "var(--color-primary-light)",
          dark: "var(--color-primary-dark)",
          subtle: "var(--color-primary-subtle)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "var(--color-destructive-foreground)",
          light: "var(--color-destructive-light)",
          dark: "var(--color-destructive-dark)",
          subtle: "var(--color-destructive-subtle)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          foreground: "var(--color-success-foreground)",
          light: "var(--color-success-light)",
          dark: "var(--color-success-dark)",
          subtle: "var(--color-success-subtle)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          foreground: "var(--color-warning-foreground)",
          light: "var(--color-warning-light)",
          dark: "var(--color-warning-dark)",
          subtle: "var(--color-warning-subtle)",
        },
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
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
