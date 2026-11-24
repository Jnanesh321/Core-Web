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
        canvas: "#0B0F17",
        surface: "#111827",
        "surface-1": "#111827",
        elevated: "#1E293B",
        border: "#1F2937",
        "border-strong": "#374151",
        line: "#1F2937",

        brand: {
          cyan: "#06B6D4",
          blue: "#3B82F6",
          violet: "#8B5CF6",
        },

        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",

        text: {
          high: "#F9FAFB",
          body: "#D1D5DB",
          muted: "#9CA3AF",
          disabled: "#4B5563",
        },
      },

      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 1.8s infinite",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
