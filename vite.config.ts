import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves a project site from /<repo>/, not from the domain root.
  base: "/currency-converter/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/favicon.svg"],
      manifest: {
        name: "Currency Converter",
        short_name: "Currency",
        description: "Fast offline-first currency converter",
        theme_color: "#2563eb",
        background_color: "#f4f5f7",
        display: "standalone",
        icons: [
          {
            src: "icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icons/maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        runtimeCaching: [
          {
            // Live exchange rates: try the network first, fall back to the
            // last cached response when offline.
            urlPattern: ({ url }: { url: URL }) =>
              url.origin === "https://open.er-api.com",
            handler: "NetworkFirst",
            options: {
              cacheName: "rates-api-cache",
              networkTimeoutSeconds: 4,
              expiration: {
                maxEntries: 8,
                maxAgeSeconds: 60 * 60 * 6,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        // Lets the service worker be exercised with `npm run dev` too.
        enabled: true,
        type: "module",
      },
    }),
  ],
});
