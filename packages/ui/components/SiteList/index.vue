<template>
  <aside>
    <header>
      <router-link to="/">
        <logo />
      </router-link>
    </header>
    <div class="search">
      <input type="search" placeholder="Search sites..." v-model="query" />
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
import { useSites, linkToSite } from "@/shared/site";
import { search } from "@/shared/search";

ref: query = "";
ref: sites = useSites();
ref: visibleSites = computed(() => search<Site>(sites, ({ name }) => name, query));
</script>

<style scoped>
aside {
  background-color: #fff;
  overflow: auto;
  width: 300px;
}

header {
  padding: 10px 10px 0;
}

.search {
  display: flex;
  background-color: #fff;
  flex-direction: column;
  padding: 10px;
  position: sticky;
  top: 0;
}

input[type="search"] {
  --border-color: var(--background-color);
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
  transition: all 0.1s ease;
}

li a:hover {
  background-color: var(--background-color);
}

li a.router-link-active {
  background-color: var(--primary-color);
  color: #fff;
}
</style>
