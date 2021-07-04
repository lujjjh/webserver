<template>
  <div class="card">
    <header>{{ t("dangerZone.title") }}</header>
    <form @submit.prevent="removeSite">
      <template v-if="acquiringRemoval">
        <input ref="confirmInput" :placeholder="t('dangerZone.confirmPlaceholder', { name })" v-model="confirmName" />
        <button type="submit" class="danger" :disabled="confirmName !== name">{{ t("dangerZone.confirm") }}</button>
        <button type="button" @click="acquiringRemoval = false">{{ t("dangerZone.cancel") }}</button>
      </template>
      <template v-else>
        <button type="button" class="danger" @click="acquiringRemoval = true">{{ t("dangerZone.removeSite") }}</button>
      </template>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useSites } from "@/shared/sites";

ref: router = useRouter();
ref: route = useRoute();
ref: ({ t } = useI18n());
ref: name = computed(() => route.params.name as string);
ref: confirmName = "";
ref: confirmInput = ref<HTMLInputElement>();
ref: acquiringRemoval = false;
ref: sites = useSites();

watch($acquiringRemoval, (value) => {
  if (value) nextTick(() => void confirmInput?.focus());
  else nextTick(() => void (confirmName = ""));
});

const removeSite = () => {
  if (confirmName === name) {
    sites.removeSite(name);
    router.push("/");
  }
};
</script>

<style scoped>
form {
  flex-direction: row;
}

form > * {
  margin-right: 10px;
}

input {
  flex: 1;
  min-width: 0;
}
</style>
