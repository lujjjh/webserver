import { inject, provide, Ref } from "vue";
import { useRoute } from "vue-router";
import { useLocalStorage } from "@vueuse/core";
import { Site, Sites, SitesSerializer } from "@webserver/core";

const SITES_KEY = Symbol();

export const provideSites = () =>
  provide(SITES_KEY, useLocalStorage("sites", Sites.defaults(), { serializer: new SitesSerializer() }));

export const useSites = () => inject<Ref<Sites>>(SITES_KEY)!;

export const linkToSite = ({ name }: Site) => `/sites/${name}`;

export const useSelectedSite = () => {
  const {
    params: { name },
  } = useRoute();
  if (typeof name !== "string") throw new Error("useSelectedSite can only used in /sites/:name/*");
  const sites = useSites();
  const site = sites.value.find((site) => site.name === name);
  if (!site) {
    throw new Error(`site ${name} not found`);
  }
  return site;
};
