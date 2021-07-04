import { createRouter, createWebHistory } from "vue-router";
import Guide from "@/pages/Guide.vue";
import CreateSite from "@/pages/CreateSite.vue";
import Site from "@/pages/Site.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Guide },
    { path: "/new/site", component: CreateSite },
    { path: "/sites/:name", component: Site },
  ],
});

export default router;
