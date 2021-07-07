<template>
  <div class="board">
    <site-list />
    <main>
      <router-view />
    </main>
  </div>
  <iframe src="http://localhost:4001/@@server@relay.html"></iframe>
</template>

<script lang="ts" setup>
import SiteList from "@/components/SiteList/index.vue";
import { provideSites } from "./shared/sites";
import { Server } from "@webserver/core";

provideSites();

addEventListener("message", ({ ports: [port] }) => {
  new Server(port, {
    name: "localhost",
    config: {
      routes: [],
    },
  });
});
</script>

<style scoped>
.board {
  display: flex;
  height: 100vh;
}

.board > main {
  flex: 1;
  min-width: 0;
  overflow: auto;
}
</style>
