import * as t from "io-ts";
import { Pong, Request, RespondConfig } from "./internal/message";

export class Client {
  constructor(private port: MessagePort, private origin: string) {}

  private roundTrip<T>(request: Request, responseType: t.Type<T>, timeout = 1000) {
    const { port } = this;
    return new Promise<T>((resolve, reject) => {
      const { port1, port2 } = new MessageChannel();
      const handleMessage = ({ data }: MessageEvent) => {
        port2.close();
        if (!responseType.is(data)) {
          console.warn("malformed response", data);
          reject(new Error("malformed response"));
          return;
        }
        resolve(data);
      };
      port2.addEventListener("message", handleMessage);
      port2.start();
      port.postMessage(Request.encode(request), [port1]);
      setTimeout(() => {
        port2.removeEventListener("message", handleMessage);
        port2.close();
        reject("receive timed out");
      }, timeout);
    });
  }

  async ping() {
    await this.roundTrip({ type: "ping" }, Pong);
  }

  async requestConfig() {
    const { config } = await this.roundTrip({ type: "requestConfig", origin: this.origin }, RespondConfig);
    return config;
  }
}
