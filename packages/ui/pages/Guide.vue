<template>
  <div class="guide">
    <svg viewBox="0 0 24 24" width="36" height="36">
      <path
        d="M11 14v-3h2v3h5a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h5zM2.51 8.837C3.835 4.864 7.584 2 12 2s8.166 2.864 9.49 6.837l-1.898.632a8.003 8.003 0 0 0-15.184 0l-1.897-.632zm3.796 1.265a6.003 6.003 0 0 1 11.388 0l-1.898.633a4.002 4.002 0 0 0-7.592 0l-1.898-.633zM7 16v4h10v-4H7z"
      />
    </svg>
    <h3>
      {{ t("guide.begin") }}<router-link to="/new/site">{{ t("guide.create") }}</router-link
      >{{ t("guide.end") }}
    </h3>
    <footer>
      <div v-html="t('guide.beian')" />
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";

ref: ({ t } = useI18n());
</script>

<style scoped>
.guide {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  position: relative;
  user-select: contain;
}

svg {
  opacity: 0.1;
}

footer {
  padding: 10px 20px;
  bottom: 0;
  font-size: 13px;
  right: 0;
  opacity: 0.8;
  position: absolute;
}
</style>
