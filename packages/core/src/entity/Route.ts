import * as t from "io-ts";

const Common = t.intersection([
  t.partial({ id: t.string }),
  t.type({
    methods: t.array(t.string),
    path: t.string,
  }),
]);

const StaticResponseRoute = t.intersection([
  t.type({
    type: t.literal("static"),
    body: t.string,
  }),
  t.partial({
    headers: t.record(t.string, t.string),
  }),
]);

const ProxyRoute = t.type({
  type: t.literal("proxy"),
  target: t.string,
});

export const Route = t.intersection([Common, t.union([StaticResponseRoute, ProxyRoute])]);
export type Route = t.TypeOf<typeof Route>;
