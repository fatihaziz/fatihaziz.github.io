<template>
  <section class="py-16 rpg-section bg-[#F5F5DC]"> <!-- Beige/Parchment Background -->
    <div class="container px-4 mx-auto">
      <h2 class="mb-12 text-4xl font-bold text-center rpg-title font-mondapick">Adventurer's Guild</h2>
      <div class="categories-container">
        <!-- Listen for item clicks from category -->
        <RPGPortfolioCategory
          v-for="category in portfolioCategories"
          :key="category.id"
          :category="category"
          @item-clicked="openModal"
        />
      </div>
    </div>

    <!-- Modal Component -->
    <PortfolioDetailModal
      :show="isModalVisible"
      :item="selectedItem"
      @close="closeModal"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PortfolioDetailModal from './PortfolioDetailModal.vue'; // Import the modal
import RPGPortfolioCategory from './RPGPortfolioCategory.vue';

// Define interfaces
interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  icon?: string;
  // Add other potential fields
}

interface PortfolioCategory {
  id: number;
  title: string; // e.g., 'Workshop', 'Skills Forge'
  items: PortfolioItem[];
}

// Updated data structure for categories and items
const portfolioCategories = ref<PortfolioCategory[]>([
  {
    id: 1,
    title: 'Workshop (Projects)',
    items: [
      { id: 101, title: 'Project Alpha', description: 'A revolutionary web app.', icon: 'hammer' },
      { id: 102, title: 'Project Beta', description: 'AI-powered data analysis tool.', icon: 'brain' },
      // Add more projects
    ]
  },
  {
    id: 2,
    title: 'Skills Forge (Languages & Tools)',
    items: [
      { id: 201, title: 'Go', description: 'Backend development', icon: 'golang' },
      { id: 202, title: 'Rust', description: 'Systems programming', icon: 'rust' },
      { id: 203, title: 'TypeScript', description: 'Frontend & Backend', icon: 'typescript' },
      { id: 204, title: 'Vue/Nuxt', description: 'Frontend framework', icon: 'vue' },
      { id: 205, title: 'Docker', description: 'Containerization', icon: 'docker' },
      // Add more skills/tools
    ]
  },
  {
    id: 3,
    title: 'Guild Hall (Contributions)',
    items: [
       { id: 301, title: 'Open Source Lib X', description: 'Contributed feature Y.', icon: 'git-pull-request' },
       // Add more contributions
    ]
  }
  // Add more categories as needed
]);

// State for modal
const isModalVisible = ref(false);
const selectedItem = ref<PortfolioItem | null>(null);

// Function to open the modal with the selected item
function openModal(item: PortfolioItem) {
  selectedItem.value = item;
  isModalVisible.value = true;
}

// Function to close the modal
function closeModal() {
  isModalVisible.value = false;
  selectedItem.value = null; // Clear selected item
}
</script>

<style scoped>
.rpg-section {
  /* Tailwind class bg-[#F5F5DC] applied above */
  /* Consider adding a subtle background-image texture later for better parchment effect */
}

/* .rpg-title styling adjusted via Tailwind classes */

/* Removed old .rpg-content and .rpg-item styles. These will be handled in RPGPortfolioCategory and RPGPortfolioItem */

.categories-container {
  /* Add styling for the category container if needed, e.g., grid layout */
  display: flex;
  flex-direction: column;
  gap: 2rem; /* Space between categories */
}

/* Removed transition styles, can be added back if needed */
</style>