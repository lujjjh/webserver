import { defineConfig, Plugin } from "rollup";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import html from "@rollup/plugin-html";
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";

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
    plugins: [typescript(), terser(), bundleName((fileName) => void (swFilename = fileName))],
  },
  {
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
      typescript(),
      replace({
        preventAssignment: true,
        values: {
          "process.env.SW_FILENAME": () => JSON.stringify(swFilename),
        },
      }),
      html({
        fileName: "@@server@relay.html",
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
