import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  server: { port: 1432, strictPort: true },
  build: { outDir: "dist", emptyOutDir: true },
});
