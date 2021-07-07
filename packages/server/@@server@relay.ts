import sw from "./@@server@sw?sw";

(async () => {
  await navigator.serviceWorker.register(sw);
  await navigator.serviceWorker.ready;
  navigator.serviceWorker.addEventListener("controllerchange", () => void window.location.reload());

  if (window.parent !== window) {
    navigator.serviceWorker.addEventListener("message", async ({ data, ports: [port] }) => {
      if (!port) return;
      window.parent.postMessage(data, "*", [port]);
    });
  }
})();
