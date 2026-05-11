<template>
  <div class="village-page">
    <TownSquare />
    <nav class="village-nav" data-testid="village-nav">
      <NuxtLink to="/" class="nav-link">&larr; Back to classic hero</NuxtLink>
      <span class="nav-tagline">RPG mode (Chapter I)</span>
    </nav>
  </div>
</template>

<script setup lang="ts">
import TownSquare from '~/components/TownSquare.vue'

useHead({
  title: 'Fatih\'s Village - RPG Portfolio',
  meta: [
    { name: 'description', content: 'Welcome home adventurer! Explore Fatih\'s RPG village portfolio.' }
  ]
})
</script>

<style scoped>
.village-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.village-nav {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 14px;
  background: rgba(245, 245, 220, 0.85);
  border: 2px solid #A0522D;
  border-radius: 8px;
  backdrop-filter: blur(4px);
  font-family: 'Mangiola', serif;
  color: #5D4037;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
}

.nav-link {
  color: #5D4037;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #A0522D;
}

.nav-tagline {
  font-size: 11px;
  opacity: 0.7;
  font-style: italic;
}
</style>
