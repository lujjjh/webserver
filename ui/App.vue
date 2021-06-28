<template>
  <form>
    <h1>编程加 HTTP 服务器</h1>
    <div class="web-link">
      <a :href="localhostOrigin" target="_blank">{{ localhostOrigin }}</a>
    </div>
    <label>网站根目录</label>
    <button type="button" @click="chooseWebRoot">选择根目录</button>
    <div v-if="webRoot" class="tip">已选择根目录 {{ webRoot }}</div>
    <iframe
      ref="iframe"
      :src="`${localhostOrigin}/@@server@relay.html`"
    ></iframe>
  </form>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { FS } from "./FS";
import * as env from "./env";

ref: localhostOrigin = env.localhostOrigin;
ref: iframe = null! as HTMLIFrameElement;
ref: webRoot = null as string | null;
ref: fs = null as FS | null;

onMounted(() => {
  let port: MessagePort;
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
  const handleInitPort = ({ data, ports }: MessageEvent) => {
    if (data === "init_port" && ports.length) {
      port = ports[0];
      port.onmessage = handleRequest;
    }
  };
  addEventListener("message", handleInitPort);
  return () => void removeEventListener("message", handleInitPort);
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
  height: 100vh;
  margin: 0 auto;
  max-width: 1000px;
  overflow: auto;
  padding: 30px;
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
  margin: 15px 0;
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
  opacity: 0.5;
}
</style>
