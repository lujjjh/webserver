import { createRouter, createWebHistory } from "vue-router";
import Guide from "@/pages/Guide.vue";
import CreateSite from "@/pages/CreateSite.vue";
import Site from "@/pages/site/index.vue";
import Overview from "@/pages/site/Overview.vue";
import Routing from "@/pages/site/routing/index.vue";
import Settings from "@/pages/site/settings/index.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Guide },
    { path: "/new/site", component: CreateSite },
    {
      path: "/sites/:name",
      component: Site,
      children: [
        { path: "", component: Overview },
        { path: "routing", component: Routing },
        { path: "settings", component: Settings },
      ],
    },
  ],
});

export default router;
