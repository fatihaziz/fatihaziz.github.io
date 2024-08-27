<template>
  <transition name="fade-slide">
    <div v-if="loading" class="loading-screen bg-rose-300">
      <div class="loading-content">
        <div class="spinner-container">
          <div class="spinner"></div>
          <img src="~/assets/img/logo_1.jpeg" class="logo">
        </div>
        <p class="loading-text">Loading...</p>
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
  }, 1314); // Total timeout of 5 seconds - 3 seconds delay + 2 seconds buffer
});
</script>
<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem; /* Equivalent to mb-4 */
}

.spinner {
  position: absolute;
  border-top: 8px solid white;
  border-bottom: 8px solid white;
  border-radius: 50%;
  width: 9rem; /* Equivalent to w-36 */
  height: 9rem; /* Equivalent to h-36 */
  animation: spin 1s linear infinite; /* animate-spin */
}

.logo {
  border-radius: 50%;
  width: 7rem; /* Equivalent to w-28 */
  height: 7rem; /* Equivalent to h-28 */
}

.loading-text {
  margin-top: 1rem; /* Equivalent to mt-4 */
  font-size: 1.875rem; /* Equivalent to text-3xl */
  color: white;
  font-family: 'Juliett', sans-serif; /* Assuming you have this font */
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 2.314s cubic-bezier(0.4, 0.25, 0.14, 1.5);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
