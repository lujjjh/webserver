<template>
  <div class="content-wrapper">
    <div class="card">
      <table>
        <tbody>
          <tr>
            <th>Status</th>
            <td>Running</td>
          </tr>
          <tr>
            <th>Endpoint</th>
            <td>
              <a :href="endpoint" target="_blank" rel="noopener noreferrer nofollow">{{ endpoint }}</a>
            </td>
          </tr>
          <tr>
            <th>Routes</th>
            <td>
              <router-link :to="`/sites/${site.name}/routes`">{{ site.config.routes.length }}</router-link>
            </td>
          </tr>
          <tr>
            <th></th>
            <td>
              <button type="button">Stop</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useSelectedSite } from "@/shared/sites";
import { webserverPubSuffix } from "@/env";

ref: site = useSelectedSite();

ref: endpoint = computed(() => `https://${site.name}${webserverPubSuffix}`);
</script>

<style scoped>
th {
  font-weight: bold;
  text-align: right;
}

th:not(:empty)::after {
  content: ":";
}
</style>
