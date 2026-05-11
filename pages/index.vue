<template>
  <div class="redirect-screen">
    <p class="line">wandering to Aetherveil...</p>
    <p class="hint">if you are not redirected automatically,
      <NuxtLink to="/aetherveil">enter the valley</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

useHead({
  title: 'fatihaziz.com',
})

onMounted(() => {
  navigateTo('/aetherveil', { replace: true })
})
</script>

<style scoped>
.redirect-screen {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #355c3c;
  color: #f5e1b6;
  font-family: monospace;
  gap: 12px;
}

.line {
  font-size: 22px;
  letter-spacing: 2px;
}

.hint {
  font-size: 13px;
  opacity: 0.7;
}

.hint a {
  color: #f7e08a;
  text-decoration: underline;
}
</style>
