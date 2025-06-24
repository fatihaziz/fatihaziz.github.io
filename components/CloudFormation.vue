<template>
  <div class="cloud-formation-container">
    <!-- Left Massive Cloud Formation -->
    <div class="massive-formation left-massive-formation">
      <div v-for="cloud in leftMassiveClouds" :key="`left-${cloud.id}`" 
           :class="['massive-cloud', `massive-cloud-${cloud.id}`]"
           :style="cloud.style">
      </div>
    </div>
    
    <!-- Right Massive Cloud Formation -->
    <div class="massive-formation right-massive-formation">
      <div v-for="cloud in rightMassiveClouds" :key="`right-${cloud.id}`" 
           :class="['massive-cloud', `massive-cloud-${cloud.id}`]"
           :style="cloud.style">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface MassiveCloudData {
  id: number;
  style: {
    width: string;
    height: string;
    top: string;
    left?: string;
    right?: string;
    animationDelay: string;
    opacity: number;
    borderRadius: string;
    zIndex: number;
  };
}

// Function to generate random organic border radius
const generateOrganicRadius = () => {
  const min = 40, max = 120;
  const r1 = Math.floor(Math.random() * (max - min) + min);
  const r2 = Math.floor(Math.random() * (max - min) + min);
  const r3 = Math.floor(Math.random() * (max - min) + min);
  const r4 = Math.floor(Math.random() * (max - min) + min);
  return `${r1}px ${r2}px ${r3}px ${r4}px`;
};

// LEFT MASSIVE FORMATION - Towering cumulus-style clouds
const leftMassiveClouds = ref<MassiveCloudData[]>([
  // Foundation base clouds (95-100% height) - MASSIVE
  { id: 1, style: { width: '500px', height: '200px', top: '95%', left: '-25%', animationDelay: '0s', opacity: 0.85, borderRadius: '120px 150px 100px 140px', zIndex: 1 }},
  { id: 2, style: { width: '450px', height: '180px', top: '93%', left: '-5%', animationDelay: '3s', opacity: 0.82, borderRadius: '140px 120px 130px 110px', zIndex: 2 }},
  { id: 3, style: { width: '480px', height: '190px', top: '92%', left: '10%', animationDelay: '6s', opacity: 0.83, borderRadius: '110px 160px 120px 130px', zIndex: 1 }},

  // Lower towering layer (85-95% height) - Building the wall
  { id: 4, style: { width: '520px', height: '220px', top: '88%', left: '-30%', animationDelay: '2s', opacity: 0.86, borderRadius: '150px 130px 140px 120px', zIndex: 3 }},
  { id: 5, style: { width: '460px', height: '200px', top: '86%', left: '-8%', animationDelay: '8s', opacity: 0.84, borderRadius: '120px 140px 110px 150px', zIndex: 2 }},
  { id: 6, style: { width: '490px', height: '210px', top: '87%', left: '8%', animationDelay: '5s', opacity: 0.85, borderRadius: '130px 120px 160px 140px', zIndex: 3 }},
  { id: 7, style: { width: '440px', height: '190px', top: '85%', left: '15%', animationDelay: '11s', opacity: 0.82, borderRadius: '140px 110px 130px 120px', zIndex: 1 }},

  // Mid-lower towering layer (75-85% height) - Dense coverage
  { id: 8, style: { width: '540px', height: '240px', top: '80%', left: '-35%', animationDelay: '1s', opacity: 0.87, borderRadius: '160px 140px 150px 130px', zIndex: 4 }},
  { id: 9, style: { width: '480px', height: '220px', top: '78%', left: '-12%', animationDelay: '7s', opacity: 0.85, borderRadius: '130px 150px 120px 140px', zIndex: 3 }},
  { id: 10, style: { width: '510px', height: '230px', top: '76%', left: '5%', animationDelay: '4s', opacity: 0.86, borderRadius: '140px 130px 160px 150px', zIndex: 2 }},
  { id: 11, style: { width: '470px', height: '210px', top: '77%', left: '18%', animationDelay: '9s', opacity: 0.84, borderRadius: '150px 120px 140px 130px', zIndex: 4 }},
  { id: 12, style: { width: '460px', height: '200px', top: '75%', left: '-20%', animationDelay: '12s', opacity: 0.83, borderRadius: '120px 160px 130px 140px', zIndex: 1 }},

  // Middle towering layer (65-75% height) - Core mass
  { id: 13, style: { width: '560px', height: '260px', top: '70%', left: '-40%', animationDelay: '3.5s', opacity: 0.88, borderRadius: '170px 150px 160px 140px', zIndex: 5 }},
  { id: 14, style: { width: '520px', height: '240px', top: '68%', left: '-15%', animationDelay: '6.5s', opacity: 0.87, borderRadius: '140px 160px 130px 150px', zIndex: 4 }},
  { id: 15, style: { width: '490px', height: '220px', top: '72%', left: '2%', animationDelay: '10s', opacity: 0.85, borderRadius: '150px 140px 170px 160px', zIndex: 3 }},
  { id: 16, style: { width: '530px', height: '250px', top: '66%', left: '12%', animationDelay: '1.5s', opacity: 0.86, borderRadius: '160px 130px 150px 140px', zIndex: 5 }},
  { id: 17, style: { width: '480px', height: '230px', top: '69%', left: '-25%', animationDelay: '8.5s', opacity: 0.84, borderRadius: '130px 170px 140px 150px', zIndex: 2 }},

  // Upper-middle towering layer (55-65% height) - Peak building
  { id: 18, style: { width: '580px', height: '280px', top: '60%', left: '-45%', animationDelay: '4.5s', opacity: 0.89, borderRadius: '180px 160px 170px 150px', zIndex: 6 }},
  { id: 19, style: { width: '540px', height: '260px', top: '58%', left: '-18%', animationDelay: '7.5s', opacity: 0.88, borderRadius: '150px 170px 140px 160px', zIndex: 5 }},
  { id: 20, style: { width: '510px', height: '240px', top: '62%', left: '-2%', animationDelay: '11s', opacity: 0.86, borderRadius: '160px 150px 180px 170px', zIndex: 4 }},
  { id: 21, style: { width: '550px', height: '270px', top: '56%', left: '8%', animationDelay: '2.5s', opacity: 0.87, borderRadius: '170px 140px 160px 150px', zIndex: 6 }},
  { id: 22, style: { width: '500px', height: '250px', top: '59%', left: '-30%', animationDelay: '9.5s', opacity: 0.85, borderRadius: '140px 180px 150px 160px', zIndex: 3 }},

  // Upper towering layer (45-55% height) - Dramatic peaks
  { id: 23, style: { width: '600px', height: '300px', top: '50%', left: '-50%', animationDelay: '5.5s', opacity: 0.90, borderRadius: '190px 170px 180px 160px', zIndex: 7 }},
  { id: 24, style: { width: '560px', height: '280px', top: '48%', left: '-22%', animationDelay: '2.8s', opacity: 0.89, borderRadius: '160px 180px 150px 170px', zIndex: 6 }},
  { id: 25, style: { width: '530px', height: '260px', top: '52%', left: '-5%', animationDelay: '10.8s', opacity: 0.87, borderRadius: '170px 160px 190px 180px', zIndex: 5 }},
  { id: 26, style: { width: '570px', height: '290px', top: '46%', left: '5%', animationDelay: '6.8s', opacity: 0.88, borderRadius: '180px 150px 170px 160px', zIndex: 7 }},

  // Top dramatic peaks (35-45% height) - Final towering mass
  { id: 27, style: { width: '620px', height: '320px', top: '40%', left: '-55%', animationDelay: '3.8s', opacity: 0.91, borderRadius: '200px 180px 190px 170px', zIndex: 8 }},
  { id: 28, style: { width: '580px', height: '300px', top: '38%', left: '-25%', animationDelay: '8.8s', opacity: 0.90, borderRadius: '170px 190px 160px 180px', zIndex: 7 }},
  { id: 29, style: { width: '550px', height: '280px', top: '42%', left: '-8%', animationDelay: '12.8s', opacity: 0.88, borderRadius: '180px 170px 200px 190px', zIndex: 6 }},
  { id: 30, style: { width: '590px', height: '310px', top: '36%', left: '2%', animationDelay: '5.8s', opacity: 0.89, borderRadius: '190px 160px 180px 170px', zIndex: 8 }},

  // Summit clouds (25-35% height) - Majestic tops
  { id: 31, style: { width: '520px', height: '260px', top: '30%', left: '-35%', animationDelay: '1.2s', opacity: 0.86, borderRadius: '160px 180px 150px 170px', zIndex: 5 }},
  { id: 32, style: { width: '480px', height: '240px', top: '32%', left: '-15%', animationDelay: '9.2s', opacity: 0.85, borderRadius: '150px 160px 170px 140px', zIndex: 4 }},
  { id: 33, style: { width: '460px', height: '220px', top: '28%', left: '-5%', animationDelay: '13.2s', opacity: 0.83, borderRadius: '140px 150px 160px 180px', zIndex: 3 }},
]);

// RIGHT MASSIVE FORMATION - Towering cumulus-style clouds (mirror of left)
const rightMassiveClouds = ref<MassiveCloudData[]>([
  // Foundation base clouds (95-100% height) - MASSIVE
  { id: 34, style: { width: '500px', height: '200px', top: '95%', right: '-25%', animationDelay: '1s', opacity: 0.85, borderRadius: '140px 120px 150px 100px', zIndex: 1 }},
  { id: 35, style: { width: '450px', height: '180px', top: '93%', right: '-5%', animationDelay: '4s', opacity: 0.82, borderRadius: '110px 140px 120px 130px', zIndex: 2 }},
  { id: 36, style: { width: '480px', height: '190px', top: '92%', right: '10%', animationDelay: '7s', opacity: 0.83, borderRadius: '130px 110px 160px 120px', zIndex: 1 }},

  // Lower towering layer (85-95% height) - Building the wall
  { id: 37, style: { width: '520px', height: '220px', top: '88%', right: '-30%', animationDelay: '3s', opacity: 0.86, borderRadius: '120px 150px 130px 140px', zIndex: 3 }},
  { id: 38, style: { width: '460px', height: '200px', top: '86%', right: '-8%', animationDelay: '9s', opacity: 0.84, borderRadius: '150px 120px 140px 110px', zIndex: 2 }},
  { id: 39, style: { width: '490px', height: '210px', top: '87%', right: '8%', animationDelay: '6s', opacity: 0.85, borderRadius: '140px 130px 120px 160px', zIndex: 3 }},
  { id: 40, style: { width: '440px', height: '190px', top: '85%', right: '15%', animationDelay: '12s', opacity: 0.82, borderRadius: '120px 140px 110px 130px', zIndex: 1 }},

  // Mid-lower towering layer (75-85% height) - Dense coverage
  { id: 41, style: { width: '540px', height: '240px', top: '80%', right: '-35%', animationDelay: '2s', opacity: 0.87, borderRadius: '130px 160px 140px 150px', zIndex: 4 }},
  { id: 42, style: { width: '480px', height: '220px', top: '78%', right: '-12%', animationDelay: '8s', opacity: 0.85, borderRadius: '140px 130px 150px 120px', zIndex: 3 }},
  { id: 43, style: { width: '510px', height: '230px', top: '76%', right: '5%', animationDelay: '5s', opacity: 0.86, borderRadius: '150px 140px 130px 160px', zIndex: 2 }},
  { id: 44, style: { width: '470px', height: '210px', top: '77%', right: '18%', animationDelay: '10s', opacity: 0.84, borderRadius: '130px 150px 120px 140px', zIndex: 4 }},
  { id: 45, style: { width: '460px', height: '200px', top: '75%', right: '-20%', animationDelay: '13s', opacity: 0.83, borderRadius: '140px 120px 160px 130px', zIndex: 1 }},

  // Middle towering layer (65-75% height) - Core mass
  { id: 46, style: { width: '560px', height: '260px', top: '70%', right: '-40%', animationDelay: '4.5s', opacity: 0.88, borderRadius: '140px 170px 150px 160px', zIndex: 5 }},
  { id: 47, style: { width: '520px', height: '240px', top: '68%', right: '-15%', animationDelay: '7.5s', opacity: 0.87, borderRadius: '150px 140px 160px 130px', zIndex: 4 }},
  { id: 48, style: { width: '490px', height: '220px', top: '72%', right: '2%', animationDelay: '11s', opacity: 0.85, borderRadius: '160px 150px 140px 170px', zIndex: 3 }},
  { id: 49, style: { width: '530px', height: '250px', top: '66%', right: '12%', animationDelay: '2.5s', opacity: 0.86, borderRadius: '140px 160px 130px 150px', zIndex: 5 }},
  { id: 50, style: { width: '480px', height: '230px', top: '69%', right: '-25%', animationDelay: '9.5s', opacity: 0.84, borderRadius: '150px 130px 170px 140px', zIndex: 2 }},

  // Upper-middle towering layer (55-65% height) - Peak building
  { id: 51, style: { width: '580px', height: '280px', top: '60%', right: '-45%', animationDelay: '5.5s', opacity: 0.89, borderRadius: '150px 180px 160px 170px', zIndex: 6 }},
  { id: 52, style: { width: '540px', height: '260px', top: '58%', right: '-18%', animationDelay: '8.5s', opacity: 0.88, borderRadius: '160px 150px 170px 140px', zIndex: 5 }},
  { id: 53, style: { width: '510px', height: '240px', top: '62%', right: '-2%', animationDelay: '12s', opacity: 0.86, borderRadius: '170px 160px 150px 180px', zIndex: 4 }},
  { id: 54, style: { width: '550px', height: '270px', top: '56%', right: '8%', animationDelay: '3.5s', opacity: 0.87, borderRadius: '150px 170px 140px 160px', zIndex: 6 }},
  { id: 55, style: { width: '500px', height: '250px', top: '59%', right: '-30%', animationDelay: '10.5s', opacity: 0.85, borderRadius: '160px 140px 180px 150px', zIndex: 3 }},

  // Upper towering layer (45-55% height) - Dramatic peaks
  { id: 56, style: { width: '600px', height: '300px', top: '50%', right: '-50%', animationDelay: '6.5s', opacity: 0.90, borderRadius: '160px 190px 170px 180px', zIndex: 7 }},
  { id: 57, style: { width: '560px', height: '280px', top: '48%', right: '-22%', animationDelay: '3.8s', opacity: 0.89, borderRadius: '170px 160px 180px 150px', zIndex: 6 }},
  { id: 58, style: { width: '530px', height: '260px', top: '52%', right: '-5%', animationDelay: '11.8s', opacity: 0.87, borderRadius: '180px 170px 160px 190px', zIndex: 5 }},
  { id: 59, style: { width: '570px', height: '290px', top: '46%', right: '5%', animationDelay: '7.8s', opacity: 0.88, borderRadius: '160px 180px 150px 170px', zIndex: 7 }},

  // Top dramatic peaks (35-45% height) - Final towering mass
  { id: 60, style: { width: '620px', height: '320px', top: '40%', right: '-55%', animationDelay: '4.8s', opacity: 0.91, borderRadius: '170px 200px 180px 190px', zIndex: 8 }},
  { id: 61, style: { width: '580px', height: '300px', top: '38%', right: '-25%', animationDelay: '9.8s', opacity: 0.90, borderRadius: '180px 170px 190px 160px', zIndex: 7 }},
  { id: 62, style: { width: '550px', height: '280px', top: '42%', right: '-8%', animationDelay: '13.8s', opacity: 0.88, borderRadius: '190px 180px 170px 200px', zIndex: 6 }},
  { id: 63, style: { width: '590px', height: '310px', top: '36%', right: '2%', animationDelay: '6.8s', opacity: 0.89, borderRadius: '170px 190px 160px 180px', zIndex: 8 }},

  // Summit clouds (25-35% height) - Majestic tops
  { id: 64, style: { width: '520px', height: '260px', top: '30%', right: '-35%', animationDelay: '2.2s', opacity: 0.86, borderRadius: '170px 160px 180px 150px', zIndex: 5 }},
  { id: 65, style: { width: '480px', height: '240px', top: '32%', right: '-15%', animationDelay: '10.2s', opacity: 0.85, borderRadius: '140px 150px 160px 170px', zIndex: 4 }},
  { id: 66, style: { width: '460px', height: '220px', top: '28%', right: '-5%', animationDelay: '14.2s', opacity: 0.83, borderRadius: '180px 140px 150px 160px', zIndex: 3 }},
]);
</script>

<style scoped>
.cloud-formation-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3; /* Behind floating clouds (z-index: 4) but above sky */
}

.massive-formation {
  position: absolute;
  width: 100%;
  height: 100%;
}

.left-massive-formation {
  /* Left formation stays in place */
}

.right-massive-formation {
  /* Right formation stays in place */
}

.massive-cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.8); /* White with similar opacity to floating clouds */
  animation: subtle-breathing 30s infinite ease-in-out;
}

/* Very subtle breathing animation - individual clouds */
@keyframes subtle-breathing {
  0%, 100% { 
    transform: translateX(0px) translateY(0px) scale(1); 
  }
  25% { 
    transform: translateX(-1px) translateY(-0.5px) scale(1.005); 
  }
  50% { 
    transform: translateX(0.5px) translateY(1px) scale(0.998); 
  }
  75% { 
    transform: translateX(-0.5px) translateY(-0.5px) scale(1.002); 
  }
}

/* Individual cloud breathing variations - staggered timing */
.massive-cloud-1 { animation-duration: 28s; animation-delay: 0s; }
.massive-cloud-2 { animation-duration: 32s; animation-delay: 2s; }
.massive-cloud-3 { animation-duration: 26s; animation-delay: 4s; }
.massive-cloud-4 { animation-duration: 30s; animation-delay: 1s; }
.massive-cloud-5 { animation-duration: 35s; animation-delay: 6s; }
.massive-cloud-6 { animation-duration: 29s; animation-delay: 3s; }
.massive-cloud-7 { animation-duration: 31s; animation-delay: 7s; }
.massive-cloud-8 { animation-duration: 27s; animation-delay: 5s; }
.massive-cloud-9 { animation-duration: 33s; animation-delay: 8s; }
.massive-cloud-10 { animation-duration: 28s; animation-delay: 2.5s; }
.massive-cloud-11 { animation-duration: 34s; animation-delay: 9s; }
.massive-cloud-12 { animation-duration: 30s; animation-delay: 4.5s; }
.massive-cloud-13 { animation-duration: 32s; animation-delay: 10s; }
.massive-cloud-14 { animation-duration: 29s; animation-delay: 1.8s; }
.massive-cloud-15 { animation-duration: 31s; animation-delay: 6.8s; }
.massive-cloud-16 { animation-duration: 28s; animation-delay: 3.2s; }
.massive-cloud-17 { animation-duration: 35s; animation-delay: 8.2s; }
.massive-cloud-18 { animation-duration: 27s; animation-delay: 5.2s; }
.massive-cloud-19 { animation-duration: 33s; animation-delay: 11s; }
.massive-cloud-20 { animation-duration: 30s; animation-delay: 7.2s; }
.massive-cloud-21 { animation-duration: 32s; animation-delay: 12s; }
.massive-cloud-22 { animation-duration: 29s; animation-delay: 4.8s; }
.massive-cloud-23 { animation-duration: 31s; animation-delay: 9.8s; }
.massive-cloud-24 { animation-duration: 28s; animation-delay: 2.8s; }
.massive-cloud-25 { animation-duration: 34s; animation-delay: 13s; }
.massive-cloud-26 { animation-duration: 30s; animation-delay: 6.2s; }
.massive-cloud-27 { animation-duration: 33s; animation-delay: 10.2s; }
.massive-cloud-28 { animation-duration: 27s; animation-delay: 3.8s; }
.massive-cloud-29 { animation-duration: 35s; animation-delay: 14s; }
.massive-cloud-30 { animation-duration: 31s; animation-delay: 7.8s; }

/* Right formation clouds (34-66) with different timings */
.massive-cloud-34 { animation-duration: 29s; animation-delay: 1s; }
.massive-cloud-35 { animation-duration: 32s; animation-delay: 5s; }
.massive-cloud-36 { animation-duration: 28s; animation-delay: 9s; }
.massive-cloud-37 { animation-duration: 34s; animation-delay: 3s; }
.massive-cloud-38 { animation-duration: 30s; animation-delay: 11s; }
.massive-cloud-39 { animation-duration: 31s; animation-delay: 2s; }
.massive-cloud-40 { animation-duration: 27s; animation-delay: 7s; }
.massive-cloud-41 { animation-duration: 33s; animation-delay: 12s; }
.massive-cloud-42 { animation-duration: 29s; animation-delay: 4s; }
.massive-cloud-43 { animation-duration: 35s; animation-delay: 8s; }
.massive-cloud-44 { animation-duration: 28s; animation-delay: 13s; }
.massive-cloud-45 { animation-duration: 32s; animation-delay: 5.5s; }
.massive-cloud-46 { animation-duration: 30s; animation-delay: 10.5s; }
.massive-cloud-47 { animation-duration: 31s; animation-delay: 2.5s; }
.massive-cloud-48 { animation-duration: 34s; animation-delay: 14.5s; }
.massive-cloud-49 { animation-duration: 27s; animation-delay: 6.5s; }
.massive-cloud-50 { animation-duration: 33s; animation-delay: 11.5s; }
.massive-cloud-51 { animation-duration: 29s; animation-delay: 3.5s; }
.massive-cloud-52 { animation-duration: 35s; animation-delay: 15s; }
.massive-cloud-53 { animation-duration: 28s; animation-delay: 7.5s; }
.massive-cloud-54 { animation-duration: 32s; animation-delay: 12.5s; }
.massive-cloud-55 { animation-duration: 30s; animation-delay: 4.2s; }
.massive-cloud-56 { animation-duration: 31s; animation-delay: 9.2s; }
.massive-cloud-57 { animation-duration: 34s; animation-delay: 1.8s; }
.massive-cloud-58 { animation-duration: 27s; animation-delay: 6.8s; }
.massive-cloud-59 { animation-duration: 33s; animation-delay: 11.8s; }
.massive-cloud-60 { animation-duration: 29s; animation-delay: 3.8s; }
.massive-cloud-61 { animation-duration: 35s; animation-delay: 16s; }
.massive-cloud-62 { animation-duration: 28s; animation-delay: 8.8s; }
.massive-cloud-63 { animation-duration: 32s; animation-delay: 13.8s; }
.massive-cloud-64 { animation-duration: 30s; animation-delay: 5.8s; }
.massive-cloud-65 { animation-duration: 31s; animation-delay: 10.8s; }
.massive-cloud-66 { animation-duration: 34s; animation-delay: 15.8s; }

/* Responsive adjustments */
@media (max-width: 768px) {
  .massive-cloud {
    transform: scale(0.6) !important;
  }
  
  .cloud-formation-container {
    z-index: 2; /* Lower z-index on mobile for better performance */
  }
}

@media (max-width: 480px) {
  .massive-cloud {
    transform: scale(0.4) !important;
  }
}
</style>