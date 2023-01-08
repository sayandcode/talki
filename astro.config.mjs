import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import CSPConfigStr from "./configHelpers/csp";

export default defineConfig({
  integrations: [tailwind()],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Content-Security-Policy": CSPConfigStr,
      "Permissions-Policy":
        "picture-in-picture=(), geolocation=(), camera=(), microphone=()",
      "X-Frame-Options": "DENY",
    },
  },
});
