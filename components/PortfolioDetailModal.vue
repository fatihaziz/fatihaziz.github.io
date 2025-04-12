<template>
  <transition name="modal-fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" @click.self="closeModal">
      <div class="w-full max-w-lg p-6 mx-4 bg-[#F5F5DC] border-2 border-[#A0522D] rounded-lg shadow-xl modal-content"> <!-- Themed background and border -->
        <div class="flex items-start justify-between mb-4">
          <h3 class="text-2xl font-semibold font-supreme text-[#5D4037]">{{ item?.title }}</h3> <!-- Darker brown title -->
          <button @click="closeModal" class="text-[#A0522D] hover:text-[#793D22] text-2xl font-bold">&times;</button> <!-- Themed close 'X' -->
        </div>
        <div class="modal-body">
          <!-- Display item details here -->
          <p class="text-[#5D4037]">{{ item?.description }}</p> <!-- Darker brown text -->
          <!-- Add more details as needed: images, links, tech stack etc. -->
          <p class="mt-4 text-sm text-[#A0522D]">Item ID: {{ item?.id }}</p> <!-- Sienna accent text -->
        </div>
        <div class="mt-6 text-right">
          <button @click="closeModal" class="px-4 py-2 text-sm font-medium text-[#A0522D] bg-transparent border border-[#A0522D] rounded hover:bg-[#A0522D] hover:text-[#F5F5DC]">
            Close
          </button> <!-- Themed Close Button -->
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, PropType } from 'vue';

// Interface for the item prop
interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  icon?: string;
  // Add other potential fields like imageUrl, projectUrl, techStack: string[] etc.
}

// Props definition
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  item: {
    type: Object as PropType<PortfolioItem | null>, // Allow null when no item is selected
    required: false, // Make it not required initially
    default: null,
  },
});

// Emits definition
const emit = defineEmits(['close']);

// Method to emit the close event
function closeModal() {
  emit('close');
}
</script>

<style scoped>
.modal-content {
  max-height: 80vh;
  overflow-y: auto;
}

/* Basic fade transition for the modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>