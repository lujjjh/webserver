# webserver

A webserver that runs in the browser for web development.

## Current status

Webserver is currently in its early stages. Feel free to play with it,
but backward compatibility is not guaranteed.

## Why?

**localhost** and **127.0.0.1** are not always enough
for local development. We might be able to hijack domains to localhost.
However, HTTPS is required if we want to use some web platform features
and SSL/TLS certificates are difficult to manage.

Webserver is a webserver that runs in the browser. It gives you
actual domains like **localhost.webserver.pub** and uses
service worker to redirect traffic to localhost. As a result, you
may use a genuine domain to connect to your local server without
bothering about certificates.

## Getting started

<https://webserver.run>

**Safari is not currently supported.**

## Features

- 🔒 HTTPS
- 🚒 Routing
- ✈️ Proxy

## Roadmap

- [ ] Share
- [ ] Route editor

## Known issues

- Because webserver is built on service worker, service worker and websocket are not supported.
- CORS must be handled appropriately by the proxy target, and origin from **\*.webserver.pub** must be allowed.
- If the proxy target is not localhost, HTTPS must be used.
- Cookie (credentials) is not handled yet.
