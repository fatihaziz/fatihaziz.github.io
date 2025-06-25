<template>
  <div class="cloud-formation-container">
    <!-- Background floating clouds -->
    <div class="cloud-layer background-clouds">
      <div class="simple-cloud large simple-cloud-1">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="simple-cloud normal simple-cloud-2">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="simple-cloud small simple-cloud-3">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="simple-cloud tiny simple-cloud-4">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="simple-cloud normal simple-cloud-5">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="simple-cloud small simple-cloud-6">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>

    <!-- Left Massive Cloud Formation - Made of simple clouds! -->
    <div class="massive-formation left-massive-formation">
      <!-- Bottom layer clouds - CLOSER for 1920x1200 -->
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 85%; left: -5%; transform: scale(8); opacity: 0.9;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 80%; left: -10%; transform: scale(10); opacity: 0.8;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 90%; left: 5%; transform: scale(9); opacity: 0.85;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 88%; left: -15%; transform: scale(7); opacity: 0.9;">
        <div></div><div></div><div></div><div></div>
      </div>

      <!-- Middle layer clouds -->
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 70%; left: -8%; transform: scale(11); opacity: 0.85;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 75%; left: -12%; transform: scale(9); opacity: 0.8;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 65%; left: 2%; transform: scale(10); opacity: 0.87;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 78%; left: 0%; transform: scale(8); opacity: 0.9;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 72%; left: -18%; transform: scale(9); opacity: 0.82;">
        <div></div><div></div><div></div><div></div>
      </div>

      <!-- Upper layer clouds -->
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 55%; left: -10%; transform: scale(12); opacity: 0.8;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 60%; left: -3%; transform: scale(10); opacity: 0.85;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 50%; left: -15%; transform: scale(11); opacity: 0.88;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 58%; left: 5%; transform: scale(9); opacity: 0.9;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 52%; left: -20%; transform: scale(10); opacity: 0.83;">
        <div></div><div></div><div></div><div></div>
      </div>

      <!-- Top layer clouds -->
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 40%; left: -12%; transform: scale(13); opacity: 0.75;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 45%; left: -5%; transform: scale(11); opacity: 0.8;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 35%; left: -18%; transform: scale(10); opacity: 0.85;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 43%; left: 2%; transform: scale(9); opacity: 0.88;">
        <div></div><div></div><div></div><div></div>
      </div>

      <!-- Peak clouds -->
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 25%; left: -15%; transform: scale(15); opacity: 0.7;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 30%; left: -8%; transform: scale(12); opacity: 0.75;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 20%; left: -20%; transform: scale(11); opacity: 0.8;">
        <div></div><div></div><div></div><div></div>
      </div>

      <!-- Additional dense clouds closer to center -->
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 45%; left: 10%; transform: scale(13); opacity: 0.82;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 38%; left: 15%; transform: scale(10); opacity: 0.85;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 62%; left: 8%; transform: scale(11); opacity: 0.78;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 68%; left: 18%; transform: scale(9); opacity: 0.86;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 32%; left: 5%; transform: scale(14); opacity: 0.73;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 55%; left: 12%; transform: scale(8); opacity: 0.89;">
        <div></div><div></div><div></div><div></div>
      </div>
    </div>

    <!-- Right Massive Cloud Formation - Mirror of left! -->
    <div class="massive-formation right-massive-formation">
      <!-- Bottom layer clouds - CLOSER for 1920x1200 -->
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 85%; right: -5%; transform: scale(8); opacity: 0.9;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 80%; right: -10%; transform: scale(10); opacity: 0.8;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 90%; right: 5%; transform: scale(9); opacity: 0.85;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 88%; right: -15%; transform: scale(7); opacity: 0.9;">
        <div></div><div></div><div></div><div></div>
      </div>

      <!-- Middle layer clouds -->
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 70%; right: -8%; transform: scale(11); opacity: 0.85;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 75%; right: -12%; transform: scale(9); opacity: 0.8;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 65%; right: 2%; transform: scale(10); opacity: 0.87;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 78%; right: 0%; transform: scale(8); opacity: 0.9;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 72%; right: -18%; transform: scale(9); opacity: 0.82;">
        <div></div><div></div><div></div><div></div>
      </div>

      <!-- Upper layer clouds -->
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 55%; right: -10%; transform: scale(12); opacity: 0.8;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 60%; right: -3%; transform: scale(10); opacity: 0.85;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 50%; right: -15%; transform: scale(11); opacity: 0.88;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 58%; right: 5%; transform: scale(9); opacity: 0.9;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 52%; right: -20%; transform: scale(10); opacity: 0.83;">
        <div></div><div></div><div></div><div></div>
      </div>

      <!-- Top layer clouds -->
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 40%; right: -12%; transform: scale(13); opacity: 0.75;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 45%; right: -5%; transform: scale(11); opacity: 0.8;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 35%; right: -18%; transform: scale(10); opacity: 0.85;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 43%; right: 2%; transform: scale(9); opacity: 0.88;">
        <div></div><div></div><div></div><div></div>
      </div>

      <!-- Peak clouds -->
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 25%; right: -15%; transform: scale(15); opacity: 0.7;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 30%; right: -8%; transform: scale(12); opacity: 0.75;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 20%; right: -20%; transform: scale(11); opacity: 0.8;">
        <div></div><div></div><div></div><div></div>
      </div>

      <!-- Additional dense clouds closer to center -->
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 42%; right: 8%; transform: scale(12); opacity: 0.81;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 48%; right: 14%; transform: scale(9); opacity: 0.84;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 58%; right: 6%; transform: scale(13); opacity: 0.77;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 65%; right: 16%; transform: scale(10); opacity: 0.85;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 36%; right: 4%; transform: scale(11); opacity: 0.79;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud normal formation-cloud" style="position: absolute; top: 52%; right: 12%; transform: scale(8); opacity: 0.87;">
        <div></div><div></div><div></div><div></div>
      </div>
      <div class="simple-cloud large formation-cloud" style="position: absolute; top: 28%; right: 18%; transform: scale(14); opacity: 0.72;">
        <div></div><div></div><div></div><div></div>
      </div>
    </div>

    <!-- Big Composite Cloud - Slowly drifting near logo (10 seconds) -->
    <div class="big-cloud left-cloud-1">
      <div class="large-circle">
        <div class="cloud-shadow"></div>
      </div>
      <div class="middle-circle circle-2">
        <div class="cloud-shadow"></div>
      </div>
      <div class="small-circle circle-3">
        <div class="cloud-shadow"></div>
      </div>
      <div class="middle-circle circle-4">
        <div class="cloud-shadow"></div>
      </div>
      <div class="small-circle circle-5">
        <div class="cloud-shadow"></div>
      </div>
      <div class="small-circle circle-6">
        <div class="cloud-shadow"></div>
      </div>
    </div>

    <!-- Big Composite Cloud - Longer elongated shape -->
    <div class="big-cloud right-cloud-1-b">
      <div class="middle-circle">
        <div class="cloud-shadow"></div>
      </div>
      <div class="large-circle circle-2">
        <div class="cloud-shadow"></div>
      </div>
      <div class="middle-circle circle-4">
        <div class="cloud-shadow"></div>
      </div>
      <div class="small-circle circle-3">
        <div class="cloud-shadow"></div>
      </div>
      <div class="small-circle circle-5">
        <div class="cloud-shadow"></div>
      </div>
      <div class="middle-circle circle-6">
        <div class="cloud-shadow"></div>
      </div>
      <div class="small-circle" style="top: 80px; left: 180px;">
        <div class="cloud-shadow"></div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
// No script needed for static cloud formations
</script>

<style scoped>
.cloud-formation-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3; /* Above sky gradient */
}

/* Cloud Layers */
.cloud-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.background-clouds { z-index: 4; } /* Above massive formations */

/* Simple Floating Clouds */
.simple-cloud {
  position: relative;
  margin: 33px 0 0 0;
  width: 54px;
  height: 5px;
  background: #f7e7eb;
  border-radius: 10px;
  opacity: 0.8;
}

/* Formation clouds */
.formation-cloud {
  animation: none !important;
  margin: 0 !important;
}

.simple-cloud.tiny {
  transform: scale(0.5);
}

.simple-cloud.small {
  transform: scale(1);
}

.simple-cloud.normal {
  transform: scale(2);
}

.simple-cloud.large {
  transform: scale(4);
}

.simple-cloud div {
  position: absolute;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  left: -3px;
  bottom: 0;
  background: #fafbf0;
  z-index: 10;
  box-shadow: inset -2px -3px 0 0 #f7e7eb;
}

.simple-cloud div:first-child {
  /* First bump - small */
}

.simple-cloud div:nth-child(2) {
  transform: scale(1.6);
  margin: 0 0 4px 13px;
  z-index: 9;
}

.simple-cloud div:nth-child(3) {
  transform: scale(2.4);
  margin: 0 0 9px 32px;
  z-index: 8;
}

.simple-cloud div:nth-child(4) {
  transform: scale(1.3);
  margin: 0 0 2px 50px;
  z-index: 7;
}

/* Cloud Positioning and Animation */
.simple-cloud-1 {
  position: absolute;
  top: 15%;
  left: -10%;
  animation: clouds-float 25s infinite linear;
  animation-delay: 0s;
}

.simple-cloud-2 {
  position: absolute;
  top: 65%;
  right: -10%;
  animation: clouds-float-reverse 20s infinite linear;
  animation-delay: 3s;
}

.simple-cloud-3 {
  position: absolute;
  top: 8%;
  right: -10%;
  animation: clouds-float 30s infinite linear;
  animation-delay: 6s;
}

.simple-cloud-4 {
  position: absolute;
  top: 75%;
  left: -10%;
  animation: clouds-float 18s infinite linear;
  animation-delay: 9s;
}

.simple-cloud-5 {
  position: absolute;
  top: 50%;
  right: -10%;
  animation: clouds-float-reverse 22s infinite linear;
  animation-delay: 12s;
}

.simple-cloud-6 {
  position: absolute;
  top: 35%;
  left: -10%;
  animation: clouds-float 28s infinite linear;
  animation-delay: 15s;
}

/* Simple Cloud Animations - No silly rotation! */
@keyframes clouds-float {
  0% {
    left: -10%;
  }
  100% {
    left: 110%;
  }
}

@keyframes clouds-float-reverse {
  0% {
    right: -10%;
  }
  100% {
    right: 110%;
  }
}

.massive-formation {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 3; /* Above sky gradient, behind floating clouds */
}

.left-massive-formation {
  /* Left formation stays in place */
}

.right-massive-formation {
  /* Right formation stays in place */
}

/* Composite Cloud Formations - Based on cloud2.html */
.big-cloud {
  position: absolute;
}

/* Circle Components */
.small-circle {
  height: 100px;
  width: 100px;
  background: white;
  border-radius: 100%;
  position: absolute;
}

.middle-circle {
  height: 150px;
  width: 150px;
  background: white;
  border-radius: 100%;
  position: absolute;
}

.large-circle {
  height: 200px;
  width: 200px;
  background: white;
  border-radius: 100%;
  position: absolute;
}

/* Circle Positioning */
.circle-2 {
  top: 50px;
  left: -40px;
}

.circle-3 {
  top: 50px;
  left: -120px;
}

.circle-4 {
  top: 30px;
  left: -60px;
}

.circle-5 {
  top: 100px;
  left: -150px;
}

.circle-6 {
  top: 100px;
  left: 130px;
}

/* Cloud Shadows */
.cloud-shadow {
  background-repeat: no-repeat;
  position: absolute;
  z-index: 2;
  transform: scale(0.9, -0.9);
}

.large-circle .cloud-shadow {
  background: radial-gradient(48% 64%, circle, rgba(204, 0, 0, 0) 110px, #9BBBC4 50px);
  top: 2px;
  z-index: 3;
}

.middle-circle .cloud-shadow {
  background: radial-gradient(58% 61%, circle, rgba(204, 0, 0, 0) 82px, #9BBBC4 50px);
  top: 0px;
}

.small-circle .cloud-shadow {
  background: radial-gradient(57% 61%, circle, rgba(204, 0, 0, 0) 53px, #9BBBC4 40px);
  top: 0px;
}

/* Cloud Positioning and Animation */
.left-cloud-1 {
  opacity: 0.9;
  top: 20%;
  left: -25%;
  transform: scale(1.8);
  animation: drift-slow 21s infinite linear;
  animation-delay: 0s;
  z-index: 2;
}

.right-cloud-1-b {
  opacity: 0.81;
  top: 66%;
  right: -15%;
  transform: scale(1.37);
  animation: drift-reverse-slow 37s infinite linear;
  animation-delay: 0s;
  z-index: 2;
}

.left-cloud-2 {
  opacity: 0.8;
  top: 60%;
  left: -20%;
  transform: scale(1.5);
  animation: drift-slow 60s infinite linear;
  animation-delay: 15s;
  z-index: 1;
}

.right-cloud-1 {
  opacity: 0.9;
  top: 15%;
  right: -25%;
  transform: scale(1.8);
  animation: drift-reverse-slow 50s infinite linear;
  animation-delay: 8s;
  z-index: 2;
}

.right-cloud-2 {
  opacity: 0.8;
  top: 65%;
  right: -20%;
  transform: scale(1.5);
  animation: drift-reverse-slow 55s infinite linear;
  animation-delay: 25s;
  z-index: 1;
}

/* Drift Animations for Composite Clouds */
@keyframes drift-slow {
  from {
    left: -30%;
  }
  to {
    left: 130%;
  }
}

@keyframes drift-reverse-slow {
  from {
    right: -30%;
  }
  to {
    right: 130%;
  }
}

/* Removed old individual cloud timings */

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