import * as t from "io-ts";
import { Route } from "./Route";

export const Configuration = t.type({
  routes: t.array(Route),
});
