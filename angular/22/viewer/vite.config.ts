import { defineConfig } from "vite";
import angular from "@analogjs/vite-plugin-angular";

export default defineConfig({
  plugins: [angular()],
  server: { port: 1438, strictPort: true },
  build: { outDir: "dist", emptyOutDir: true },
});
