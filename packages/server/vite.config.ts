import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  server: {
    port: 4001,
    strictPort: true,
  },
  clearScreen: false,
  build: {
    assetsDir: ".",
    rollupOptions: {
      input: {
        "@@server@relay": resolve(__dirname, "@@server@relay.html"),
        "@@server@sw": resolve(__dirname, "@@server@sw.ts"),
      },
      output: {
        entryFileNames: `[name].js`,
      },
    },
  },
});
