<template>
   <transition name="fade-slide" @after-leave="$emit('loading-finished')">
    <div v-if="loading" class="relative flex items-center justify-center w-screen h-screen bg-rose-300">
      <div class="flex flex-col items-center justify-center">
        <div class="relative flex items-center justify-center mb-4">
          <div class="absolute border-t-8 border-b-8 border-white rounded-full w-36 h-36 animate-spin"></div>
          <img src="~/assets/img/logo_1.jpeg" class="rounded-full h-28 w-28">
        </div>
        <p class="mt-4 text-3xl text-white font-juliett">Loading...</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const loading = ref(true);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1750);
});
</script>

<style scoped>
  .fade-slide-enter-active, .fade-slide-leave-active {
    transition: transform 0.314s ease-in-out, opacity 0.314s ease-in-out;
  }
  .fade-slide-enter, .fade-slide-leave-to {
    transform: translateY(0);
    opacity: 1;
  }
  .fade-slide-leave-active {
    transform: translateY(-100%);
    opacity: 0;
  }
</style>