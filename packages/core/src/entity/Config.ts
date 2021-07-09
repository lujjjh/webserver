import * as t from "io-ts";
import { Route } from "./Route";

export const Config = t.type({
  routes: t.array(Route),
});
