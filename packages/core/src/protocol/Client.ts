import { ClientMessage, requestToRequestMessage, ResponseMessage, responseMessageToResponse } from "./message";

export interface Port {
  postMessage(message: any, transfer?: Transferable[]): void;
}

export class Client {
  constructor(private port: Port) {}

  private roundTrip<T>(request: ClientMessage, transfers: Transferable[] = [], timeout = 1000) {
    const { port } = this;
    return new Promise<T>((resolve, reject) => {
      const { port1, port2 } = new MessageChannel();
      const handleMessage = ({ data }: MessageEvent) => {
        port2.close();
        resolve(data);
      };
      port2.addEventListener("message", handleMessage);
      port2.start();
      port.postMessage(request, [port1, ...transfers]);
      setTimeout(() => {
        port2.removeEventListener("message", handleMessage);
        port2.close();
        reject("receive timed out");
      }, timeout);
    });
  }

  async request(request: Request) {
    const requestMessage = await requestToRequestMessage(request);
    const responseMessage = await this.roundTrip<ResponseMessage>(
      requestMessage,
      [requestMessage.body].filter(Boolean).map((x) => x!)
    );
    return responseMessageToResponse(responseMessage);
  }
}
