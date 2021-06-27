/// <reference lib="webworker" />

/** @type {ServiceWorkerGlobalScope} */
let _self = self;

((self) => {
  self.addEventListener("install", (event) => {
    event.waitUntil(_self.skipWaiting());
  });

  self.addEventListener("activate", async (event) => {
    const claim = self.clients.claim();
    event.waitUntil(claim);
    await claim;
    for (const client of await self.clients.matchAll()) {
      client.postMessage("reload");
    }
  });

  let port;
  let resolvePort;
  const waitForFirstPort = new Promise(
    (resolve) => void (resolvePort = resolve)
  );
  const updatePort = (newPort) => {
    port = newPort;
    resolvePort();
  };
  const getPort = async () => {
    await waitForFirstPort;
    return port;
  };

  self.addEventListener("message", ({ ports }) => {
    const [port] = ports;
    if (port) {
      updatePort(port);
    }
  });

  const readFile = async (pathname) => {
    const port = await getPort();
    const { port1, port2 } = new MessageChannel();
    port.postMessage({ pathname }, [port2]);
    let resolve;
    port1.onmessage = ({ data }) => {
      if (!data) {
        resolve(null);
      } else {
        resolve(data);
      }
    };
    return new Promise((_resolve) => void (resolve = _resolve));
  };

  const mimeTypeFromPathname = (pathname) => {
    let [ext] = /(\.[^./]+)?$/.exec(pathname);
    ext = ext.toLowerCase();
    switch (ext) {
      case ".css":
        return "text/css";
      case ".html":
        return "text/html";
      case ".js":
        return "text/javascript";
      default:
        return "application/octet-stream";
    }
  };

  self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    if (url.origin !== self.origin) {
      return;
    }
    const { pathname } = url;
    if (url.pathname.startsWith("/@@server")) {
      return;
    }
    event.respondWith(
      (async () => {
        let actualPathname;
        let buffer;
        for (const _pathname of [pathname, pathname + "/index.html"]) {
          buffer = await readFile(_pathname);
          if (buffer) {
            actualPathname = _pathname;
            break;
          }
        }
        if (!buffer) {
          return new Response(new Blob(["Not found"]), { status: 404 });
        }
        const headers = new Headers();
        headers.set("content-type", mimeTypeFromPathname(actualPathname));
        return new Response(buffer, { headers });
      })()
    );
  });
})(_self);
