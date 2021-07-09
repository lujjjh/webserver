import { Site } from "./entity";
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
    const route = this.router.matchRoute(request);
    if (route === undefined) return new Response("Not found", { status: 404 });
    if (route === null) return new Response("Method not allowed", { status: 405 });
    return new Response(request.url);
  }
}
