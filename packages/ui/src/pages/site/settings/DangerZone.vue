<template>
  <div class="card">
    <header>{{ $t("dangerZone.title") }}</header>
    <form @submit.prevent="removeSite">
      <template v-if="acquiringRemoval">
        <input
          ref="confirmInput"
          :placeholder="$t('dangerZone.confirmPlaceholder', { name: site.name })"
          v-model="confirmName"
        />
        <button type="submit" class="danger" :disabled="confirmName !== site.name">
          {{ $t("dangerZone.confirm") }}
        </button>
        <button type="button" @click="acquiringRemoval = false">{{ $t("dangerZone.cancel") }}</button>
      </template>
      <template v-else>
        <button type="button" class="danger" @click="acquiringRemoval = true">{{ $t("dangerZone.removeSite") }}</button>
      </template>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useSelectedSite, useSites } from "@/shared/sites";

ref: router = useRouter();
ref: site = useSelectedSite();
ref: confirmName = "";
ref: confirmInput = ref<HTMLInputElement>();
ref: acquiringRemoval = false;
ref: sites = useSites();

watch($acquiringRemoval, (value) => {
  if (value) nextTick(() => void confirmInput?.focus());
  else nextTick(() => void (confirmName = ""));
});

const removeSite = () => {
  if (confirmName === site.name) {
    sites.removeSite(site.name);
    router.push("/");
  }
};
</script>

<style scoped>
form {
  flex-direction: row;
}

form > * {
  margin: 0 10px 0 0;
}

input {
  flex: 1;
  min-width: 0;
}
</style>
