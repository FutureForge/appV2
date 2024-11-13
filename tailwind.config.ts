import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        space: ["var(--font-space)", ...fontFamily.sans],
      },
      colors: {
        // background: "var(--background)",
        // foreground: "var(--foreground)",
        primary: "#6866E8",
        background: "#030312",
        "sec-bg": "#252525",
        "sec-btn": "#5856D6",
        "muted-foreground": "#60606A",
        foreground: "#F5F5F5",
        special: "#5856D6",
        "special-bg": "#1B1F26B8",
        "dialog-border": "#2C2C2C",
        card: "#101019",
        border: "#292A3E",
        muted: "#6b6b6b",
        tertiary: "#181825",
        error: "#E94B4F",
        "table-hover": "#1C1C25",
        "new-muted": {
          bg: "#1C1C2A",
          text: "#A7A6F21A",
        },
      },
      keyframes: {
        overlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        overlayHide: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        dialogShow: {
          from: { opacity: "0", transform: "translateY(8px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        dialogHide: {
          from: { opacity: "1", transform: "translateY(0) scale(1)" },
          to: { opacity: "1", transform: "translateY(8px) scale(0.97)" },
        },
        "slide-from-top": {
          from: { transform: "translateY(4px) scale(0.97)", opacity: "0" },
          to: { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        "slide-from-bottom": {
          from: { transform: "translateY(-4px) scale(0.97)", opacity: "0" },
          to: { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        "slide-from-left": {
          from: { transform: "translateX(4px) scale(0.97)", opacity: "0" },
          to: { transform: "translateX(0) scale(1)", opacity: "1" },
        },
        "slide-from-right": {
          from: { transform: "translateX(-4px) scale(0.97)", opacity: "0" },
          to: { transform: "translateX(0) scale(1)", opacity: "1" },
        },
        "slide-to-right": {
          from: { transform: "translateX(0) scale(1)", opacity: "1" },
          to: { transform: "translateX(-4px) scale(0.97)", opacity: "0" },
        },
        "slide-to-top": {
          from: { transform: "translateY(0) scale(1)", opacity: "1" },
          to: { transform: "translateY(4px) scale(0.97)", opacity: "0" },
        },
        "slide-to-bottom": {
          from: { transform: "translateY(0) scale(1)", opacity: "1" },
          to: { transform: "translateY(-4px) scale(0.97)", opacity: "0" },
        },
        "slide-to-left": {
          from: { transform: "translateX(0) scale(1)", opacity: "1" },
          to: { transform: "translateX(4px) scale(0.97)", opacity: "0" },
        },
        "drawer-slide-to-right": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "drawer-slide-to-left": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
      },
      animation: {
        overlayShow: "overlayShow 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        overlayHide: "overlayHide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        dialogShow: "dialogShow 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        dialogHide: "dialogHide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-from-top": "slide-from-top 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-from-bottom":
          "slide-from-bottom 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-from-left":
          "slide-from-left 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-from-right":
          "slide-from-right 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-to-top": "slide-to-top 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-to-bottom":
          "slide-to-bottom 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-to-left": "slide-to-left 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-to-right": "slide-to-right 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "drawer-slide-to-right": "drawer-slide-to-right 600ms",
        "drawer-slide-to-left": "drawer-slide-to-left 600ms",
      },
    },
  },
  plugins: [],
};
export default config;
