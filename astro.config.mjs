import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import basicSsl from "@vitejs/plugin-basic-ssl";
import CSPConfigStr from "./configHelpers/csp";

export default defineConfig({
  integrations: [tailwind()],
  vite: {
    plugins: [basicSsl()],
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Content-Security-Policy": CSPConfigStr,
      "Permissions-Policy":
        "picture-in-picture=(), geolocation=(), camera=(self), microphone=()",
      "X-Frame-Options": "DENY",
    },
  },
  site: "https://sayandcode.github.io",
  base: "/talki",
});
