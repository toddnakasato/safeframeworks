import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { viewerStyles } from "../../../viewer-styles-plugin";

export default defineConfig({
  plugins: [react(), viewerStyles()],
  server: {
    port: 1431,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "chart.js": path.resolve(__dirname, "node_modules/chart.js"),
      "d3-sankey": path.resolve(__dirname, "node_modules/d3-sankey"),
      "d3": path.resolve(__dirname, "node_modules/d3"),
      "hyperformula": path.resolve(__dirname, "node_modules/hyperformula"),
      "leaflet": path.resolve(__dirname, "node_modules/leaflet"),
      "lucide": path.resolve(__dirname, "node_modules/lucide"),
      "safecontracts/components": path.resolve(__dirname, "../../../../safecontracts/src/components"),
      "safecontracts": path.resolve(__dirname, "../core.ts"),
    },
  },
});
