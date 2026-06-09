import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 1430,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "safecontracts/components": path.resolve(__dirname, "../../../../safecontracts/src/components"),
      "safecontracts": path.resolve(__dirname, "../core.ts"),
    },
  },
});
