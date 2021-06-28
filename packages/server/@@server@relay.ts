const roundTrip = (data: any) => {
  const { port1, port2 } = new MessageChannel();
  return new Promise<MessageEvent>((resolve) => {
    port1.addEventListener("message", (event) => {
      resolve(event);
      port1.close();
    });
    port1.start();
    window.parent.postMessage(data, "*", [port2]);
  });
};

const connect = async () => {
  if (window.parent === window || !navigator.serviceWorker.controller) {
    return null;
  }
  console.debug("connecting to parent");
  const {
    ports: [port],
  } = await roundTrip("connect");
  if (!port) {
    return null;
  }
  return port;
};

await navigator.serviceWorker.register(import.meta.env.DEV ? "/@@server@sw.ts" : "/@@server@sw.js");
if (!navigator.serviceWorker.controller) {
  window.location.reload();
  throw new Error("reload");
}

navigator.serviceWorker.addEventListener("controllerchange", () => void window.location.reload());

navigator.serviceWorker.addEventListener("message", async ({ data, ports: [port] }) => {
  if (data === "refresh") {
    window.location.reload();
    return;
  }
  if (!port) return;
  if (data === "connect") {
    const connectionPort = await connect();
    port.postMessage("connect", connectionPort && [connectionPort]);
  }
});
