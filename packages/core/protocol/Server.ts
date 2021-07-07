import { Site } from "../entity";
import { ClientMessage, requestMessageToRequest, ResponseMessage, responseToResponseMessage } from "./message";

const pendingServers = new Set<Server>();

export class Server {
  private timer;

  constructor(private port: MessagePort, private site: Site) {
    port.addEventListener("message", this.onMessage);
    port.start();
    pendingServers.add(this);
    this.timer = setTimeout(() => void this.dispose(), 1000);
  }

  dispose() {
    if (pendingServers.has(this)) {
      clearTimeout(this.timer);
      pendingServers.delete(this);
      const { port } = this;
      port.close();
      port.removeEventListener("message", this.onMessage);
    }
  }

  onMessage = async ({ data, ports: [port] }: MessageEvent) => {
    this.dispose();

    const { site } = this;
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
