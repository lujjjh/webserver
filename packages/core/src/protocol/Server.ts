import { ClientMessage, requestMessageToRequest, responseToResponseMessage } from "./message";

const pendingConnections = new Set<Connection>();

interface Server {
  handleRequest(request: Request): Promise<Response>;
}

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
    }
  }

  onMessage = async ({ data, ports: [port] }: MessageEvent) => {
    this.dispose();

    if (!port) {
      console.warn("missing port");
      return;
    }
    const message = data as ClientMessage;
    switch (message.type) {
      case "request": {
        const request = requestMessageToRequest(message);
        try {
          const responseMessage = await responseToResponseMessage(await this.server.handleRequest(request));
          port.postMessage(
            responseMessage,
            [responseMessage.body].filter(Boolean).map((x) => x!)
          );
        } catch (error) {
          // TODO: friendly error page
          const responseMessage = await responseToResponseMessage(
            new Response(
              JSON.stringify({
                message: error.message,
                stack: error.stack,
              }),
              {
                status: 500,
                statusText: "Internal server error",
                headers: { "content-type": "application/json" },
              }
            )
          );
          port.postMessage(
            responseMessage,
            [responseMessage.body].filter(Boolean).map((x) => x!)
          );
        }
        break;
      }
      default:
        const type: never = message.type;
        console.warn(`unexpected message type: ${type}`);
    }
  };
}
