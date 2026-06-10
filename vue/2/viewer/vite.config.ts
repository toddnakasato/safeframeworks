import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  server: { port: 1435, strictPort: true },
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
