<template>
  <nav>
    <div class="content-wrapper">
      <header>
        {{ site.name }}
      </header>
    </div>
    <ol>
      <li><router-link :to="`/sites/${site.name}`" :data-content="t('site.overview')" /></li>
      <li><router-link :to="`/sites/${site.name}/settings`" :data-content="t('site.settings')" /></li>
    </ol>
  </nav>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useSelectedSite } from "@/shared/sites";

ref: ({ t } = useI18n());
ref: site = useSelectedSite();
</script>

<style scoped>
nav {
  background-color: #fff;
  border-bottom: 1px solid var(--border-color);
}

nav header {
  margin-bottom: 0;
}

ol,
li {
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

ol {
  padding: 0 20px;
}

a {
  border-color: transparent;
  border-style: solid none;
  border-width: 2px;
  box-sizing: border-box;
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  height: 40px;
  justify-content: center;
  padding: 0 15px;
  position: relative;
  text-align: center;
  top: 1px;
  transition: all 0.2s ease;
}

a::before {
  content: attr(data-content);
  display: block;
  font-weight: bold;
  height: 0;
  visibility: hidden;
}

a::after {
  content: attr(data-content);
}

a:hover {
  border-bottom-color: var(--border-color);
}

a.router-link-exact-active {
  border-bottom-color: var(--primary-color);
  color: var(--primary-color);
  font-weight: bold;
}
</style>
