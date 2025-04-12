<template>
  <div class="mb-12 rpg-category">
    <h3 class="mb-6 text-2xl font-semibold text-center font-supreme">{{ category.title }}</h3> <!-- Changed font to Supreme -->
    <div class="items-grid">
      <!-- Loop through items within the category -->
      <!-- Emit click event with item data -->
      <RPGPortfolioItem
        v-for="item in category.items"
        :key="item.id"
        :item="item"
        @click="emitItemClick(item)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, PropType } from 'vue';
import RPGPortfolioItem from './RPGPortfolioItem.vue'; // Import the item component

// Re-defining interfaces here for clarity, or import from a shared types file
interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  icon?: string;
}

interface PortfolioCategory {
  id: number;
  title: string;
  items: PortfolioItem[];
}

// Define the props this component accepts
const props = defineProps({
  category: {
    type: Object as PropType<PortfolioCategory>,
    required: true,
  },
});

// Define emits
const emit = defineEmits(['item-clicked']);

// Function to emit the item click event
function emitItemClick(item: PortfolioItem) {
  emit('item-clicked', item);
}
</script>

<style scoped>
.rpg-category {
  /* Thematic border for the category */
  border: 2px solid #A0522D; /* Sienna border */
  border-radius: 8px; /* Slightly rounded corners */
  padding: 2rem; /* Padding inside the border */
  background-color: rgba(255, 255, 255, 0.5); /* Optional: Slight white overlay */
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive grid */
  gap: 1.5rem; /* Space between items */
}
</style>