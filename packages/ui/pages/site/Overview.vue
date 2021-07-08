<template>
  <div class="content-wrapper">
    <div class="card">
      <table>
        <tbody>
          <tr>
            <th>{{ t("overview.status") }}</th>
            <td>{{ t("status.running") }}</td>
          </tr>
          <tr>
            <th>{{ t("overview.endpoint") }}</th>
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
import { useI18n } from "vue-i18n";
import { useSelectedSite } from "@/shared/sites";
import { webserverPubSuffix } from "@/env";

ref: ({ t } = useI18n());

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
