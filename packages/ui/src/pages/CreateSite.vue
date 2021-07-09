<template>
  <div class="content-wrapper center">
    <div class="card">
      <header>{{ $t("createSite.title") }}</header>
      <form ref="form" @submit.prevent="createSite">
        <label for="name">{{ $t("createSite.siteName") }}</label>
        <input
          id="name"
          :placeholder="$t('createSite.siteNamePlaceholder')"
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
        <div v-if="error" class="tip error">{{ $t(error.message) }}</div>
        <div
          v-else-if="name"
          class="tip domain-preview"
          v-html="$t('createSite.siteNameTipServe', { prefix: name, suffix: webserverPubSuffix })"
        />
        <div v-else class="tip">{{ $t("createSite.siteNameTip") }}</div>
        <button :disabled="!canSubmit">{{ $t("createSite.create") }}</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAutoFocus } from "@/shared/autofocus";
import { useSites } from "@/shared/sites";
import { sitePattern } from "@webserver/core";
import { webserverPubSuffix } from "@/env";

ref: router = useRouter();
ref: form = ref<HTMLFormElement>();
ref: name = "";
ref: error = ref<Error>();
ref: sites = useSites();
ref: canSubmit = computed(() => name !== "" && !error);

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
