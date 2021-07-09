<template>
  <template v-if="site">
    <site-nav />
    <router-view />
  </template>
  <div class="content-wrapper" v-else>{{ t("site.notFound") }}</div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { provideSelectedSite } from "@/shared/sites";
import SiteNav from "./site/SiteNav.vue";

ref: ({ t } = useI18n());
ref: site = provideSelectedSite();
</script>
