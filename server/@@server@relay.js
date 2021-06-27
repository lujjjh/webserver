(async () => {
  await navigator.serviceWorker.register("/@@server@sw.js");
  if (!navigator.serviceWorker.controller) {
    location.reload();
    return;
  }
  navigator.serviceWorker.addEventListener("message", ({ data }) => {
    if (data === "reload") {
      location.reload();
    }
  });
  addEventListener("message", ({ ports }) => {
    const [port] = ports;
    if (port) {
      navigator.serviceWorker.controller.postMessage("init", [port]);
    }
  });
})();
