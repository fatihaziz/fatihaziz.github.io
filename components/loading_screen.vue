<template>
  <transition name="fade-slide">
    <div v-if="loading" class="loading-screen">
      <!-- Sky Gradient Background -->
      <div class="sky-gradient"></div>

      <!-- Cloud Formations Component -->
      <CloudFormation />

      <!-- Loading Content -->
      <div class="loading-content">
        <div class="village-portal">
          <div class="portal-ring"></div>
          <div class="portal-center">
            <img src="~/assets/img/logo_1.jpeg" class="logo">
          </div>
        </div>
        <div class="loading-messages">
          <p class="loading-text">{{ currentMessage }}</p>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import CloudFormation from './CloudFormation.vue';

const loading = ref(true);
const progress = ref(0);
const currentMessage = ref('');

const loadingMessages = [
  "Preparing your adventure...",
  "Summoning the village...",
  "Gathering the clouds...",
  "Enchanting the buildings...",
  "Awakening the NPCs...",
  "Polishing the treasures...",
  "Opening the guild doors...",
  "Welcome home, adventurer!"
];

let messageIndex = 0;
let progressInterval: NodeJS.Timeout;
let messageInterval: NodeJS.Timeout;

onMounted(() => {
  currentMessage.value = loadingMessages[0];

  // Progress animation
  progressInterval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += Math.random() * 15 + 5; // Random progress chunks
      if (progress.value > 100) progress.value = 100;
    }
  }, 200);

  // Message cycling
  messageInterval = setInterval(() => {
    if (messageIndex < loadingMessages.length - 1) {
      messageIndex++;
      currentMessage.value = loadingMessages[messageIndex];
    }
  }, 800);

  // Complete loading
  setTimeout(() => {
    progress.value = 100;
    currentMessage.value = loadingMessages[loadingMessages.length - 1];

    setTimeout(() => {
      loading.value = false;
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    }, 1000);
  }, 15000);
});
</script>
<style scoped>
/* Loading Screen Container */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Sky Background */
.sky-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg,
    #87CEEB 0%,    /* Sky blue */
    #98D8E8 30%,   /* Light blue */
    #B0E0E6 60%,   /* Powder blue */
    #F0F8FF 100%   /* Alice blue */
  );
  z-index: 1;
}


/* Loading Content */
.loading-content {
  position: relative;
  z-index: 20; /* Well above all clouds */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Village Portal Effect */
.village-portal {
  position: relative;
  margin-bottom: 2rem;
}

.portal-ring {
  position: absolute;
  width: 140px;
  height: 140px;
  border: 4px solid rgba(255, 255, 255, 0.6);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: portal-spin 2s linear infinite;
  top: -10px;
  left: -10px;
}

.portal-center {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
}

.logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
}

/* Loading Messages */
.loading-messages {
  max-width: 300px;
}

.loading-text {
  font-size: 1.5rem;
  color: white;
  font-family: 'Juliett', sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
  min-height: 2rem;
}

/* Progress Bar */
.progress-bar {
  width: 250px;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD700, #FFA500, #FFD700);
  border-radius: 4px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
}

/* Portal Animation */
@keyframes portal-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Fade Slide Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 1.5s cubic-bezier(0.4, 0.25, 0.14, 1);
}

.fade-slide-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.fade-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .loading-text {
    font-size: 1.25rem;
  }

  .portal-ring,
  .portal-center {
    width: 100px;
    height: 100px;
  }

  .portal-ring {
    top: -8px;
    left: -8px;
  }

  .logo {
    width: 60px;
    height: 60px;
  }

  .progress-bar {
    width: 200px;
  }
}
</style>
