import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the built app works under GitHub Pages subpaths, e.g.
// https://cbaird26.github.io/toe-2026-updates/fold-space-engine/
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/discovery"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.js", "src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
