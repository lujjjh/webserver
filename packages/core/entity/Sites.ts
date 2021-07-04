import { defaultSite, Site } from "./Site";

export class Sites extends Array {
  private constructor(sites: Site[]) {
    super();
    for (let i = 0; i < sites.length; i++) this[i] = sites[i];
  }

  static from(sites: unknown) {
    if (!Array.isArray(sites)) {
      return new Sites([]);
    }
    // Here we're not using t.array() to avoid the failure of
    // parsing the whold array due to a single site error.
    // Instead, we check every site individually and filter out
    // all valid ones.
    return new Sites(sites.map((site) => (Site.is(site) ? site : null!)).filter((site) => site));
  }

  static defaults() {
    return new Sites([defaultSite()]);
  }

  toJSON() {
    return this.map((site) => Site.encode(site));
  }
}
