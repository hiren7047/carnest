import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
const apiProxy = {
  "/api": {
    target: "http://localhost:4000",
    changeOrigin: true,
  },
  /** Same host as the app so `/uploads/...` works on phone/LAN (not only localhost:4000). */
  "/uploads": {
    target: "http://localhost:4000",
    changeOrigin: true,
  },
};

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: apiProxy,
  },
  /** Same proxy as dev so `vite preview` + local API still works without VITE_API_URL */
  preview: {
    port: 8080,
    proxy: apiProxy,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
