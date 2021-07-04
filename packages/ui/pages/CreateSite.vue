<template>
  <div class="content-wrapper center">
    <div class="card">
      <header>Create site</header>
      <form ref="form" @submit.prevent="createSite">
        <label for="name">Site name</label>
        <input
          id="name"
          placeholder="e.g. localhost, my-site"
          autofocus
          v-model.trim="name"
          maxlength="64"
          required
          :pattern="sitePattern.source"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          @input="checkSiteName"
        />
        <div v-if="error" class="tip error">{{ error.message }}</div>
        <div v-else-if="name" class="tip">
          This site will be served at
          <code class="domain-preview"
            ><em>{{ name }}</em
            >.webserver.run</code
          >.
        </div>
        <div v-else class="tip">Site name should be a valid domain prefix.</div>
        <button :disabled="!!(!name || error)">Create</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAutoFocus } from "@/shared/autofocus";
import { useSites } from "@/shared/sites";
import { sitePattern } from "@webserver/core";

ref: form = ref<HTMLFormElement>();
ref: name = "";
ref: error = ref<Error>();
ref: sites = useSites();
ref: router = useRouter();

useAutoFocus();

const checkSiteName = () => {
  try {
    sites.checkSiteName(name);
    error = undefined;
  } catch (e) {
    error = e;
  }
};

const createSite = () => {
  try {
    sites.createSite(name);
    router.push(`/sites/${name}`);
  } catch (e) {
    error = e;
  }
};
</script>

<style>
.domain-preview em {
  color: #333;
  font-style: normal;
  font-weight: bold;
  word-break: break-all;
}
</style>
