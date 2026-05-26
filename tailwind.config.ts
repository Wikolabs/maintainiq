import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Kanit'", "sans-serif"],
        body: ["'Comfortaa'", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
