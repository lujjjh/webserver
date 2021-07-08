import { defineConfig } from "vite";
import { sw } from "./vite/sw";

export default defineConfig({
  server: {
    port: 4001,
    strictPort: true,
    https: {
      cert: "server.crt",
      key: "server.key",
    },
  },
  build: {
    assetsDir: ".",
    rollupOptions: {
      input: {
        "@@server@relay": "@@server@relay.html",
      },
    },
  },
  clearScreen: false,
  plugins: [sw()],
});
