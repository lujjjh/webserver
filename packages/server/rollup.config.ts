import path from "path";
import { defineConfig, Plugin, RollupWarning } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import html from "@rollup/plugin-html";
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";

const commonPlugins = [
  nodeResolve({
    browser: true,
    rootDir: path.resolve(__dirname, "../../"),
    dedupe: ["@webserver/core"],
    modulesOnly: true,
  }),
  typescript(),
  terser(),
];

const onwarn = (warning: RollupWarning) => {
  if (warning.code === "THIS_IS_UNDEFINED") return;
  console.warn(warning.message);
};

const bundleName = (callback: (fileName: string) => void): Plugin => ({
  name: "bundleName",
  generateBundle(options, bundle, isWrite) {
    for (const [fileName, output] of Object.entries(bundle)) {
      if ("isEntry" in output) {
        if (output.isEntry) {
          callback(fileName);
          break;
        }
      }
    }
  },
});

let swFilename = "";

export default defineConfig([
  {
    onwarn,
    input: "@@server@sw.ts",
    output: {
      dir: "dist",
      entryFileNames: "[name]-[hash].js",
      format: "iife",
      sourcemap: true,
    },
    watch: {
      clearScreen: false,
    },
    plugins: [...commonPlugins, bundleName((fileName) => void (swFilename = fileName))],
  },
  {
    onwarn,
    input: "@@server@relay.ts",
    output: {
      dir: "dist",
      entryFileNames: "[name]-[hash].js",
      format: "iife",
      sourcemap: true,
    },
    watch: {
      clearScreen: false,
    },
    plugins: [
      ...commonPlugins,
      replace({
        preventAssignment: true,
        values: {
          "process.env.SW_FILENAME": () => JSON.stringify(swFilename),
        },
      }),
      html({
        fileName: "@@server@relay.html",
        publicPath: "/",
        title: "",
      }),
      terser(),
      process.env.ROLLUP_WATCH &&
        serve({
          contentBase: "dist",
          port: 4001,
          historyApiFallback: "/@@server@relay.html",
        }),
    ].filter(Boolean),
  },
]);
