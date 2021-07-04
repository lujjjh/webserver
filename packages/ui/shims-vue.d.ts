/// <reference types="vite/client" />
/// <reference types="@intlify/vite-plugin-vue-i18n/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
