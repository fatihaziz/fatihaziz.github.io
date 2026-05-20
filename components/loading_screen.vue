<template>
  <transition name="fade-slide">
    <div
      v-if="loading"
      class="loading-screen"
      :class="{ 'love-mode': isLovePage, 'novel-mode': isNovelPage }"
    >
      <!-- Sky Gradient Background -->
      <div class="sky-gradient"></div>

      <!-- Cloud Formations Component (skip on novel page) -->
      <CloudFormation v-if="!isNovelPage" />

      <!-- Novel-mode ambient: stars + waves + moon -->
      <div v-if="isNovelPage" class="novel-ambient" aria-hidden="true">
        <div class="novel-stars">
          <span v-for="i in 30" :key="i" class="nov-star" :class="`ns-${i}`"></span>
        </div>
        <div class="novel-moon"></div>
        <div class="novel-moon-reflection"></div>
        <svg class="novel-waves" viewBox="0 0 1600 400" preserveAspectRatio="none">
          <path d="M 0 120 Q 200 80 400 120 T 800 120 T 1200 120 T 1600 120 L 1600 400 L 0 400 Z"
            fill="rgba(10, 28, 44, 0.55)" class="nv-wave nv-w1" />
          <path d="M 0 200 Q 200 160 400 200 T 800 200 T 1200 200 T 1600 200 L 1600 400 L 0 400 Z"
            fill="rgba(8, 20, 32, 0.75)" class="nv-wave nv-w2" />
          <path d="M 0 280 Q 200 240 400 280 T 800 280 T 1200 280 T 1600 280 L 1600 400 L 0 400 Z"
            fill="rgba(5, 12, 20, 0.95)" />
        </svg>
      </div>

      <!-- Floating Hearts (love mode only) -->
      <div v-if="isLovePage" class="floating-hearts" aria-hidden="true">
        <span v-for="i in 18" :key="i" class="float-heart" :class="`fh-${i}`"></span>
      </div>

      <!-- Loading Content -->
      <div class="loading-content">
        <div class="village-portal">
          <div class="portal-ring"></div>
          <div class="portal-center">
            <!-- Novel-mode: book glyph instead of logo -->
            <div v-if="isNovelPage" class="novel-book-glyph">&#10086;</div>
            <img v-else src="~/assets/img/logo_1.jpeg" class="logo">
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
import { ref, onMounted, computed } from 'vue';
import CloudFormation from './CloudFormation.vue';

const route = useRoute();
const isLovePage = computed(() => route.path === '/i-love-you-dian');
const isNovelPage = computed(() => route.path === '/laut');
const isJournalPage = computed(() => route.path.startsWith('/journal'));

// The journal has its own per-story backdrop, so skip the village intro there.
const loading = ref(!isJournalPage.value);
const progress = ref(0);
const currentMessage = ref('');

const rpgMessages = [
  "Preparing your adventure...",
  "Summoning the village...",
  "Gathering the clouds...",
  "Enchanting the buildings...",
  "Awakening the NPCs...",
  "Polishing the treasures...",
  "Opening the guild doors...",
  "Welcome home, adventurer!"
];

const loveMessages = [
  "Unfolding the letter...",
  "Pressing the flowers...",
  "Gathering the memories...",
  "Taping the photos...",
  "Writing with all my heart...",
  "Sealing with a kiss...",
  "For you, my love..."
];

const novelMessages = [
  "Membuka sampul...",
  "Menyalakan lentera...",
  "Mendengarkan ombak...",
  "Menunggu bulan terbit...",
  "Laut sudah tahu lebih dulu..."
];

let messageIndex = 0;
let progressInterval: NodeJS.Timeout;
let messageInterval: NodeJS.Timeout;

function pickMessages() {
  if (isNovelPage.value) return novelMessages;
  if (isLovePage.value) return loveMessages;
  return rpgMessages;
}

function pickDuration() {
  if (isNovelPage.value) return 3500;
  if (isLovePage.value) return 6000;
  return 15000;
}

function pickMessageInterval() {
  if (isNovelPage.value) return 600;
  if (isLovePage.value) return 700;
  return 800;
}

onMounted(() => {
  if (!loading.value) return;

  const messages = pickMessages();
  const duration = pickDuration();

  currentMessage.value = messages[0];

  progressInterval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += Math.random() * 15 + 5;
      if (progress.value > 100) progress.value = 100;
    }
  }, 200);

  messageInterval = setInterval(() => {
    if (messageIndex < messages.length - 1) {
      messageIndex++;
      currentMessage.value = messages[messageIndex];
    }
  }, pickMessageInterval());

  setTimeout(() => {
    progress.value = 100;
    currentMessage.value = messages[messages.length - 1];

    setTimeout(() => {
      loading.value = false;
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    }, 800);
  }, duration);
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
    #87CEEB 0%,
    #98D8E8 30%,
    #B0E0E6 60%,
    #F0F8FF 100%
  );
  z-index: 1;
}

/* Love mode: warm pink sky */
.love-mode .sky-gradient {
  background: linear-gradient(180deg,
    #f4c2c2 0%,
    #f0d4d4 25%,
    #f5e0e0 50%,
    #fdf0f0 75%,
    #fff5f5 100%
  );
}

/* Loading Content */
.loading-content {
  position: relative;
  z-index: 20;
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

.love-mode .portal-ring {
  border-color: rgba(220, 150, 160, 0.4);
  border-top-color: #e8a0a0;
  animation-duration: 3s;
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

.love-mode .portal-center {
  background: rgba(255, 220, 220, 0.25);
  box-shadow: 0 0 30px rgba(240, 180, 180, 0.4);
}

.logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
}

.love-mode .logo {
  border-color: rgba(240, 180, 180, 0.8);
  box-shadow: 0 0 20px rgba(240, 160, 160, 0.5);
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

.love-mode .loading-text {
  color: #8a5060;
  text-shadow: 1px 1px 3px rgba(180, 120, 130, 0.3);
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

.love-mode .progress-bar {
  background: rgba(240, 200, 200, 0.4);
  box-shadow: inset 0 1px 3px rgba(180, 120, 130, 0.15);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD700, #FFA500, #FFD700);
  border-radius: 4px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
}

.love-mode .progress-fill {
  background: linear-gradient(90deg, #e8a0a0, #d08080, #e8a0a0);
  box-shadow: 0 0 10px rgba(220, 140, 140, 0.5);
}

/* ===== FLOATING HEARTS ===== */
.floating-hearts {
  position: absolute;
  inset: 0;
  z-index: 15;
  pointer-events: none;
  overflow: hidden;
}

.float-heart {
  position: absolute;
  bottom: -30px;
  display: block;
  width: 14px;
  height: 14px;
  opacity: 0;
  animation: heart-rise linear infinite;
}

/* Heart shape via pseudo-elements */
.float-heart::before,
.float-heart::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50% 50% 0 0;
  background: currentColor;
}

.float-heart::before {
  left: -30%;
  transform: rotate(-45deg);
  transform-origin: 100% 100%;
}

.float-heart::after {
  left: 30%;
  transform: rotate(45deg);
  transform-origin: 0 100%;
}

/* 18 hearts with staggered positions, sizes, speeds, colors */
.fh-1  { left: 5%;  color: rgba(230,120,140,0.55); width: 12px; height: 12px; animation-duration: 8s;  animation-delay: 0s; }
.fh-2  { left: 12%; color: rgba(240,160,170,0.45); width: 10px; height: 10px; animation-duration: 10s; animation-delay: 1s; }
.fh-3  { left: 20%; color: rgba(220,100,120,0.5);  width: 16px; height: 16px; animation-duration: 7s;  animation-delay: 0.5s; }
.fh-4  { left: 28%; color: rgba(240,140,160,0.4);  width: 9px;  height: 9px;  animation-duration: 11s; animation-delay: 2s; }
.fh-5  { left: 35%; color: rgba(230,130,150,0.5);  width: 13px; height: 13px; animation-duration: 9s;  animation-delay: 0.8s; }
.fh-6  { left: 42%; color: rgba(220,110,130,0.45); width: 11px; height: 11px; animation-duration: 8.5s; animation-delay: 3s; }
.fh-7  { left: 48%; color: rgba(240,150,170,0.4);  width: 8px;  height: 8px;  animation-duration: 12s; animation-delay: 1.5s; }
.fh-8  { left: 55%; color: rgba(230,120,140,0.5);  width: 15px; height: 15px; animation-duration: 7.5s; animation-delay: 0.3s; }
.fh-9  { left: 62%; color: rgba(220,100,130,0.45); width: 10px; height: 10px; animation-duration: 10s; animation-delay: 2.5s; }
.fh-10 { left: 68%; color: rgba(240,140,160,0.5);  width: 14px; height: 14px; animation-duration: 8s;  animation-delay: 1.2s; }
.fh-11 { left: 75%; color: rgba(230,130,150,0.4);  width: 9px;  height: 9px;  animation-duration: 11s; animation-delay: 0.7s; }
.fh-12 { left: 82%; color: rgba(220,110,140,0.5);  width: 12px; height: 12px; animation-duration: 9s;  animation-delay: 3.5s; }
.fh-13 { left: 88%; color: rgba(240,160,170,0.45); width: 11px; height: 11px; animation-duration: 8.5s; animation-delay: 0.2s; }
.fh-14 { left: 93%; color: rgba(230,120,140,0.4);  width: 7px;  height: 7px;  animation-duration: 13s; animation-delay: 2.2s; }
.fh-15 { left: 8%;  color: rgba(220,100,120,0.5);  width: 13px; height: 13px; animation-duration: 9.5s; animation-delay: 4s; }
.fh-16 { left: 38%; color: rgba(240,150,160,0.45); width: 10px; height: 10px; animation-duration: 10s; animation-delay: 1.8s; }
.fh-17 { left: 58%; color: rgba(230,130,150,0.5);  width: 16px; height: 16px; animation-duration: 7s;  animation-delay: 0.6s; }
.fh-18 { left: 78%; color: rgba(220,110,130,0.4);  width: 8px;  height: 8px;  animation-duration: 12s; animation-delay: 3.2s; }

@keyframes heart-rise {
  0% {
    bottom: -30px;
    opacity: 0;
    transform: translateX(0) scale(0.6);
  }
  10% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    bottom: 110%;
    opacity: 0;
    transform: translateX(40px) scale(1);
  }
}

/* Alternate drift direction for even hearts */
.fh-2, .fh-4, .fh-6, .fh-8, .fh-10, .fh-12, .fh-14, .fh-16, .fh-18 {
  animation-name: heart-rise-left;
}

@keyframes heart-rise-left {
  0% {
    bottom: -30px;
    opacity: 0;
    transform: translateX(0) scale(0.6);
  }
  10% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    bottom: 110%;
    opacity: 0;
    transform: translateX(-35px) scale(1);
  }
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

/* ====================================================================
   NOVEL MODE -- /laut
   ==================================================================== */
.novel-mode .sky-gradient {
  background: linear-gradient(180deg,
    #0a1218 0%,
    #0e1a26 30%,
    #13283a 65%,
    #050a10 100%
  );
}

/* Portal ring: gold, slower spin */
.novel-mode .portal-ring {
  border-color: rgba(232, 212, 168, 0.25);
  border-top-color: #e8d4a8;
  animation-duration: 4s;
  width: 130px;
  height: 130px;
  border-width: 2px;
  top: -5px;
  left: -5px;
}

.novel-mode .portal-center {
  background: rgba(232, 212, 168, 0.08);
  box-shadow: 0 0 35px rgba(232, 212, 168, 0.25);
  width: 120px;
  height: 120px;
  border: 1px solid rgba(232, 212, 168, 0.3);
}

/* Book glyph in center of portal */
.novel-book-glyph {
  font-size: 48px;
  color: #e8d4a8;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 300;
  line-height: 1;
  text-shadow: 0 0 24px rgba(232, 212, 168, 0.6);
  animation: novel-glyph-pulse 3s ease-in-out infinite;
}

@keyframes novel-glyph-pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

/* Loading text styling */
.novel-mode .loading-text {
  font-family: 'Cormorant Garamond', 'Juliett', serif;
  font-style: italic;
  font-weight: 400;
  font-size: 1.3rem;
  color: #e8d4a8;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
}

/* Progress bar: gold accent */
.novel-mode .progress-bar {
  background: rgba(232, 212, 168, 0.12);
  border: 1px solid rgba(232, 212, 168, 0.18);
}

.novel-mode .progress-fill {
  background: linear-gradient(90deg,
    rgba(232, 212, 168, 0.5),
    rgba(232, 212, 168, 0.95));
  box-shadow: 0 0 8px rgba(232, 212, 168, 0.4);
}

/* ===== Ambient: stars + moon + waves ===== */
.novel-ambient {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.novel-stars {
  position: absolute;
  inset: 0;
}

.nov-star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #d8e0e8;
  border-radius: 50%;
  opacity: 0.5;
  animation: nov-star-twinkle 3.5s ease-in-out infinite;
}

@keyframes nov-star-twinkle {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.9; }
}

.ns-1  { top: 5%;  left: 6%;  animation-delay: 0s;   }
.ns-2  { top: 8%;  left: 18%; animation-delay: 0.4s; }
.ns-3  { top: 12%; left: 28%; animation-delay: 1.2s; }
.ns-4  { top: 4%;  left: 38%; animation-delay: 2.0s; }
.ns-5  { top: 15%; left: 48%; animation-delay: 0.8s; }
.ns-6  { top: 7%;  left: 58%; animation-delay: 1.6s; }
.ns-7  { top: 11%; left: 68%; animation-delay: 2.4s; }
.ns-8  { top: 6%;  left: 78%; animation-delay: 0.2s; }
.ns-9  { top: 14%; left: 88%; animation-delay: 1.0s; width: 3px; height: 3px; }
.ns-10 { top: 18%; left: 95%; animation-delay: 1.8s; }
.ns-11 { top: 22%; left: 4%;  animation-delay: 2.6s; }
.ns-12 { top: 25%; left: 13%; animation-delay: 0.6s; }
.ns-13 { top: 28%; left: 24%; animation-delay: 1.4s; }
.ns-14 { top: 30%; left: 36%; animation-delay: 2.2s; }
.ns-15 { top: 24%; left: 46%; animation-delay: 0.0s; width: 1.5px; height: 1.5px; }
.ns-16 { top: 32%; left: 56%; animation-delay: 0.7s; }
.ns-17 { top: 26%; left: 66%; animation-delay: 1.5s; }
.ns-18 { top: 34%; left: 76%; animation-delay: 2.3s; width: 2.5px; height: 2.5px; }
.ns-19 { top: 22%; left: 86%; animation-delay: 0.3s; }
.ns-20 { top: 38%; left: 8%;  animation-delay: 1.1s; }
.ns-21 { top: 42%; left: 22%; animation-delay: 1.9s; }
.ns-22 { top: 36%; left: 33%; animation-delay: 2.7s; }
.ns-23 { top: 44%; left: 44%; animation-delay: 0.5s; }
.ns-24 { top: 40%; left: 55%; animation-delay: 1.3s; }
.ns-25 { top: 46%; left: 67%; animation-delay: 2.1s; }
.ns-26 { top: 38%; left: 80%; animation-delay: 0.9s; }
.ns-27 { top: 48%; left: 92%; animation-delay: 1.7s; }
.ns-28 { top: 8%;  left: 50%; animation-delay: 2.5s; width: 1.5px; height: 1.5px; }
.ns-29 { top: 16%; left: 73%; animation-delay: 0.1s; }
.ns-30 { top: 28%; left: 90%; animation-delay: 1.6s; }

.novel-moon {
  position: absolute;
  top: 14%;
  right: 12%;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle at center,
    #e8d4a8 0%,
    #d8c498 40%,
    rgba(216, 196, 152, 0) 75%);
  border-radius: 50%;
  animation: nov-moon-glow 5s ease-in-out infinite;
}

@keyframes nov-moon-glow {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.04); }
}

.novel-moon-reflection {
  position: absolute;
  top: 60%;
  right: 14%;
  width: 60px;
  height: 4px;
  background: radial-gradient(ellipse at center,
    rgba(232, 212, 168, 0.4) 0%,
    transparent 80%);
  filter: blur(3px);
  animation: nov-moon-glow 5s ease-in-out infinite;
}

.novel-waves {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 35%;
}

@keyframes nov-wave-drift {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-25px); }
}
.nv-wave {
  animation: nov-wave-drift 11s ease-in-out infinite;
}
.nv-w2 {
  animation-duration: 14s;
  animation-delay: -2s;
}
</style>
