import { Site } from "../entity";
import { Pong, Request, RespondConfig } from "./internal/message";

export class Server {
  constructor(private port: MessagePort, private site: Site) {
    port.addEventListener("message", this.onMessage);
    port.start();
  }

  dispose() {
    const { port } = this;
    port.close();
    port.removeEventListener("message", this.onMessage);
  }

  onMessage = ({ data, ports: [port] }: MessageEvent) => {
    const { site } = this;
    if (!Request.is(data)) {
      console.warn("malformed request:", data);
      return;
    }
    if (!port) {
      console.warn("missing port");
      return;
    }
    switch (data.type) {
      case "ping":
        port.postMessage(Pong.encode({ type: "pong" }));
        break;
      case "requestConfig": {
        const { origin } = data;
        const matchedName = new URL(origin).hostname.replace(/\..+/, "");
        if (matchedName !== site.name) {
          console.warn(`received message from unexpected origin (${origin}), will ignore it`);
          return;
        }
        port.postMessage(RespondConfig.encode({ type: "respondConfig", config: site.config }));
        break;
      }
      default:
        const _data: never = data;
        console.warn(`unexpected message type: ${(_data as Request).type}`);
    }
  };
}
