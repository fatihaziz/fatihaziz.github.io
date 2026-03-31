<template>
  <nav class="dots" role="tablist" aria-label="Page navigation">
    <button
      v-for="i in total"
      :key="i"
      class="dot"
      :class="{ active: i - 1 === current }"
      role="tab"
      :aria-selected="i - 1 === current"
      :aria-label="`Go to page ${i}`"
      @click="$emit('goTo', i - 1)"
    />
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  current: number
  total: number
}>()

defineEmits<{
  goTo: [index: number]
}>()
</script>

<style scoped>
.dots {
  position: fixed;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 100;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
  border: none;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #b0a898;
  opacity: 0.5;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  padding: 0;
  outline: none;
}

.dot:focus-visible {
  outline: 2px solid #96751a;
  outline-offset: 2px;
}

.dot.active {
  background: #96751a;
  opacity: 1;
  transform: scale(1.3);
}
</style>
