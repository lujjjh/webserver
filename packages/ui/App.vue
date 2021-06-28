<template>
  <form>
    <h1>
      编程加 HTTP 服务器
      <small><a target="_blank" href="https://github.com/lujjjh/webserver" rel="nofollow noopener">[GitHub]</a></small>
    </h1>
    <div class="web-link">
      <a v-if="ready" :href="localhostOrigin" target="_blank">{{ localhostOrigin }}</a>
      <span v-else>正在启动……</span>
    </div>
    <div class="tip">目前仅支持 Chrome / Edge</div>
    <iframe ref="iframe" :src="`${localhostOrigin}/@@server@relay.html`"></iframe>
    <label>网站根目录</label>
    <button type="button" @click="chooseWebRoot">选择根目录</button>
    <div v-if="webRoot" class="tip">已选择根目录 {{ webRoot }}</div>
  </form>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { FS } from "./FS";
import * as env from "./env";

ref: localhostOrigin = env.localhostOrigin;
ref: iframe = null! as HTMLIFrameElement;
ref: ready = false;
ref: webRoot = null as string | null;
ref: fs = null as FS | null;

onMounted(() => {
  const handleRequest = async ({ data, ports: [port] }: MessageEvent) => {
    if (!port) return;
    const pathname = data?.pathname;
    console.debug("request:", pathname);
    if (!fs) {
      port.postMessage(null);
      return;
    }
    const file = await fs.getFile(pathname);
    if (!file) {
      port.postMessage(null);
      return;
    }
    const buffer = await file.arrayBuffer();
    port.postMessage(buffer, [buffer]);
  };
  const handleMessage = ({ data, ports: [port] }: MessageEvent) => {
    if (data === "ready") {
      ready = true;
    } else if (data === "connect" && port) {
      console.debug("establishing connection");
      const { port1, port2 } = new MessageChannel();
      port1.addEventListener("message", (event) => {
        handleRequest(event);
        port1.close();
      });
      port1.start();
      port.postMessage("connect", [port2]);
    }
  };
  addEventListener("message", handleMessage);
  return () => void removeEventListener("message", handleMessage);
});

const chooseWebRoot = async () => {
  let handle: FileSystemDirectoryHandle;
  try {
    handle = await showDirectoryPicker();
  } catch (error) {
    return;
  }
  webRoot = handle.name;
  fs = new FS(handle);
};
</script>

<style scoped>
form {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0 auto;
  max-width: 1000px;
  padding: 30px;
}

form > * {
  flex-shrink: 0;
}

h1 {
  border-bottom: 1px solid var(--border-color);
  font-size: 1.5rem;
  font-weight: normal;
  margin: 0 0 15px;
  padding: 15px 0;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

label {
  margin: 30px 0 15px;
}

iframe {
  position: absolute;
  left: -1000px;
}

form > div {
  margin: 15px 0;
}

.web-link::before {
  content: "\1f517";
  margin-right: 5px;
}

.tip {
  opacity: 0.8;
}
</style>
