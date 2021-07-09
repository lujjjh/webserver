<template>
  <div class="board">
    <site-list />
    <main>
      <router-view />
    </main>
  </div>
  <site-servers />
</template>

<script lang="ts" setup>
import SiteList from "@/components/SiteList/index.vue";
import { provideSites } from "./shared/sites";
import SiteServers from "@/components/SiteServers.vue";

provideSites();
</script>

<style scoped>
.board {
  display: flex;
  height: 100vh;
}

.board > main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  overflow: auto;
}
</style>
