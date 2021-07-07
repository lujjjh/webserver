import { Plugin, ResolvedConfig } from "vite";
import { parse, posix } from "path";
import { createHash } from "crypto";
import rollup from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

const swId = "/__sw__@";

export const sw = (): Plugin => {
  let config: ResolvedConfig;

  const bundleCache: Record<string, string> = {};
  let nextId = 0;
  const nextSwId = () => {
    const id = swId + nextId;
    // in case of memory leak...
    nextId = (nextId + 1) % 10;
    return id;
  };

  return {
    name: "sw",

    configResolved(_config) {
      config = _config;
    },

    load(id) {
      try {
        const { searchParams } = new URL(id, "file:///");
        if (searchParams.has("sw")) return "";
      } catch {}
      if (!id.startsWith(swId) || !(id in bundleCache)) {
        return null;
      }
      return bundleCache[id];
    },

    async transform(_, id) {
      let idURL: URL;
      try {
        idURL = new URL(id, "file:///");
        if (!idURL.searchParams.has("sw")) return;
      } catch {
        return;
      }

      const { pathname } = idURL;

      const bundle = await rollup.rollup({
        input: pathname,
        plugins: [nodeResolve(), typescript(), terser()],
        onwarn(warning, warn) {
          if (warning.code === "THIS_IS_UNDEFINED") return;
          warn(warning);
        },
      });
      let code: string;
      try {
        const { output } = await bundle.generate({
          format: "iife",
          sourcemap: config.command === "build" ? config.build.sourcemap : "inline",
        });
        code = output[0].code;
        const map = output[0].map;
        if (map) code += `\n//# sourceMappingURL=${map.toUrl()}`;
      } finally {
        await bundle.close();
      }

      let url;
      if (config.command === "build") {
        const basename = parse(pathname).name;
        const hash = createHash("sha256").update(code, "utf8").digest("hex").slice(0, 8);
        url = `__VITE_ASSET__${this.emitFile({
          fileName: posix.join(config.build.assetsDir, `${basename}.${hash}.js`),
          type: "asset",
          source: code,
        })}__`;
      } else {
        url = nextSwId();
        bundleCache[url] = code;
      }
      return `export default ${JSON.stringify(url)}`;
    },
  };
};
