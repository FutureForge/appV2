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
      },
    },
  },
  plugins: [],
};
export default config;
