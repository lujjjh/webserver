import { createApp } from "vue";
import { registerSW } from "virtual:pwa-register";
import router from "./router";
import locale from "./locale";
import App from "./App.vue";

const app = createApp(App);
app.use(router);
app.use(locale);
app.mount("#app");

registerSW();
