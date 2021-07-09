import { computed, inject, provide, Ref } from "vue";
import { useRoute } from "vue-router";
import { useLocalStorage } from "@vueuse/core";
import { Site, Sites, SitesSerializer } from "@webserver/core";

const sitesKey = Symbol.for("sites");
const selectedSiteKey = Symbol.for("selectedSite");

export const provideSites = () =>
  provide(sitesKey, useLocalStorage("sites", Sites.defaults(), { serializer: new SitesSerializer() }));

export const useSites = () => inject<Ref<Sites>>(sitesKey)!;

export const linkToSite = ({ name }: Site) => `/sites/${name}`;

export const provideSelectedSite = () => {
  const sites = useSites();
  const route = useRoute();
  const site = computed(() => sites.value.find((site) => site.name === route.params.name));
  provide(selectedSiteKey, site);
  return site;
};

export const useSelectedSite = () => inject<Ref<Site>>(selectedSiteKey)!;
