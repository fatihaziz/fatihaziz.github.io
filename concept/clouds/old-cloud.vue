<template>
  <transition name="fade-slide">
    <div v-if="loading" class="loading-screen">
      <!-- Sky Gradient Background -->
      <div class="sky-gradient"></div>

      <!-- Parallax Cloud Layers -->
      <!-- Background tiny clouds -->
      <div class="cloud-layer cloud-layer-bg">
        <div class="cloud tiny-cloud tiny-cloud-1"></div>
        <div class="cloud tiny-cloud tiny-cloud-2"></div>
        <div class="cloud tiny-cloud tiny-cloud-3"></div>
        <div class="cloud tiny-cloud tiny-cloud-4"></div>
        <div class="cloud tiny-cloud tiny-cloud-5"></div>
        <div class="cloud tiny-cloud tiny-cloud-6"></div>
      </div>

      <!-- Far background clouds -->
      <div class="cloud-layer cloud-layer-1">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
      </div>

      <!-- Big chunky cloud formations behind logo -->
      <div class="cloud-layer cloud-layer-chunks">
        <!-- Left cloud formation - multiple clouds stacked -->
        <div class="cloud-formation cloud-formation-left">
          <div class="cloud chunky-cloud chunky-left-1"></div>
          <div class="cloud chunky-cloud chunky-left-2"></div>
          <div class="cloud chunky-cloud chunky-left-3"></div>
          <div class="cloud chunky-cloud chunky-left-4"></div>
          <div class="cloud chunky-cloud chunky-left-5"></div>
        </div>

        <!-- Right cloud formation - multiple clouds stacked -->
        <div class="cloud-formation cloud-formation-right">
          <div class="cloud chunky-cloud chunky-right-1"></div>
          <div class="cloud chunky-cloud chunky-right-2"></div>
          <div class="cloud chunky-cloud chunky-right-3"></div>
          <div class="cloud chunky-cloud chunky-right-4"></div>
          <div class="cloud chunky-cloud chunky-right-5"></div>
        </div>

        <!-- Top scattered clouds -->
        <div class="cloud chunky-cloud chunky-top-1"></div>
        <div class="cloud chunky-cloud chunky-top-2"></div>
      </div>

      <!-- Mid-layer clouds -->
      <div class="cloud-layer cloud-layer-2">
        <div class="cloud cloud-4"></div>
        <div class="cloud cloud-5"></div>
      </div>

      <!-- Foreground clouds -->
      <div class="cloud-layer cloud-layer-3">
        <div class="cloud cloud-6"></div>
        <div class="cloud cloud-7"></div>
        <div class="cloud cloud-8"></div>
        <div class="cloud cloud-9"></div>
      </div>

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

.cloud-layer-bg { z-index: 1; }
.cloud-layer-1 { z-index: 2; }
.cloud-layer-chunks { z-index: 5; }
.cloud-layer-2 { z-index: 6; }
.cloud-layer-3 { z-index: 7; }

/* Individual Clouds */
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

/* Cloud 1 - Large background */
.cloud-1 {
  width: 280px;
  height: 90px;
  top: 15%;
  left: 5%;
  animation: float-right 25s infinite linear;
}

.cloud-1::before {
  width: 120px;
  height: 120px;
  top: -60px;
  left: 40px;
}

.cloud-1::after {
  width: 100px;
  height: 50px;
  top: -25px;
  right: 30px;
}

/* Cloud 2 - Medium background */
.cloud-2 {
  width: 180px;
  height: 70px;
  top: 65%;
  right: 10%;
  animation: float-left 20s infinite linear;
}

.cloud-2::before {
  width: 80px;
  height: 80px;
  top: -40px;
  left: 30px;
}

.cloud-2::after {
  width: 70px;
  height: 35px;
  top: -18px;
  right: 25px;
}

/* Cloud 3 - Small background */
.cloud-3 {
  width: 140px;
  height: 50px;
  top: 8%;
  right: 20%;
  animation: float-right 30s infinite linear;
}

.cloud-3::before {
  width: 70px;
  height: 70px;
  top: -35px;
  left: 25px;
}

.cloud-3::after {
  width: 50px;
  height: 25px;
  top: -12px;
  right: 20px;
}

/* Cloud 4 - Medium midground */
.cloud-4 {
  width: 220px;
  height: 80px;
  top: 75%;
  left: 8%;
  animation: float-right 18s infinite linear;
}

.cloud-4::before {
  width: 100px;
  height: 100px;
  top: -50px;
  left: 30px;
}

.cloud-4::after {
  width: 80px;
  height: 40px;
  top: -20px;
  right: 25px;
}

/* Cloud 5 - Large midground */
.cloud-5 {
  width: 320px;
  height: 110px;
  top: 50%;
  right: 5%;
  animation: float-left 22s infinite linear;
}

.cloud-5::before {
  width: 140px;
  height: 140px;
  top: -70px;
  left: 50px;
}

.cloud-5::after {
  width: 110px;
  height: 55px;
  top: -28px;
  right: 40px;
}

/* Cloud 6 - Small foreground */
.cloud-6 {
  width: 160px;
  height: 60px;
  top: 70%;
  left: 20%;
  animation: float-right 15s infinite linear;
}

.cloud-6::before {
  width: 80px;
  height: 80px;
  top: -40px;
  left: 20px;
}

.cloud-6::after {
  width: 60px;
  height: 30px;
  top: -15px;
  right: 25px;
}

/* Cloud 7 - Medium foreground */
.cloud-7 {
  width: 240px;
  height: 85px;
  top: 85%;
  right: 15%;
  animation: float-left 16s infinite linear;
}

.cloud-7::before {
  width: 110px;
  height: 110px;
  top: -55px;
  left: 40px;
}

.cloud-7::after {
  width: 90px;
  height: 45px;
  top: -22px;
  right: 35px;
}

/* Cloud 8 - Additional foreground */
.cloud-8 {
  width: 190px;
  height: 65px;
  top: 60%;
  right: 35%;
  animation: wiggle-float-right 14s infinite ease-in-out;
}

.cloud-8::before {
  width: 85px;
  height: 85px;
  top: -42px;
  left: 30px;
}

.cloud-8::after {
  width: 70px;
  height: 35px;
  top: -18px;
  right: 25px;
}

/* Cloud 9 - Additional foreground */
.cloud-9 {
  width: 210px;
  height: 75px;
  top: 80%;
  left: 35%;
  animation: wiggle-float-left 17s infinite ease-in-out;
}

.cloud-9::before {
  width: 95px;
  height: 95px;
  top: -48px;
  left: 40px;
}

.cloud-9::after {
  width: 80px;
  height: 40px;
  top: -20px;
  right: 35px;
}

/* Tiny Background Clouds */
.tiny-cloud {
  opacity: 0.4;
  background: rgba(255, 255, 255, 0.6);
}

.tiny-cloud-1 {
  width: 25px;
  height: 10px;
  top: 10%;
  left: 25%;
  animation: tiny-wiggle 35s infinite ease-in-out;
}

.tiny-cloud-2 {
  width: 20px;
  height: 8px;
  top: 30%;
  right: 35%;
  animation: tiny-wiggle-reverse 40s infinite ease-in-out;
}

.tiny-cloud-3 {
  width: 30px;
  height: 12px;
  top: 50%;
  left: 15%;
  animation: tiny-wiggle 45s infinite ease-in-out;
}

.tiny-cloud-4 {
  width: 18px;
  height: 7px;
  top: 20%;
  right: 15%;
  animation: tiny-wiggle-reverse 38s infinite ease-in-out;
}

.tiny-cloud-5 {
  width: 22px;
  height: 9px;
  top: 75%;
  left: 60%;
  animation: tiny-wiggle 42s infinite ease-in-out;
}

.tiny-cloud-6 {
  width: 28px;
  height: 11px;
  top: 85%;
  right: 25%;
  animation: tiny-wiggle-reverse 36s infinite ease-in-out;
}

/* Cloud Formations - Stationary composite clouds */
.cloud-formation {
  position: relative;
  width: 100%;
  height: 100%;
}

.cloud-formation-left {
  animation: gentle-sway-left 25s infinite ease-in-out;
}

.cloud-formation-right {
  animation: gentle-sway-right 30s infinite ease-in-out;
}

/* Base chunky cloud style */
.chunky-cloud {
  background: rgba(220, 220, 220, 0.7);
  opacity: 0.6;
}

/* Left Formation Clouds */
.chunky-left-1 {
  width: 300px;
  height: 120px;
  top: 20%;
  left: -15%;
  animation: subtle-wiggle-1 20s infinite ease-in-out;
}

.chunky-left-1::before {
  width: 140px;
  height: 140px;
  top: -70px;
  left: 50px;
  background: rgba(200, 200, 200, 0.8);
}

.chunky-left-1::after {
  width: 110px;
  height: 60px;
  top: -30px;
  right: 30px;
  background: rgba(210, 210, 210, 0.7);
}

.chunky-left-2 {
  width: 250px;
  height: 100px;
  top: 35%;
  left: -10%;
  animation: subtle-wiggle-2 18s infinite ease-in-out;
}

.chunky-left-2::before {
  width: 120px;
  height: 120px;
  top: -60px;
  left: 40px;
  background: rgba(190, 190, 190, 0.8);
}

.chunky-left-2::after {
  width: 90px;
  height: 50px;
  top: -25px;
  right: 20px;
  background: rgba(205, 205, 205, 0.7);
}

.chunky-left-3 {
  width: 320px;
  height: 140px;
  top: 50%;
  left: -20%;
  animation: subtle-wiggle-3 22s infinite ease-in-out;
}

.chunky-left-3::before {
  width: 160px;
  height: 160px;
  top: -80px;
  left: 60px;
  background: rgba(185, 185, 185, 0.8);
}

.chunky-left-3::after {
  width: 130px;
  height: 70px;
  top: -35px;
  right: 40px;
  background: rgba(200, 200, 200, 0.7);
}

.chunky-left-4 {
  width: 180px;
  height: 80px;
  top: 68%;
  left: -5%;
  animation: subtle-wiggle-4 16s infinite ease-in-out;
}

.chunky-left-4::before {
  width: 90px;
  height: 90px;
  top: -45px;
  left: 30px;
  background: rgba(195, 195, 195, 0.7);
}

.chunky-left-5 {
  width: 220px;
  height: 90px;
  top: 80%;
  left: -12%;
  animation: subtle-wiggle-5 24s infinite ease-in-out;
}

.chunky-left-5::before {
  width: 110px;
  height: 110px;
  top: -55px;
  left: 40px;
  background: rgba(180, 180, 180, 0.7);
}

.chunky-left-5::after {
  width: 80px;
  height: 45px;
  top: -22px;
  right: 25px;
  background: rgba(190, 190, 190, 0.6);
}

/* Right Formation Clouds */
.chunky-right-1 {
  width: 280px;
  height: 110px;
  top: 15%;
  right: -12%;
  animation: subtle-wiggle-6 21s infinite ease-in-out;
}

.chunky-right-1::before {
  width: 130px;
  height: 130px;
  top: -65px;
  left: 50px;
  background: rgba(205, 205, 205, 0.8);
}

.chunky-right-1::after {
  width: 100px;
  height: 55px;
  top: -28px;
  right: 30px;
  background: rgba(215, 215, 215, 0.7);
}

.chunky-right-2 {
  width: 350px;
  height: 150px;
  top: 30%;
  right: -18%;
  animation: subtle-wiggle-7 19s infinite ease-in-out;
}

.chunky-right-2::before {
  width: 170px;
  height: 170px;
  top: -85px;
  left: 70px;
  background: rgba(190, 190, 190, 0.8);
}

.chunky-right-2::after {
  width: 140px;
  height: 80px;
  top: -40px;
  right: 50px;
  background: rgba(200, 200, 200, 0.7);
}

.chunky-right-3 {
  width: 300px;
  height: 130px;
  top: 50%;
  right: -15%;
  animation: subtle-wiggle-8 23s infinite ease-in-out;
}

.chunky-right-3::before {
  width: 150px;
  height: 150px;
  top: -75px;
  left: 60px;
  background: rgba(185, 185, 185, 0.8);
}

.chunky-right-3::after {
  width: 120px;
  height: 65px;
  top: -32px;
  right: 40px;
  background: rgba(195, 195, 195, 0.7);
}

.chunky-right-4 {
  width: 240px;
  height: 100px;
  top: 70%;
  right: -8%;
  animation: subtle-wiggle-9 17s infinite ease-in-out;
}

.chunky-right-4::before {
  width: 120px;
  height: 120px;
  top: -60px;
  left: 50px;
  background: rgba(180, 180, 180, 0.7);
}

.chunky-right-5 {
  width: 200px;
  height: 85px;
  top: 85%;
  right: -10%;
  animation: subtle-wiggle-10 26s infinite ease-in-out;
}

.chunky-right-5::before {
  width: 100px;
  height: 100px;
  top: -50px;
  left: 40px;
  background: rgba(175, 175, 175, 0.7);
}

.chunky-right-5::after {
  width: 75px;
  height: 40px;
  top: -20px;
  right: 20px;
  background: rgba(185, 185, 185, 0.6);
}

/* Top scattered clouds */
.chunky-top-1 {
  width: 200px;
  height: 80px;
  top: 8%;
  left: 25%;
  animation: subtle-wiggle-11 20s infinite ease-in-out;
}

.chunky-top-1::before {
  width: 100px;
  height: 100px;
  top: -50px;
  left: 40px;
  background: rgba(190, 190, 190, 0.6);
}

.chunky-top-2 {
  width: 180px;
  height: 70px;
  top: 12%;
  right: 30%;
  animation: subtle-wiggle-12 24s infinite ease-in-out;
}

.chunky-top-2::before {
  width: 90px;
  height: 90px;
  top: -45px;
  left: 35px;
  background: rgba(185, 185, 185, 0.6);
}

.chunky-top-2::after {
  width: 70px;
  height: 35px;
  top: -18px;
  right: 25px;
  background: rgba(195, 195, 195, 0.5);
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

/* Wiggling Animations */
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

/* Tiny Cloud Wiggling */
@keyframes tiny-wiggle {
  0%, 100% {
    transform: translateX(0px) translateY(0px) scale(1);
  }
  25% {
    transform: translateX(3px) translateY(-2px) scale(1.05);
  }
  50% {
    transform: translateX(-2px) translateY(3px) scale(0.95);
  }
  75% {
    transform: translateX(4px) translateY(1px) scale(1.02);
  }
}

@keyframes tiny-wiggle-reverse {
  0%, 100% {
    transform: translateX(0px) translateY(0px) scale(1);
  }
  25% {
    transform: translateX(-3px) translateY(2px) scale(0.98);
  }
  50% {
    transform: translateX(2px) translateY(-3px) scale(1.03);
  }
  75% {
    transform: translateX(-4px) translateY(-1px) scale(0.97);
  }
}

/* Chunky Cloud Wiggling */
@keyframes chunky-wiggle-left {
  0%, 100% {
    transform: translateX(0px) translateY(0px) scale(1);
  }
  33% {
    transform: translateX(-8px) translateY(-5px) scale(1.02);
  }
  66% {
    transform: translateX(6px) translateY(4px) scale(0.98);
  }
}

@keyframes chunky-wiggle-right {
  0%, 100% {
    transform: translateX(0px) translateY(0px) scale(1);
  }
  33% {
    transform: translateX(8px) translateY(3px) scale(0.97);
  }
  66% {
    transform: translateX(-6px) translateY(-4px) scale(1.03);
  }
}

@keyframes chunky-wiggle-top {
  0%, 100% {
    transform: translateX(0px) translateY(0px) scale(1);
  }
  50% {
    transform: translateX(0px) translateY(-6px) scale(1.01);
  }
}

/* Loading Content */
.loading-content {
  position: relative;
  z-index: 15;
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
