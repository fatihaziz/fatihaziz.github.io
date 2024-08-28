<!-- <template>
  <div class="h-screen">
    <Loading_screen @loading-finished="showContent"/>
    <div :class="{ 'opacity-0': !contentVisible }" class="transition-opacity duration-500">
      <NuxtLoadingIndicator v-if="!contentVisible" />
      <NuxtLayout v-if="contentVisible">
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template> -->

<template>
  <div class="h-screen">
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