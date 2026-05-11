<template>
  <div v-if="label" class="route-crumb">
    <span class="crumb-label">{{ label }}</span>
    <span v-if="blurb" class="crumb-blurb">{{ blurb }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSceneRoutes } from '~/composables/useSceneRoutes'

const route = useRoute()
const { findByRoute } = useSceneRoutes()
const current = computed(() => findByRoute(route.path))
const label = computed(() => current.value?.label ?? '')
const blurb = computed(() => current.value?.blurb ?? '')
</script>

<style scoped>
.route-crumb {
  position: fixed;
  top: 20px;
  left: 24px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  font-family: 'Mangiola', serif;
  color: #F5E5C5;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
  pointer-events: none;
  user-select: none;
}

.crumb-label {
  font-size: 22px;
  letter-spacing: 1px;
  line-height: 1;
}

.crumb-blurb {
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.7;
  margin-top: 2px;
}
</style>
