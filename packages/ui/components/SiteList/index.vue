<template>
  <aside>
    <header>
      <router-link to="/">
        <logo />
      </router-link>
    </header>
    <div class="search">
      <input type="search" :placeholder="$t('siteList.searchSites')" v-model="query" />
      <router-link to="/new/site">{{ $t("siteList.create") }}</router-link>
    </div>
    <ul>
      <li v-for="site in visibleSites">
        <router-link :to="linkToSite(site)">{{ site.name }}</router-link>
      </li>
    </ul>
  </aside>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { Site } from "@webserver/core";
import Logo from "@/components/Logo.vue";
import { useSites, linkToSite } from "@/shared/sites";
import { search } from "@/shared/search";

ref: query = "";
ref: sites = useSites();
ref: visibleSites = computed(() => search<Site>(sites, ({ name }) => name, query));
</script>

<style scoped>
aside {
  background-color: #fff;
  border-right: 1px solid var(--border-color);
  overflow: auto;
  width: 300px;
}

header {
  padding: 10px 10px 0;
}

.search {
  align-items: center;
  display: flex;
  background-color: #fff;
  padding: 10px;
  position: sticky;
  top: 0;
}

.search input[type="search"] {
  flex: 1;
  min-width: 0;
}

.search a {
  font-weight: bold;
  line-height: var(--input-height);
  margin-left: 5px;
  overflow: hidden;
  padding: 0 10px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.search input[type="search"]:focus + a {
  margin-left: 0;
  padding: 0;
  width: 0;
}

ul,
li {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  margin: 10px;
}

li a {
  align-items: center;
  display: flex;
  border-radius: var(--border-radius);
  color: var(--text-color);
  font-weight: bold;
  padding: 0 10px;
  height: 40px;
  text-decoration: none;
  transition: all 0.2s ease;
}

li a:hover {
  background-color: var(--background-color);
}

li a.router-link-active {
  background-color: var(--primary-color);
  color: #fff;
}
</style>
