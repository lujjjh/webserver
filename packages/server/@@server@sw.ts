/// <reference lib="webworker" />

import { Client } from "@webserver/core";

declare const self: ServiceWorkerGlobalScope;
export type {};

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", async (event) => {
  event.waitUntil(self.clients.claim());
});

class ServerNotFoundError extends Error {
  constructor() {
    super("server not found");
  }
}

let _client: Client | undefined;
const getClient = async () => {
  if (_client) {
    try {
      await _client.ping();
      return _client;
    } catch {
      _client = undefined;
    }
  }
  const { port1, port2 } = new MessageChannel();
  const serviceWorkerClients = await self.clients.matchAll({ type: "window" });
  const serviceWorkerClient = serviceWorkerClients.find(
    ({ url, frameType }) => new URL(url).pathname === "/@@server@relay.html" && frameType === "nested"
  );
  if (!serviceWorkerClient) throw new ServerNotFoundError();
  serviceWorkerClient.postMessage(null, [port1]);
  return (_client = new Client(port2, self.origin));
};

const shouldHandleRequest = (request: Request) => {
  const isInternalURL = (url: URL | string) => {
    if (typeof url === "string") {
      try {
        url = new URL(url);
      } catch {
        return false;
      }
    }
    const internalPrefix = "/@@server";
    return url.origin == self.origin && url.pathname.startsWith(internalPrefix);
  };
  return isInternalURL(request.url) || isInternalURL(request.referrer);
};

self.addEventListener("fetch", async (event) => {
  if (!shouldHandleRequest(event.request))
    try {
      const client = await getClient();
      const config = await client.requestConfig();
      console.log(config);
    } catch (error) {
      console.log(event.request.url, event.request.referrer);
      console.error(error);
    }
});
