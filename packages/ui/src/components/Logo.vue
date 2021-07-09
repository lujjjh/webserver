<template>
  <div class="logo">
    <img :src="logo" width="98" height="17" />
    <span>alpha</span>
  </div>
</template>

<script lang="ts" setup>
import logo from "@/images/logo.svg";
</script>

<style scoped>
.logo {
  display: inline-block;
  position: relative;
}

img {
  padding: 10px;
}

span {
  color: #ca0812;
  font-size: 10px;
  text-transform: uppercase;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
