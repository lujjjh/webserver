import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueI18n from "@intlify/vite-plugin-vue-i18n";

export default defineConfig({
  resolve: {
    alias: {
      "@": __dirname,
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
    vueI18n({
      include: resolve(__dirname, "./locales/**"),
    }),
  ],
});
