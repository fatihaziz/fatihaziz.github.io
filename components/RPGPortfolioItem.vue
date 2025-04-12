<template>
  <div class="p-4 transition-colors duration-200 bg-[#FDFBF5] border-2 border-[#A0522D] rounded-lg shadow-sm rpg-item hover:bg-[#F5F5DC] hover:border-[#793D22]" @click="$emit('click')"> <!-- RPG Item Styling -->
    <!-- Display Icon Name (replace with actual icon later) -->
    <div v-if="item.icon" class="mb-2 text-xs text-[#A0522D] font-mono">[ICON: {{ item.icon }}]</div>
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