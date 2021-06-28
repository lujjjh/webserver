(async () => {
  const initPorts = () => {
    if (window.parent !== window && navigator.serviceWorker.controller) {
      console.debug("init ports");
      const { port1, port2 } = new MessageChannel();
      window.parent.postMessage("init_port", "*", [port1]);
      navigator.serviceWorker.controller.postMessage("init_port", [port2]);
    }
  };

  await navigator.serviceWorker.register("/@@server@sw.js");
  if (navigator.serviceWorker.controller) initPorts();
  navigator.serviceWorker.oncontrollerchange = () => void initPorts();

  navigator.serviceWorker.addEventListener("message", ({ data }) => {
    if (data === "reload") {
      location.reload();
    }
  });
})();
