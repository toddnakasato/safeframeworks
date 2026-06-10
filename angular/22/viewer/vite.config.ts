import { defineConfig } from "vite";
import angular from "@analogjs/vite-plugin-angular";
import path from "path";

export default defineConfig({
  plugins: [angular()],
  server: { port: 1438, strictPort: true },
  build: { outDir: "dist", emptyOutDir: true },
  resolve: {
    alias: {
      "chart.js": path.resolve(__dirname, "node_modules/chart.js"),
      "d3-sankey": path.resolve(__dirname, "node_modules/d3-sankey"),
      "d3": path.resolve(__dirname, "node_modules/d3"),
      "hyperformula": path.resolve(__dirname, "node_modules/hyperformula"),
      "leaflet": path.resolve(__dirname, "node_modules/leaflet"),
      "lucide": path.resolve(__dirname, "node_modules/lucide"),
      "safecontracts": path.resolve(__dirname, "../../../../safecontracts/src/contracts.ts"),
    },
  },
});
