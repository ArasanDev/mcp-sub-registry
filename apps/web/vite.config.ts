import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: __dirname,
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true
  },
  resolve: {
    alias: {
      "@shared": resolve(__dirname, "../../packages/shared/src")
    }
  }
});
