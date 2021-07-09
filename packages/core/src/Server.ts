import { Route, Site } from "./entity";
import { Connection } from "./protocol";
import { Router } from "./Router";

export class Server {
  private router: Router;

  constructor(public readonly site: Site) {
    this.router = new Router(this.site.config.routes);
  }

  connect = ({ origin, ports: [port] }: MessageEvent) => {
    if (!port) return;
    const { hostname } = new URL(origin);
    const matchedName = hostname.replace(/\..+/, "");
    if (matchedName !== this.site.name) return;
    new Connection(this, port);
  };

  async handleRequest(request: Request): Promise<Response> {
    const match = this.router.matchRoute(request);
    if (match === undefined) return new Response("Not found", { status: 404, statusText: "Not found" });
    if (match === null) return new Response("Method not allowed", { status: 405, statusText: "Method not allowed" });
    const { route } = match;
    switch (route.type) {
      case "static":
        return new Response(route.body, { status: 200, statusText: "OK" });
      case "proxy": {
        const requestURL = new URL(request.url);
        if (requestURL.pathname === "/__vite_ping") {
          // HACK: known issue...
          // avoid vite application from infinite reloading
          throw new Error("intented error");
        }
        const targetURL = new URL(route.target);
        requestURL.protocol = targetURL.protocol;
        requestURL.host = targetURL.host;
        requestURL.port = targetURL.port;
        if (targetURL.pathname.endsWith("/")) {
          requestURL.pathname = targetURL.pathname.replace(/\/+/, "") + requestURL.pathname;
        } else {
          requestURL.pathname = targetURL.pathname;
        }
        console.log("proxy:", requestURL.toString());
        return fetch(requestURL.toString(), {
          method: request.method,
          body: request.body,
          headers: request.headers,
        });
      }
      default:
        console.error(`unknown type: ${(route as Route).type}`);
        return new Response("Not implemented", { status: 501, statusText: "Not implemented" });
    }
  }
}
