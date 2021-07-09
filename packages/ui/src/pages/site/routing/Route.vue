<template>
  {{ JSON.stringify(props.route) }}
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { Route } from "@webserver/core";

const props = defineProps<{ route: Route }>();
</script>
