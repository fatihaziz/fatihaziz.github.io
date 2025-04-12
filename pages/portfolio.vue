<template>
  <div class="portfolio-page">
    <h1 class="portfolio-title">Portfolio Details</h1>
    <div class="portfolio-content">
      <!-- Example content, replace with dynamic data as needed -->
      <div class="portfolio-item" v-for="item in portfolioDetails" :key="item.id">
        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>
        <img :src="item.image" alt="Portfolio Image" class="portfolio-image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const portfolioDetails = ref([
  { id: 1, title: 'Project A', description: 'Detailed description of Project A.', image: '~/assets/img/project_a.jpg' },
  { id: 2, title: 'Project B', description: 'Detailed description of Project B.', image: '~/assets/img/project_b.jpg' },
  // Add more items as needed
]);
</script>

<style scoped>
.portfolio-page {
  padding: 2rem;
  background-color: #fff;
}

.portfolio-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.portfolio-content {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.portfolio-item {
  flex: 1 1 calc(50% - 1rem);
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.portfolio-image {
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
}

@media (max-width: 768px) {
  .portfolio-item {
    flex: 1 1 calc(100% - 1rem);
  }
}
</style>