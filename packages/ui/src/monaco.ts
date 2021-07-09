import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";

((window as any).MonacoEnvironment as monaco.Environment) = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    return new editorWorker();
  },
};

monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
  schemas: [
    {
      uri: "https://webserver.run/schema/routes.json",
      fileMatch: ["routes.json"],
      schema: {
        definitions: {
          Route: {
            allOf: [
              {
                type: "object",
                properties: {
                  id: { type: "string" },
                  methods: {
                    type: "array",
                    items: { type: "string" },
                  },
                  path: { type: "string" },
                },
              },
              {
                oneOf: [{ $ref: "#/definitions/StaticResponseRoute" }, { $ref: "#/definitions/ProxyRoute" }],
              },
            ],
          },
          StaticResponseRoute: {
            type: "object",
            properties: {
              type: { const: "static" },
              body: { type: "string" },
              contentType: { type: "string" },
            },
            required: ["type", "body", "contentType"],
          },
          ProxyRoute: {
            type: "object",
            properties: {
              type: { const: "proxy" },
              target: { type: "string" },
            },
            required: ["type", "target"],
          },
        },
        type: "array",
        items: {
          $ref: "#/definitions/Route",
        },
      },
    },
  ],
});
