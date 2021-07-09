<template>
  <div class="content-wrapper">
    <Route v-for="route in site.config.routes" :key="route.id" :route="route" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import * as monaco from "monaco-editor";
import { useSelectedSite } from "@/shared/sites";
import Route from "./Route.vue";

ref: ({ t } = useI18n());
ref: editorContainer = ref<HTMLDivElement>();
ref: site = useSelectedSite()!;
</script>

<style scoped>
.editor {
  border: 1px solid var(--border-color);
  height: 300px;
}

footer {
  margin-top: 20px;
}
</style>
