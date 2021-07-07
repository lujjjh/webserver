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
              <a href="https://localhost.webserver.run" target="_blank" rel="noopener noreferrer nofollow"
                >https://localhost.webserver.run</a
              >
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
import { useSelectedSite } from "@/shared/sites";

ref: site = useSelectedSite()!;
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
