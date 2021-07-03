import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  alias: {
    "@": __dirname,
  },
  server: {
    port: 4000,
    strictPort: true,
  },
  clearScreen: false,
  plugins: [vue()],
});
