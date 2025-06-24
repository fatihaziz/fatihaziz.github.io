<template>
  <transition name="fade-slide">
    <div v-if="loading" class="loading-screen">
      <!-- Sky Gradient Background -->
      <div class="sky-gradient"></div>

      <!-- Background floating clouds -->
      <div class="cloud-layer background-clouds">
        <div class="cloud floating-cloud floating-cloud-1"></div>
        <div class="cloud floating-cloud floating-cloud-2"></div>
        <div class="cloud floating-cloud floating-cloud-3"></div>
        <div class="cloud floating-cloud floating-cloud-4"></div>
        <div class="cloud floating-cloud floating-cloud-5"></div>
        <div class="cloud floating-cloud floating-cloud-6"></div>
        <div class="cloud floating-cloud floating-cloud-7"></div>
        <div class="cloud floating-cloud floating-cloud-8"></div>
        <div class="cloud floating-cloud floating-cloud-9"></div>
      </div>

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
  }, 6000);
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

/* Cloud Layers */
.cloud-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.background-clouds { z-index: 4; } /* Above formations (z-index: 3) */

/* Background Floating Clouds */
.cloud {
  position: absolute;
  background: white;
  border-radius: 50px;
  opacity: 0.8;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: white;
  border-radius: 50px;
}

/* Floating Cloud 1 - Large background cloud */
.floating-cloud-1 {
  width: 280px;
  height: 90px;
  top: 15%;
  left: 5%;
  animation: float-right 25s infinite linear;
}

.floating-cloud-1::before {
  width: 120px;
  height: 120px;
  top: -60px;
  left: 40px;
}

.floating-cloud-1::after {
  width: 100px;
  height: 50px;
  top: -25px;
  right: 30px;
}

/* Floating Cloud 2 - Medium background */
.floating-cloud-2 {
  width: 180px;
  height: 70px;
  top: 65%;
  right: 10%;
  animation: float-left 20s infinite linear;
}

.floating-cloud-2::before {
  width: 80px;
  height: 80px;
  top: -40px;
  left: 30px;
}

.floating-cloud-2::after {
  width: 70px;
  height: 35px;
  top: -18px;
  right: 25px;
}

/* Floating Cloud 3 - Small background */
.floating-cloud-3 {
  width: 140px;
  height: 50px;
  top: 8%;
  right: 20%;
  animation: float-right 30s infinite linear;
}

.floating-cloud-3::before {
  width: 70px;
  height: 70px;
  top: -35px;
  left: 25px;
}

.floating-cloud-3::after {
  width: 50px;
  height: 25px;
  top: -12px;
  right: 20px;
}

/* Floating Cloud 4 - Medium midground */
.floating-cloud-4 {
  width: 220px;
  height: 80px;
  top: 75%;
  left: 8%;
  animation: float-right 18s infinite linear;
}

.floating-cloud-4::before {
  width: 100px;
  height: 100px;
  top: -50px;
  left: 30px;
}

.floating-cloud-4::after {
  width: 80px;
  height: 40px;
  top: -20px;
  right: 25px;
}

/* Floating Cloud 5 - Large midground */
.floating-cloud-5 {
  width: 320px;
  height: 110px;
  top: 50%;
  right: 5%;
  animation: float-left 22s infinite linear;
}

.floating-cloud-5::before {
  width: 140px;
  height: 140px;
  top: -70px;
  left: 50px;
}

.floating-cloud-5::after {
  width: 110px;
  height: 55px;
  top: -28px;
  right: 40px;
}

/* Floating Cloud 6 - Small foreground */
.floating-cloud-6 {
  width: 160px;
  height: 60px;
  top: 70%;
  left: 20%;
  animation: float-right 15s infinite linear;
}

.floating-cloud-6::before {
  width: 80px;
  height: 80px;
  top: -40px;
  left: 20px;
}

.floating-cloud-6::after {
  width: 60px;
  height: 30px;
  top: -15px;
  right: 25px;
}

/* Floating Cloud 7 - Medium foreground */
.floating-cloud-7 {
  width: 240px;
  height: 85px;
  top: 85%;
  right: 15%;
  animation: float-left 16s infinite linear;
}

.floating-cloud-7::before {
  width: 110px;
  height: 110px;
  top: -55px;
  left: 40px;
}

.floating-cloud-7::after {
  width: 90px;
  height: 45px;
  top: -22px;
  right: 35px;
}

/* Floating Cloud 8 - Additional foreground with wiggle */
.floating-cloud-8 {
  width: 190px;
  height: 65px;
  top: 60%;
  right: 35%;
  animation: wiggle-float-right 14s infinite ease-in-out;
}

.floating-cloud-8::before {
  width: 85px;
  height: 85px;
  top: -42px;
  left: 30px;
}

.floating-cloud-8::after {
  width: 70px;
  height: 35px;
  top: -18px;
  right: 25px;
}

/* Floating Cloud 9 - Additional foreground with wiggle */
.floating-cloud-9 {
  width: 210px;
  height: 75px;
  top: 80%;
  left: 35%;
  animation: wiggle-float-left 17s infinite ease-in-out;
}

.floating-cloud-9::before {
  width: 95px;
  height: 95px;
  top: -48px;
  left: 40px;
}

.floating-cloud-9::after {
  width: 80px;
  height: 40px;
  top: -20px;
  right: 35px;
}

/* Cloud Animations */
@keyframes float-right {
  0% { transform: translateX(-150px); }
  100% { transform: translateX(calc(100vw + 150px)); }
}

@keyframes float-left {
  0% { transform: translateX(calc(100vw + 150px)); }
  100% { transform: translateX(-150px); }
}

/* Wiggling Animations for variety */
@keyframes wiggle-float-right {
  0% {
    transform: translateX(-150px) translateY(0px);
  }
  25% {
    transform: translateX(25vw) translateY(-8px);
  }
  50% {
    transform: translateX(50vw) translateY(5px);
  }
  75% {
    transform: translateX(75vw) translateY(-3px);
  }
  100% {
    transform: translateX(calc(100vw + 150px)) translateY(0px);
  }
}

@keyframes wiggle-float-left {
  0% {
    transform: translateX(calc(100vw + 150px)) translateY(0px);
  }
  25% {
    transform: translateX(75vw) translateY(6px);
  }
  50% {
    transform: translateX(50vw) translateY(-4px);
  }
  75% {
    transform: translateX(25vw) translateY(7px);
  }
  100% {
    transform: translateX(-150px) translateY(0px);
  }
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
