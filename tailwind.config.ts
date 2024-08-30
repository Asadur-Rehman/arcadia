import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "ibm-plex-sans": ["IBM Plex Sans", "sans-serif"],
        "bebas-neue": ["var(--bebas-neue)"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        // Arcadia primary — indigo
        primary: {
          DEFAULT: "#6366F1",
          admin: "#6366F1",
        },
        green: {
          DEFAULT: "#16A34A",
          100: "#DCFCE7",
          400: "#4ADE80",
          500: "#22C55E",
          800: "#16A34A",
        },
        red: {
          DEFAULT: "#DC2626",
          400: "#F87171",
          500: "#EF4444",
          800: "#DC2626",
        },
        blue: {
          100: "#6366F1",
        },
        // Dark surfaces (backgrounds, cards, borders)
        dark: {
          100: "#07080E",   // root bg — near-black
          200: "#0D0F1A",   // card bg
          300: "#131526",   // elevated card / input
          400: "#1A1C30",   // border
          500: "#0A0B14",   // deepest bg
          600: "#252842",   // hover state
          700: "#9599B8",   // muted text alias
          800: "#12141F",   // secondary bg
        },
        // Light tokens — text / subtle accents on dark backgrounds
        light: {
          100: "#9599B8",   // muted text
          200: "#C5C8DF",   // secondary text
          300: "#EDEEF8",   // near-white text
          400: "#1A1C30",   // subtle border
          500: "#555879",   // disabled / tertiary text
          600: "#0D0F1A",   // dark input bg
          700: "#9599B8",   // same as muted
          800: "#EDEEF8",   // primary text
        },
        gray: {
          100: "#1E2035",   // dark border (was light gray)
        },
      },
      screens: {
        xs: "480px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        pattern: "url('/images/pattern.webp')",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
