import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "16px",
        md: "24px",
        xl: "32px",
      },
      screens: {
        xl: "1200px",
      },
    },
    extend: {
        colors: {
          bg: "#000000",
          surface: "#0A0A0A",
          surface2: "#1A1A1A",
          text: "#FFFFFF",
          muted: "#BFBFBF",
          gold: "#FFD700",
          gold600: "#C6A700",
          border: "#2E2E2E",
          primary: "#FFD700",
          "primary-dark": "#C6A700",
        },
        borderRadius: {
          xl: "14px",
        },
        boxShadow: {
          gold: "0 0 0 1px #FFD700 inset, 0 8px 24px rgba(255,215,0,.18)",
        },
      },
    
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },
  plugins: [],
};

export default config;