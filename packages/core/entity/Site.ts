import * as t from "io-ts";
import { Configuration } from "./Configuration";

export const Site = t.type({
  name: t.string,
  configuration: Configuration,
});

export type Site = t.TypeOf<typeof Site>;

export const defaultSite = (): Site => ({
  name: "localhost",
  configuration: {
    routes: [],
  },
});

export const sitePattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
