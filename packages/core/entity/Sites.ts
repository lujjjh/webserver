import { defaultSite, Site, sitePattern } from "./Site";

export class InvalidNameError extends Error {
  constructor() {
    super("createSite.invalidNameError");
  }
}

export class DuplicatedNameError extends Error {
  constructor() {
    super("createSite.duplicatedNameError");
  }
}

export class Sites extends Array<Site> {
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

  checkSiteName(name: string) {
    if (!sitePattern.test(name) || name.length > 64) {
      throw new InvalidNameError();
    }

    // check if the site name already exists
    if (this.find((site) => site.name === name)) {
      throw new DuplicatedNameError();
    }
  }

  createSite(name: string, site?: Partial<Omit<Site, "name">>) {
    name = name.trim().toLowerCase();
    this.checkSiteName(name);
    this.push({
      configuration: {
        routes: [],
      },
      ...site,
      name,
    });
  }

  removeSite(name: string) {
    const index = this.findIndex((site) => site.name === name);
    if (index === -1) return false;
    this.splice(index, 1);
    return true;
  }
}
