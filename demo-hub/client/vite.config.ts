import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8090,
    proxy: {
      "/api": { target: "http://127.0.0.1:4001", changeOrigin: true },
      "/uploads": { target: "http://127.0.0.1:4001", changeOrigin: true },
    },
  },
});
