<template>
  <NuxtLink v-if="show" to="/" class="back-link" aria-label="Back to village">
    <span class="arrow">&larr;</span>
    <span class="text">Village</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const buildingRoutes = ['/workbench', '/armory', '/codex', '/hearth', '/beacon', '/dream']
const show = computed(() => buildingRoutes.includes(route.path))
</script>

<style scoped>
.back-link {
  position: fixed;
  top: 20px;
  right: 24px;
  z-index: 100;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(20, 14, 8, 0.55);
  border: 1px solid rgba(245, 229, 197, 0.4);
  border-radius: 999px;
  font-family: 'Mangiola', serif;
  font-size: 14px;
  color: #F5E5C5;
  text-decoration: none;
  backdrop-filter: blur(6px);
  transition: background 0.2s, transform 0.2s;
}

.back-link:hover {
  background: rgba(40, 28, 16, 0.7);
  transform: translateY(-1px);
}

.arrow {
  font-size: 16px;
  line-height: 1;
}
</style>
