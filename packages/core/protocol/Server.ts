import { Site } from "../entity";
import { ClientMessage, requestMessageToRequest, ResponseMessage, responseToResponseMessage } from "./message";

const pendingConnections = new Set<Connection>();

export class Connection {
  private timer;

  constructor(private server: Server, private port: MessagePort) {
    port.addEventListener("message", this.onMessage);
    port.start();
    pendingConnections.add(this);
    this.timer = setTimeout(() => void this.dispose(), 1000);
  }

  dispose() {
    if (pendingConnections.has(this)) {
      clearTimeout(this.timer);
      pendingConnections.delete(this);
      const { port } = this;
      port.close();
      port.removeEventListener("message", this.onMessage);
    }
  }

  onMessage = async ({ data, ports: [port] }: MessageEvent) => {
    this.dispose();

    const { site } = this.server;
    if (!port) {
      console.warn("missing port");
      return;
    }
    const message = data as ClientMessage;
    switch (message.type) {
      case "request": {
        const request = requestMessageToRequest(message);
        const url = new URL(request.url);
        const matchedName = url.hostname.replace(/\..+/, "");
        if (matchedName !== site.name) {
          console.warn(`received message from unexpected hostname (${url.hostname}), will ignore it`);
          return;
        }
        const responseMessage = await responseToResponseMessage(
          new Response(new Blob(["hello"], { type: "text/plain" }))
        );
        port.postMessage(
          responseMessage,
          [responseMessage.body].filter(Boolean).map((x) => x!)
        );
        break;
      }
      default:
        const type: never = message.type;
        console.warn(`unexpected message type: ${type}`);
    }
  };
}

export class Server {
  constructor(public readonly site: Site) {}

  connect = ({ origin, ports: [port] }: MessageEvent) => {
    const { hostname } = new URL(origin);
    const matchedName = hostname.replace(/\..+/, "");
    if (matchedName !== this.site.name) {
      return;
    }
    new Connection(this, port);
  };
}
