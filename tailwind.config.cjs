/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "talki-green": {
          100: "#f1faeb",
          200: "#d4f0c2",
          300: "#b7e599",
          400: "#ABE188",
          500: "#7ed148",
          600: "#64b72e",
          700: "#4e8f24",
          800: "#38661a",
          900: "#213d0f",
        },
        "talki-black": "#252627",
      },
    },
  },
  plugins: [],
};
