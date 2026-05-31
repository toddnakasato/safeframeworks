import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "app",
  server: {
    port: 3001,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  build: {
    outDir: "../dist",
  },
  resolve: {
    alias: {
      "safecomponents": path.resolve(__dirname, "../../../safecomponents/src"),
    },
  },
});
