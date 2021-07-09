<template>
  <iframe :src="relayURL"></iframe>
</template>

<script lang="ts" setup>
import { computed, defineProps, onMounted, onUnmounted } from "vue";
import { Server, Site } from "@webserver/core";
import { webserverPubSuffix } from "@/env";

const props = defineProps<{
  site: Site;
}>();

ref: relayURL = computed(() => `https://${props.site.name}${webserverPubSuffix}/@@server@relay.html`);
ref: server = computed(() => new Server(props.site));

const handleMessage = (event: MessageEvent) => void server.connect(event);

onMounted(() => void addEventListener("message", handleMessage));
onUnmounted(() => void removeEventListener("message", handleMessage));
</script>

<style scoped>
iframe {
  display: none;
  position: absolute;
}
</style>
