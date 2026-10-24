import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cobra: {
          black: "#050505",
          charcoal: "#111315",
          graphite: "#1d2024",
          fog: "#e9ece9",
          acid: "#8dff2a",
          venom: "#44ff66"
        }
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "Arial", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 32px rgba(141,255,42,.32)"
      },
      animation: {
        marquee: "marquee 30s linear infinite"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        }
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};

export default config;
