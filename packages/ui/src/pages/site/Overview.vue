<template>
  <div class="content-wrapper">
    <div class="card">
      <table>
        <tbody>
          <tr>
            <th>{{ $t("overview.label.status") }}</th>
            <td>{{ $t("overview.status.running") }}</td>
          </tr>
          <tr>
            <th>{{ $t("overview.label.endpoint") }}</th>
            <td>
              <a :href="endpoint" target="_blank" rel="noopener noreferrer nofollow">{{ endpoint }}</a>
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
