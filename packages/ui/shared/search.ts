const tryParseRegExpPattern = (maybeRegExpPattern: string) => {
  if (maybeRegExpPattern.length < 2) return maybeRegExpPattern;
  const match = /\/(.+)\/([^/]*)$/.exec(maybeRegExpPattern);
  if (!match) return maybeRegExpPattern;
  try {
    const [, pattern, flags] = match;
    return new RegExp(pattern, flags);
  } catch {}
  return maybeRegExpPattern;
};

export const search = <T>(from: T[], fields: (value: T) => string | string[], pattern: string | RegExp) => {
  if (pattern === "" || pattern === null) return from;
  if (typeof pattern === "string") pattern = tryParseRegExpPattern(pattern);
  const thePattern = pattern;
  const test = (() => {
    if (typeof thePattern === "string") {
      const searchString = thePattern.toLowerCase();
      return (field: string) => field.toLowerCase().includes(searchString);
    } else {
      return (field: string) => thePattern.test(field);
    }
  })();
  return from.filter((value) => {
    let fieldsToSearch = fields(value);
    if (!Array.isArray(fieldsToSearch)) fieldsToSearch = [fieldsToSearch];
    return fieldsToSearch.some((field) => test(field));
  });
};
