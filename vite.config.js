import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname, "frontend"),
  cacheDir: path.resolve(__dirname, ".vite-cache"), // ✅ CRITICAL FIX
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, "frontend/dist"),
    emptyOutDir: true
  }
});
