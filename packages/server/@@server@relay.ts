(async () => {
  await navigator.serviceWorker.register("/" + process.env.SW_FILENAME);
  if (!navigator.serviceWorker.controller) {
    window.location.reload();
    return;
  }

  navigator.serviceWorker.addEventListener("controllerchange", () => void window.location.reload());

  if (window.parent !== window) {
    navigator.serviceWorker.addEventListener("message", async ({ data, ports: [port] }) => {
      if (!port) return;
      window.parent.postMessage(data, "*", [port]);
    });
  }
})();
