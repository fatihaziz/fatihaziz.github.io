
<template>
  <div class="h-screen">
    <LoadingScreen @loading-finished="showContent"/>
    <div :class="{ 'opacity-0': !contentVisible }" class="transition-opacity duration-500">
      <NuxtLoadingIndicator v-if="!contentVisible" />
      <NuxtLayout v-if="contentVisible">
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Loading_screen from './components/loading_screen.vue';

const contentVisible = ref(false);

const showContent = () => {
  contentVisible.value = true;
};
</script>

<style scoped>
/* Add any additional styles here if necessary */
</style>