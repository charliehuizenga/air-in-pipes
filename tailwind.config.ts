import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      backgroundColor: {
        "dark-blue": "#6FB3B8",
        teal: "#C4E5CD",
        beige: "#F6F6F2",
        "darkest-blue": "#388087",
      },
      textColor: {
        "dark-blue": "#6FB3B8",
        teal: "#C4E5CD",
        beige: "#F6F6F2",
        "darkest-blue": "#388087",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
