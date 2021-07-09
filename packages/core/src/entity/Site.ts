import * as t from "io-ts";
import { Config } from "./Config";

export const Site = t.type({
  name: t.string,
  config: Config,
});

export type Site = t.TypeOf<typeof Site>;

export const defaultSite = (): Site => ({
  name: "localhost",
  config: {
    routes: [
      {
        methods: ["GET"],
        path: "/",
        type: "static",
        headers: {
          "content-type": "text/html",
        },
        body: `<!doctype html>
<meta charset="utf-8">
<h1>Hello, webserver!</h1>
<pre id="result">Fetching /get?from=webserver...</pre>
<script type="module">
const response = await fetch("/get?from=webserver");
const json = await response.json();
document.querySelector("#result").textContent = JSON.stringify(json, null, 2);
</script>
`,
      },
      {
        methods: ["GET"],
        path: "/ping",
        type: "static",
        headers: {
          "content-type": "application/json",
        },
        body: '"pong"',
      },
      {
        methods: ["*"],
        path: "/*",
        type: "proxy",
        target: "https://httpbin.org",
      },
    ],
  },
});

export const sitePattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
