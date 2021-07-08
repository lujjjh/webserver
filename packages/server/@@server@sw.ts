/// <reference lib="webworker" />

import { Client } from "@webserver/core";

declare const self: ServiceWorkerGlobalScope;
export type {};

const relayPath = "/@@server@relay.html";

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

const relayClientDo = async <T>(f: (client: Client) => T) => {
  const clients = (await self.clients.matchAll({ type: "window", includeUncontrolled: true })).filter(
    ({ url }) => new URL(url).pathname === relayPath
  );
  if (!clients.length) throw new ServerNotFoundError();
  return Promise.race(
    clients.map((client) => {
      const { port1, port2 } = new MessageChannel();
      client.postMessage(null, [port2]);
      return f(new Client(port1));
    })
  );
};

const request = (request: Request) => relayClientDo((client) => client.request(request));

const shouldHandleRequest = async ({ clientId, request }: FetchEvent) => {
  const url = new URL(request.url);
  if (url.origin !== self.origin) return false;
  if (url.pathname === relayPath) return false;
  const client = await self.clients.get(clientId);
  if (!client) return true;
  return new URL(client.url).pathname !== relayPath;
};

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      if (await shouldHandleRequest(event)) return request(event.request);
      return fetch(event.request);
    })()
  );
});
