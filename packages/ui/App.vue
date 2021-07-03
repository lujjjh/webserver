<template>
  <div class="board">
    <site-list />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts" setup>
import SiteList from "@/components/SiteList/index.vue";
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
