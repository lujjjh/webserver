import * as t from "io-ts";
import { Config } from "./Config";

export const Site = t.type({
  name: t.string,
  config: Config,
});

export type Site = t.TypeOf<typeof Site>;

export const defaultSite = (): Site => ({
  name: "localhost",
  config: {
    routes: [],
  },
});

export const sitePattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
