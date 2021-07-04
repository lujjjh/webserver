import { createRouter, createWebHistory } from "vue-router";
import Guide from "@/pages/Guide.vue";
import Site from "@/pages/Site.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Guide },
    { path: "/sites/:name", component: Site },
  ],
});

export default router;
