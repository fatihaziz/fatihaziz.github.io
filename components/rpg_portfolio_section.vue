<template>
  <section class="rpg-section">
    <h2 class="rpg-title">RPG Portfolio</h2>
    <div class="rpg-content">
      <!-- Example content, replace with dynamic data as needed -->
      <transition-group name="fade" tag="div" class="rpg-content">
        <div class="rpg-item" v-for="item in portfolioItems" :key="item.id">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </transition-group>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const portfolioItems = ref([
  { id: 1, title: 'Workshop', description: 'Crafting and creating amazing projects.' },
  { id: 2, title: 'Swordmaster', description: 'Mastering the art of coding and development.' },
  // Add more items as needed
]);
</script>

<style scoped>
.rpg-section {
  padding: 2rem;
  background-color: #f0f0f0;
  border-top: 1px solid #ccc;
}

.rpg-title {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.rpg-content {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.rpg-item {
  flex: 1 1 calc(33.333% - 1rem);
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
  background-color: #fff;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .rpg-item {
    flex: 1 1 calc(100% - 1rem);
  }
}
</style>