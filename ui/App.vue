<template>
  <form>
    <h1>编程加 HTTP 服务器</h1>
    <div class="web-link">
      <a :href="url" target="_blank">{{ url }}</a>
    </div>
    <label>网站根目录</label>
    <button type="button" @click="chooseWebRoot">选择根目录</button>
    <div v-if="webRoot" class="tip">已选择根目录 {{ webRoot }}</div>
    <iframe ref="iframe"></iframe>
  </form>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { FS } from "./FS";

ref: url = "http://localhost:4001";
ref: iframe = null! as HTMLIFrameElement;
ref: webRoot = null as string | null;
ref: fs = null as FS | null;

onMounted(() => {
  let port: MessagePort;
  iframe.addEventListener("load", () => {
    const { port1, port2 } = new MessageChannel();
    port = port1;
    iframe.contentWindow?.postMessage("init", "*", [port2]);
    port.onmessage = async ({ data, ports }) => {
      const [port] = ports;
      if (!port) return;
      const pathname = data?.pathname;
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
  });
  iframe.src = "http://localhost:4001/@@server@relay.html";
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
  display: none;
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
