import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F8F5EF",
        beige: {
          DEFAULT: "#E9DFD1",
          soft: "#F2EBE0",
          deep: "#DDD0BE",
        },
        gold: {
          DEFAULT: "#B99A68",
          light: "#D2B98E",
          dark: "#96794B",
        },
        espresso: {
          DEFAULT: "#40362E",
          muted: "#6B5D52",
          soft: "#8A7B6E",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["var(--font-montserrat)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        editorial: "0 20px 50px -15px rgba(64, 54, 46, 0.08)",
        envelope: "0 30px 70px -15px rgba(64, 54, 46, 0.18)",
        seal: "0 8px 22px -4px rgba(64, 54, 46, 0.28), inset 0 1px 2px rgba(255, 255, 255, 0.45)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slowZoom: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.045)" },
        },
        soundBar: {
          "0%, 100%": { transform: "scaleY(0.35)" },
          "50%": { transform: "scaleY(1)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slow-zoom": "slowZoom 18s ease-out forwards",
        "sound-bar-1": "soundBar 0.9s ease-in-out infinite",
        "sound-bar-2": "soundBar 0.7s ease-in-out 0.2s infinite",
        "sound-bar-3": "soundBar 1.1s ease-in-out 0.35s infinite",
        "float-slow": "floatSlow 4.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
