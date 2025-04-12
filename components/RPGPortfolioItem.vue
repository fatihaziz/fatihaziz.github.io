<template>
  <div class="p-4 transition-shadow duration-300 bg-white border border-gray-200 rounded-lg shadow-sm rpg-item hover:shadow-md" @click="$emit('click')"> <!-- Added click emitter -->
    <!-- Icon can be added here if available -->
    <!-- <div v-if="item.icon" class="mb-2 text-2xl">{{ item.icon }}</div> -->
    <h4 class="mb-2 text-lg font-semibold font-supreme">{{ item.title }}</h4>
    <p class="text-sm text-gray-600">{{ item.description }}</p>
    <!-- Add click handler later for detail view (Subtask 3.3) -->
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, PropType } from 'vue';

// Re-defining interface or import from shared types
interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  icon?: string;
}

// Define the props this component accepts
const props = defineProps({
  item: {
    type: Object as PropType<PortfolioItem>,
    required: true,
  },
});

// Define emits (only 'click' is needed for this simple case)
const emit = defineEmits(['click']);
</script>

<style scoped>
.rpg-item {
  cursor: pointer; /* Indicate it's clickable */
  /* Add any specific non-Tailwind styles here */
}
</style>