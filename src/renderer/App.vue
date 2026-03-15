<template>
  <div class="app">
    <NavBar />
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<style lang="scss" scoped>

</style>
