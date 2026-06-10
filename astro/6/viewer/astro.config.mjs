import { defineConfig } from "astro/config";
import path from "node:path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "chart.js": path.resolve(__dirname, "node_modules/chart.js"),
        "d3-sankey": path.resolve(__dirname, "node_modules/d3-sankey"),
        "d3": path.resolve(__dirname, "node_modules/d3"),
        "hyperformula": path.resolve(__dirname, "node_modules/hyperformula"),
        "leaflet": path.resolve(__dirname, "node_modules/leaflet"),
        "lucide": path.resolve(__dirname, "node_modules/lucide"),
      },
    },
  },
  server: { port: 1436 },
});
