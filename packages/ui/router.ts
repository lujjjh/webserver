import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import Site from "@/pages/Site.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/sites/:name", component: Site },
  ],
});

export default router;
