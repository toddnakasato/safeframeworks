import { defineConfig } from "vite";
import angular from "@analogjs/vite-plugin-angular";
import path from "path";

export default defineConfig({
  plugins: [angular()],
  server: { port: 1438, strictPort: true },
  build: { outDir: "dist", emptyOutDir: true },
  resolve: {
    alias: {
      "safecontracts": path.resolve(__dirname, "../../../../safecontracts/src/contracts.ts"),
    },
  },
});
