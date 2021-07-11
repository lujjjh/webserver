<template>
  <div class="content-wrapper">
    <div class="card">
      <form>
        {{ peerId }}
        <input type="text" v-model.trim="remotePeerId" />
        <button type="button" @click="connect">Connect</button>
      </form>
      <pre>{{ logs }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import Peer from "peerjs";

ref: logs = "";
ref: peer = ref<Peer>();
ref: peerId = "";
ref: remotePeerId = "";

const log = (s: string) => void (logs += s + "\n");

onMounted(() => {
  peer = new Peer({ host: "peer.webserver.run", secure: true });
  peer.on("open", (id) => {
    peerId = id;
  });
  peer.on("connection", (connection) => {
    connection.on("data", (data) => {
      log(`received ${data}`);
    });
    connection.on("open", () => {
      log(`connected by ${connection.peer}`);
    });
  });
});

const connect = () => {
  const connection = peer!.connect(remotePeerId);
  connection.on("open", () => {
    log("send hello!");
    connection.send("hello!");
  });
};

onUnmounted(() => {
  peer?.destroy();
  peer = undefined;
  logs = "";
});
</script>
