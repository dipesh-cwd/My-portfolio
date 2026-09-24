import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import siteMeta from "./vite-plugin-site-meta.js";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Public URL for social-preview tags. Set VITE_SITE_URL yourself, or on Vercel it is picked
  // up automatically from the project's production domain.
  const siteUrl =
    env.VITE_SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : "");

  return {
    plugins: [react(), tailwindcss(), siteMeta(siteUrl)],
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.js"],
      css: false,
    },
  };
});
