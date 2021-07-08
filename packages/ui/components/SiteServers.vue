<template>
  <site-server v-for="site in sites" :key="site.name" :site="site" />
</template>

<script lang="ts" setup>
import { useSites } from "@/shared/sites";
import SiteServer from "./SiteServer.vue";

ref: sites = useSites();
</script>
