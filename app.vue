<template>
  <div class="min-h-screen">
    <Loading_screen class="z-50" />
    <NuxtLoadingIndicator />
    <NuxtLayout >
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import Loading_screen from './components/loading_screen.vue';

</script>

<script lang="ts">

</script>

<style scoped>
/* Add any additional styles here if necessary */
</style>