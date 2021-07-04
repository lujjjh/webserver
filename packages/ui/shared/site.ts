import { useLocalStorage } from "@vueuse/core";
import { Site, Sites, SitesSerializer } from "@webserver/core";

export const useSites = () => useLocalStorage("sites", Sites.defaults(), { serializer: new SitesSerializer() });

export const linkToSite = ({ name }: Site) => `/sites/${name}`;
