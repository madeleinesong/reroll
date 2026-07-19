import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm-gray paper background + near-black ink. Restrained green accent.
        paper: {
          DEFAULT: "#f7f6f2",
          panel: "#fbfaf7",
          line: "#e7e4dc",
          sink: "#efece5",
        },
        ink: {
          DEFAULT: "#1a1917",
          soft: "#4b4842",
          faint: "#8a857b",
        },
        accent: {
          DEFAULT: "#2f6b4f", // restrained forest green
          soft: "#e4ede7",
          line: "#3f7a5e",
          deep: "#234f3b",
        },
      },
      fontFamily: {
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        micro: ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.04em" }],
      },
      borderRadius: {
        sharp: "2px",
      },
      boxShadow: {
        panel: "0 1px 2px rgba(26,25,23,0.04), 0 8px 24px rgba(26,25,23,0.06)",
        node: "0 1px 2px rgba(26,25,23,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
