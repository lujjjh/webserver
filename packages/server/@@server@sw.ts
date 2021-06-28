/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;
export type {};

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", async (event) => {
  const claim = self.clients.claim();
  event.waitUntil(claim);
  await claim;
  for (const client of await self.clients.matchAll()) {
    client.postMessage("reload");
  }
});

const withTimeout = <T>(promise: Promise<T>, timeout: number, error: Error) =>
  Promise.race([promise, new Promise<never>((_, reject) => setTimeout(() => void reject(error), timeout))]);

const roundTrip = async (data: any) => {
  const clients = await self.clients.matchAll({ type: "window" });
  const client = clients.find(
    ({ url, frameType }) => new URL(url).pathname === "/@@server@relay.html" && frameType === "nested"
  );
  if (!client) throw new Error("failed to connect to the server");
  const { port1, port2 } = new MessageChannel();
  return new Promise<MessageEvent>((resolve) => {
    port1.addEventListener("message", (event) => {
      resolve(event);
      port1.close();
    });
    port1.start();
    client.postMessage(data, [port2]);
  });
};

const getPort = async () => {
  const {
    ports: [port],
  } = await roundTrip("connect");
  if (!port) {
    throw new Error("expected port");
  }
  return port;
};

const readFile = async (pathname: string) => {
  const port = await withTimeout(getPort(), 1000, new Error("getPort timed out"));
  const { port1, port2 } = new MessageChannel();
  port.postMessage({ pathname }, [port2]);
  let resolve: (data: ArrayBuffer | null) => void;
  port1.onmessage = ({ data }) => {
    if (!data) {
      resolve(null);
    } else {
      resolve(data);
    }
  };
  return withTimeout(
    new Promise<ArrayBuffer | null>((_resolve) => void (resolve = _resolve)),
    1000,
    new Error("read timeout")
  );
};

const mimeTypeFromPathname = (pathname: string) => {
  let [ext] = /(\.[^./]+)?$/.exec(pathname)!;
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
        try {
          buffer = await readFile(_pathname);
        } catch (error) {
          console.error(error);
          return new Response(new Blob([error.message]), { status: 500 });
        }
        if (buffer) {
          actualPathname = _pathname;
          break;
        }
      }
      if (!(buffer && actualPathname)) {
        return new Response(new Blob(["Not found"]), { status: 404 });
      }
      const headers = new Headers();
      headers.set("content-type", mimeTypeFromPathname(actualPathname));
      return new Response(buffer, { headers });
    })()
  );
});
