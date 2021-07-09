<template>
  <template v-if="site">
    <site-nav />
    <router-view v-slot="{ Component }">
      <component :is="Component" :key="$route.fullPath" />
    </router-view>
  </template>
  <div class="content-wrapper" v-else>{{ $t("site.notFound") }}</div>
</template>

<script lang="ts" setup>
import { provideSelectedSite } from "@/shared/sites";
import SiteNav from "./SiteNav.vue";

ref: site = provideSelectedSite();
</script>
