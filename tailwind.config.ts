import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light mode – warm parchment palette
        parchment: {
          50:  "#faf8f4",
          100: "#f4f0e8",
          200: "#ece6d8",
          300: "#e2dcd0",
          400: "#d0c9bb",
          500: "#b8b0a0",
        },
        navy: {
          50:  "#eef1f8",
          100: "#d5ddf0",
          200: "#9aaad8",
          300: "#6b8fd4",
          400: "#3d6ab8",
          500: "#2d4a8a",
          600: "#1e3370",
          700: "#1a2744",
          800: "#141d34",
          900: "#0e1422",
        },
        // Semantic tokens (used throughout)
        surface: {
          DEFAULT: "var(--surface)",
          raised: "var(--surface-raised)",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans:    ["Inter", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "display-2xl": ["4.5rem",  { lineHeight: "1.1",  letterSpacing: "-0.02em" }],
        "display-xl":  ["3.75rem", { lineHeight: "1.1",  letterSpacing: "-0.02em" }],
        "display-lg":  ["3rem",    { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-md":  ["2.25rem", { lineHeight: "1.2",  letterSpacing: "-0.01em" }],
        "display-sm":  ["1.875rem",{ lineHeight: "1.25" }],
      },
      spacing: {
        "18":  "4.5rem",
        "22":  "5.5rem",
        "88":  "22rem",
        "128": "32rem",
      },
      maxWidth: {
        "8xl": "90rem",
      },
      animation: {
        "fade-up":      "fadeUp 0.5s ease-out forwards",
        "fade-in":      "fadeIn 0.4s ease-out forwards",
        "slide-in":     "slideIn 0.4s ease-out forwards",
        "counter":      "counter 2s ease-out forwards",
        "shimmer":      "shimmer 2s infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%":   { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body":       "var(--text-primary)",
            "--tw-prose-headings":   "var(--text-primary)",
            "--tw-prose-code":       "var(--accent)",
            "--tw-prose-pre-bg":     "var(--surface-raised)",
            maxWidth: "none",
          },
        },
      },
      boxShadow: {
        "card":       "0 1px 3px 0 rgba(26,39,68,0.08), 0 1px 2px -1px rgba(26,39,68,0.06)",
        "card-hover": "0 8px 24px -4px rgba(26,39,68,0.12), 0 2px 8px -2px rgba(26,39,68,0.06)",
        "nav":        "0 1px 0 0 var(--border)",
      },
    },
  },
  plugins: [],
};

export default config;
