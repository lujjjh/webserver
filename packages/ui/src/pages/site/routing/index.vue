<template>
  <div class="editor" ref="editorContainer"></div>
  <footer v-if="nextRoutes">
    <div class="unsaved">Unsaved</div>
    <button class="save" @click="saveRoutes">Save</button>
  </footer>
</template>

<script lang="ts" setup>
import "@/monaco";
import * as t from "io-ts";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import * as monaco from "monaco-editor";
import { Route } from "@webserver/core";
import { useSelectedSite } from "@/shared/sites";

ref: editorContainer = ref<HTMLDivElement>();
ref: site = useSelectedSite()!;
ref: routesJSON = computed(() => JSON.stringify(site.config.routes, null, 2));
ref: nextRoutes = ref<Route[]>();

onMounted(() => {
  const uri = `inmemory://routes.json`;
  const model = monaco.editor.createModel(routesJSON, "json", monaco.Uri.parse(uri));
  const editor = monaco.editor.create(editorContainer!, {
    model,
    automaticLayout: true,
    fontSize: 13,
    lineHeight: 22,
  });
  editor.onDidChangeModelContent(() => {
    try {
      const maybeRoutes = JSON.parse(editor.getModel()!.getValue());
      if (!t.array(Route).is(maybeRoutes)) {
        throw new Error("invalid routes");
      }
      nextRoutes = maybeRoutes;
    } catch (error) {
      nextRoutes = undefined;
    }
    if (editor.getModel()!.getLineContent(editor.getPosition()!.lineNumber).trim() === '""') {
      editor.trigger("", "editor.action.triggerSuggest", {});
    }
  });

  onUnmounted(() => {
    model.dispose();
    editor.dispose();
  });
});

const saveRoutes = () => {
  if (!nextRoutes) return;
  site.config.routes = nextRoutes;
  nextRoutes = undefined;
};

onBeforeRouteLeave((to, from, next) => {
  if (nextRoutes) {
    if (!confirm("Unsaved changes will be discarded.\nContinue?")) {
      return;
    }
  }
  next();
});
</script>

<style scoped>
.editor {
  border: 1px solid var(--border-color);
  flex: 1;
  min-height: 0;
}

footer {
  align-items: center;
  display: flex;
  padding: 20px;
}

.unsaved {
  color: #d84f00;
}

.save {
  margin-left: auto;
}
</style>
