import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA as pwa } from "vite-plugin-pwa";
import vueI18n from "@intlify/vite-plugin-vue-i18n";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "vue-i18n": "vue-i18n/dist/vue-i18n.runtime.esm-bundler.js",
    },
  },
  server: {
    port: 4000,
    strictPort: true,
  },
  clearScreen: false,
  plugins: [
    vue(),
    pwa({
      registerType: "autoUpdate",
    }),
    vueI18n({
      include: resolve(__dirname, "./locales/**"),
    }),
  ],
});
