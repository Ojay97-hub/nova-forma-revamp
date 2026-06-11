import type { Config } from "tailwindcss";

/**
 * Nova Forma Designs brand tokens.
 *
 * Palette: crisp white surfaces, deep navy contrast, and bright teal accents.
 * Some legacy colour names remain as aliases so existing utility classes keep
 * working while the visual scheme follows the new logo.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7FCFC",
        ivory: "#FFFFFF",
        ink: {
          DEFAULT: "#0F2233",
          soft: "#315066",
          faint: "#6E8999",
        },
        navy: {
          DEFAULT: "#0F2233",
          soft: "#315066",
          mist: "#E7F1F3",
        },
        teal: {
          DEFAULT: "#3FD2C6",
          soft: "#CFF7F3",
          deep: "#138E8D",
        },
        pink: {
          DEFAULT: "#3FD2C6",
          soft: "#CFF7F3",
          deep: "#138E8D",
        },
        coral: "#16B8C3",
        peach: "#A9ECE7",
        lilac: {
          DEFAULT: "#5A8DA6",
          soft: "#DCEFF2",
        },
        butter: "#E9FBF9",
        mint: "#3FD2C6",
      },
      fontFamily: {
        display: ["ui-serif", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
      borderRadius: {
        blob: "42% 58% 63% 37% / 41% 44% 56% 59%",
      },
      boxShadow: {
        pop: "0 4px 0 0 #0F2233",
        "pop-lg": "0 8px 0 0 #0F2233",
        "pop-pink": "0 4px 0 0 #138E8D",
        soft: "0 22px 50px -20px rgba(15,34,51,0.32)",
        "soft-sm": "0 10px 30px -16px rgba(15,34,51,0.28)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "bob-tilt": {
          "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-10px) rotate(2deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 0.4s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "spin-slow": "spin-slow 14s linear infinite",
        "bob-tilt": "bob-tilt 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
