<template>
  <div class="home">
    <div class="guide">
      Select a site, or
      <router-link to="/create/site">create a new one</router-link>.
    </div>
  </div>
</template>

<style scoped>
.home {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  user-select: contain;
}

.guide {
  font-size: 1.5rem;
}
</style>
