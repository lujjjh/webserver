import { Sites } from "../entity/Sites";

export class SitesSerializer {
  read(raw: string) {
    let value;
    try {
      value = JSON.parse(raw);
    } catch {}
    return Sites.from(value);
  }

  write(value: Sites) {
    return JSON.stringify(value);
  }
}
