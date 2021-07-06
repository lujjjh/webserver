import * as t from "io-ts";
import { Config } from "../../entity";

export const Ping = t.type({
  type: t.literal("ping"),
});

export const Pong = t.type({
  type: t.literal("pong"),
});

export const RequestConfig = t.type({
  type: t.literal("requestConfig"),
  origin: t.string,
});

export const RespondConfig = t.type({
  type: t.literal("respondConfig"),
  config: t.union([t.null, Config]),
});

export const Request = t.union([Ping, RequestConfig]);
export type Request = t.TypeOf<typeof Request>;

export const Response = t.union([Pong, RespondConfig]);
export type Response = t.TypeOf<typeof Response>;
