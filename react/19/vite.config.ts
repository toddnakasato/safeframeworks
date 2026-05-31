import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "app",
  server: { port: 3001 },
  build: {
    outDir: "../dist",
    emptyDir: true,
  },
  resolve: {
    alias: {
      "safecomponents": path.resolve(__dirname, "../../../safecomponents/src"),
    },
  },
});
