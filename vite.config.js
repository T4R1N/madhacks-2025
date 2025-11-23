import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: "src/background.js"
      },
      output: {
        entryFileNames: "[name].js"
      }
    }
  }
});