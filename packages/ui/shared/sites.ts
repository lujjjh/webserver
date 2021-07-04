import { inject, provide } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { Site, Sites, SitesSerializer } from "@webserver/core";

const SITES_KEY = Symbol();

export const provideSites = () =>
  provide(SITES_KEY, useLocalStorage("sites", Sites.defaults(), { serializer: new SitesSerializer() }));

export const useSites = () => inject<Sites>(SITES_KEY)!;

export const linkToSite = ({ name }: Site) => `/sites/${name}`;
