import { useLocalStorage } from "@vueuse/core";
import { Site, defaultSite } from "@webserver/core";

const defaultSites = () => [defaultSite()];

export const useSites = () => {
  const state = useLocalStorage<Site[]>("sites", defaultSites());
  if (!Array.isArray(state.value)) {
    state.value = defaultSites();
  }
  state.value = state.value.filter((maybeSite: unknown) => Site.is(maybeSite));
  return state;
};

export const linkToSite = ({ name }: Site) => `/sites/${name}`;
