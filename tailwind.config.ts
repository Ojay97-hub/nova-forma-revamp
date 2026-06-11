import type { Config } from "tailwindcss";

const colorVar = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

/**
 * Nova Forma Designs brand tokens.
 *
 * Palette: crisp white surfaces, deep navy contrast, and bright teal accents.
 * Some legacy colour names remain as aliases so existing utility classes keep
 * working while the visual scheme follows the new logo.
 */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: colorVar("--color-cream"),
        ivory: colorVar("--color-ivory"),
        paper: "#F7FCFC",
        ink: {
          DEFAULT: colorVar("--color-ink"),
          soft: colorVar("--color-ink-soft"),
          faint: colorVar("--color-ink-faint"),
        },
        navy: {
          DEFAULT: "#0F2233",
          soft: "#315066",
          mist: colorVar("--color-navy-mist"),
        },
        teal: {
          DEFAULT: "#3FD2C6",
          soft: colorVar("--color-teal-soft"),
          deep: colorVar("--color-teal-deep"),
        },
        pink: {
          DEFAULT: "#3FD2C6",
          soft: colorVar("--color-teal-soft"),
          deep: colorVar("--color-teal-deep"),
        },
        coral: "#16B8C3",
        peach: colorVar("--color-peach"),
        lilac: {
          DEFAULT: colorVar("--color-lilac"),
          soft: colorVar("--color-lilac-soft"),
        },
        butter: colorVar("--color-butter"),
        mint: "#3FD2C6",
      },
      fontFamily: {
        display: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
      borderRadius: {
        blob: "42% 58% 63% 37% / 41% 44% 56% 59%",
      },
      boxShadow: {
        pop: "0 4px 0 0 rgb(var(--color-shadow) / 1)",
        "pop-lg": "0 8px 0 0 rgb(var(--color-shadow) / 1)",
        "pop-pink": "0 4px 0 0 rgb(var(--color-teal-deep) / 1)",
        soft: "0 22px 50px -20px rgb(var(--color-shadow) / 0.32)",
        "soft-sm": "0 10px 30px -16px rgb(var(--color-shadow) / 0.28)",
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
