<template>
  <div
    class="chapter-art"
    :style="bgStyle"
  >
    <!-- Paper grain overlay -->
    <div class="grain" aria-hidden="true"></div>

    <!-- ====== I. WIND -- arah angin ====== -->
    <svg
      v-if="art === 'wind'"
      class="art-svg"
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="sun-i" cx="0.25" cy="0.18" r="0.35">
          <stop offset="0%" :stop-color="theme.artGlow" stop-opacity="0.9" />
          <stop offset="100%" :stop-color="theme.artGlow" stop-opacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="110" r="60" fill="url(#sun-i)" />
      <circle cx="100" cy="110" r="32" :fill="theme.artGlow" opacity="0.85" />

      <!-- wind streams -->
      <g :stroke="theme.artInk" fill="none" stroke-linecap="round">
        <path d="M 0 220 Q 100 200 200 230 T 400 215" stroke-width="1.4" opacity="0.55"
          class="wind-line" style="animation-delay: 0s" />
        <path d="M 0 280 Q 120 260 240 290 T 400 280" stroke-width="1.1" opacity="0.45"
          class="wind-line" style="animation-delay: 0.6s" />
        <path d="M 0 340 Q 90 320 200 350 T 400 340" stroke-width="1.6" opacity="0.65"
          class="wind-line" style="animation-delay: 0.3s" />
        <path d="M 0 400 Q 150 380 260 410 T 400 400" stroke-width="1.0" opacity="0.4"
          class="wind-line" style="animation-delay: 0.9s" />
        <path d="M 0 460 Q 110 440 220 470 T 400 460" stroke-width="1.3" opacity="0.55"
          class="wind-line" style="animation-delay: 0.45s" />
      </g>

      <!-- running figure silhouette -->
      <g :fill="theme.artInk" opacity="0.85">
        <ellipse cx="320" cy="528" rx="42" ry="3" opacity="0.3" />
        <path d="M 296 488 q 4 -10 14 -10 q 6 0 8 6 q 10 -2 14 4 q 4 6 -2 12 l -8 8 l 4 14 l 6 18 l -2 4 l -10 -2 l -8 -22 l -10 6 l -2 12 l -8 0 l 0 -10 l 6 -16 l -8 -14 q -2 -8 6 -10 z" />
        <circle cx="312" cy="478" r="6" />
      </g>

      <!-- numeral roman -->
      <text x="200" y="560" text-anchor="middle"
        :fill="theme.artInk" opacity="0.18"
        font-family="serif" font-size="100" font-weight="200"
        font-style="italic">I</text>
    </svg>

    <!-- ====== II. MASK -- hidden ====== -->
    <svg
      v-else-if="art === 'mask'"
      class="art-svg"
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="bgglow-ii" cx="0.5" cy="0.55" r="0.6">
          <stop offset="0%" :stop-color="theme.artGlow" stop-opacity="0.25" />
          <stop offset="100%" stop-color="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="600" fill="url(#bgglow-ii)" />

      <!-- Two overlapping faces, oval-mask style -->
      <g :stroke="theme.artInk" fill="none" stroke-width="1.4">
        <!-- back face -->
        <ellipse cx="220" cy="280" rx="78" ry="100" opacity="0.55" />
        <ellipse cx="220" cy="240" rx="14" ry="6" opacity="0.4" />
        <ellipse cx="220" cy="280" rx="14" ry="6" opacity="0.4" />
        <path d="M 200 320 Q 220 332 240 320" opacity="0.4" />

        <!-- front face -->
        <ellipse cx="170" cy="320" rx="78" ry="100" :fill="theme.artGlow" fill-opacity="0.18" />
        <ellipse cx="148" cy="290" rx="10" ry="4" :fill="theme.artInk" />
        <ellipse cx="192" cy="290" rx="10" ry="4" :fill="theme.artInk" />
        <path d="M 152 350 Q 170 358 188 350" />
      </g>

      <!-- vertical silence bars -->
      <g :stroke="theme.artInk" stroke-width="1" opacity="0.18">
        <line x1="40" y1="60" x2="40" y2="540" />
        <line x1="60" y1="80" x2="60" y2="520" />
        <line x1="340" y1="80" x2="340" y2="520" />
        <line x1="360" y1="60" x2="360" y2="540" />
      </g>

      <text x="200" y="560" text-anchor="middle"
        :fill="theme.artInk" opacity="0.18"
        font-family="serif" font-size="100" font-weight="200"
        font-style="italic">II</text>
    </svg>

    <!-- ====== III. CUP -- kopi dingin ====== -->
    <svg
      v-else-if="art === 'cup'"
      class="art-svg"
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cup-grad-iii" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" :stop-color="theme.artGlow" stop-opacity="0.8" />
          <stop offset="100%" :stop-color="theme.artInk" stop-opacity="0.6" />
        </linearGradient>
      </defs>

      <!-- table line -->
      <line x1="40" y1="430" x2="360" y2="430"
        :stroke="theme.artInk" stroke-width="1" opacity="0.35" />

      <!-- steam wisps -->
      <g :stroke="theme.artInk" fill="none" stroke-width="1.2" stroke-linecap="round">
        <path d="M 178 220 q -8 -20 4 -40 q 12 -20 -2 -42" opacity="0.55"
          class="steam" style="animation-delay: 0s" />
        <path d="M 200 215 q -6 -18 6 -38 q 10 -18 -4 -40" opacity="0.45"
          class="steam" style="animation-delay: 0.8s" />
        <path d="M 222 222 q -4 -16 6 -34 q 10 -18 -4 -38" opacity="0.5"
          class="steam" style="animation-delay: 1.4s" />
      </g>

      <!-- cup body -->
      <path d="M 150 250 L 150 380 Q 150 410 200 410 Q 250 410 250 380 L 250 250 Z"
        :fill="theme.artInk" opacity="0.95" />
      <ellipse cx="200" cy="250" rx="50" ry="10" fill="url(#cup-grad-iii)" />
      <ellipse cx="200" cy="250" rx="48" ry="7" :fill="theme.artInk" opacity="0.6" />

      <!-- handle -->
      <path d="M 250 280 q 35 0 35 30 q 0 30 -35 30"
        fill="none" :stroke="theme.artInk" stroke-width="8" stroke-linecap="round" />

      <!-- saucer -->
      <ellipse cx="200" cy="425" rx="80" ry="10"
        :fill="theme.artInk" opacity="0.85" />
      <ellipse cx="200" cy="423" rx="80" ry="6" :fill="theme.artGlow" opacity="0.3" />

      <text x="200" y="560" text-anchor="middle"
        :fill="theme.artInk" opacity="0.18"
        font-family="serif" font-size="100" font-weight="200"
        font-style="italic">III</text>
    </svg>

    <!-- ====== IV. GIFT -- pemberian ====== -->
    <svg
      v-else-if="art === 'gift'"
      class="art-svg"
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="box-grad-iv" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" :stop-color="theme.artGlow" stop-opacity="0.85" />
          <stop offset="100%" :stop-color="theme.artInk" stop-opacity="0.7" />
        </linearGradient>
      </defs>

      <!-- Stacked boxes -->
      <!-- bottom large box -->
      <rect x="100" y="360" width="200" height="90" :fill="theme.artInk" opacity="0.92" />
      <rect x="100" y="360" width="200" height="14" :fill="theme.artGlow" opacity="0.55" />
      <rect x="190" y="360" width="20" height="90" :fill="theme.artGlow" opacity="0.55" />

      <!-- middle box -->
      <rect x="135" y="270" width="130" height="90" :fill="theme.artInk" opacity="0.85" />
      <rect x="135" y="270" width="130" height="12" :fill="theme.artGlow" opacity="0.5" />
      <rect x="195" y="270" width="14" height="90" :fill="theme.artGlow" opacity="0.5" />

      <!-- top small box -->
      <rect x="170" y="200" width="60" height="70" :fill="theme.artInk" opacity="0.95" />
      <rect x="170" y="200" width="60" height="10" :fill="theme.artGlow" opacity="0.6" />
      <rect x="195" y="200" width="10" height="70" :fill="theme.artGlow" opacity="0.6" />

      <!-- ribbon bow on top -->
      <g :fill="theme.artGlow" opacity="0.85">
        <ellipse cx="190" cy="200" rx="14" ry="10" />
        <ellipse cx="210" cy="200" rx="14" ry="10" />
        <rect x="196" y="194" width="8" height="14" />
      </g>

      <!-- petals falling (subtle wilt motif) -->
      <g :fill="theme.artInk" opacity="0.5">
        <ellipse cx="80" cy="180" rx="6" ry="3" transform="rotate(20 80 180)" class="petal"
          style="animation-delay: 0s" />
        <ellipse cx="320" cy="160" rx="6" ry="3" transform="rotate(-15 320 160)" class="petal"
          style="animation-delay: 1.2s" />
        <ellipse cx="60" cy="280" rx="5" ry="2" transform="rotate(35 60 280)" class="petal"
          style="animation-delay: 0.6s" />
        <ellipse cx="340" cy="320" rx="5" ry="2" transform="rotate(-25 340 320)" class="petal"
          style="animation-delay: 1.8s" />
      </g>

      <text x="200" y="560" text-anchor="middle"
        :fill="theme.artInk" opacity="0.18"
        font-family="serif" font-size="100" font-weight="200"
        font-style="italic">IV</text>
    </svg>

    <!-- ====== V. HOURGLASS -- waktu ====== -->
    <svg
      v-else-if="art === 'hourglass'"
      class="art-svg"
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <!-- faded clock face behind -->
      <g :stroke="theme.artInk" fill="none" stroke-width="1" opacity="0.18">
        <circle cx="200" cy="300" r="160" />
        <circle cx="200" cy="300" r="140" />
        <line x1="200" y1="160" x2="200" y2="170" />
        <line x1="200" y1="430" x2="200" y2="440" />
        <line x1="60" y1="300" x2="70" y2="300" />
        <line x1="330" y1="300" x2="340" y2="300" />
      </g>

      <!-- hourglass frame -->
      <g :fill="theme.artInk">
        <rect x="130" y="180" width="140" height="8" />
        <rect x="130" y="412" width="140" height="8" />
      </g>

      <!-- hourglass glass -->
      <path d="M 140 188 L 260 188 L 210 300 L 260 412 L 140 412 L 190 300 Z"
        :fill="theme.artGlow" fill-opacity="0.25"
        :stroke="theme.artInk" stroke-width="2" />

      <!-- top sand -->
      <path d="M 145 192 L 255 192 L 215 280 L 185 280 Z"
        :fill="theme.artInk" opacity="0.75" />

      <!-- bottom sand pile -->
      <path d="M 165 408 L 235 408 L 220 350 Q 200 340 180 350 Z"
        :fill="theme.artInk" opacity="0.85" />

      <!-- falling sand stream -->
      <line x1="200" y1="298" x2="200" y2="350"
        :stroke="theme.artInk" stroke-width="2" opacity="0.85"
        class="sand-fall" />

      <text x="200" y="560" text-anchor="middle"
        :fill="theme.artInk" opacity="0.18"
        font-family="serif" font-size="100" font-weight="200"
        font-style="italic">V</text>
    </svg>

    <!-- ====== VI. KEYS -- pengorbanan ====== -->
    <svg
      v-else-if="art === 'keys'"
      class="art-svg"
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <!-- door silhouette behind -->
      <rect x="120" y="120" width="160" height="320" rx="80"
        :fill="theme.artInk" opacity="0.18" />
      <rect x="135" y="135" width="130" height="290" rx="65"
        fill="none" :stroke="theme.artInk" stroke-width="1" opacity="0.25" />

      <!-- chain hanging from top -->
      <line x1="200" y1="60" x2="200" y2="180"
        :stroke="theme.artInk" stroke-width="1.5" opacity="0.7" />

      <!-- key 1 (large) hanging -->
      <g :fill="theme.artInk" transform="translate(180 180) rotate(8)">
        <circle cx="20" cy="20" r="20" />
        <circle cx="20" cy="20" r="9" :fill="theme.artGlow" />
        <rect x="17" y="40" width="6" height="80" />
        <rect x="17" y="100" width="14" height="5" />
        <rect x="17" y="115" width="10" height="5" />
      </g>

      <!-- key 2 (smaller) hanging -->
      <g :fill="theme.artInk" transform="translate(220 200) rotate(-12)">
        <circle cx="14" cy="14" r="14" />
        <circle cx="14" cy="14" r="6" :fill="theme.artGlow" />
        <rect x="12" y="28" width="4" height="60" />
        <rect x="12" y="76" width="10" height="3" />
        <rect x="12" y="84" width="8" height="3" />
      </g>

      <!-- dropped key on floor -->
      <g :fill="theme.artInk" opacity="0.85" transform="translate(80 470) rotate(-25)">
        <circle cx="14" cy="14" r="14" />
        <circle cx="14" cy="14" r="6" :fill="theme.artGlow" />
        <rect x="12" y="28" width="4" height="55" />
        <rect x="12" y="74" width="10" height="3" />
      </g>

      <!-- floor line -->
      <line x1="40" y1="500" x2="360" y2="500"
        :stroke="theme.artInk" stroke-width="1" opacity="0.35" />

      <text x="200" y="560" text-anchor="middle"
        :fill="theme.artInk" opacity="0.18"
        font-family="serif" font-size="100" font-weight="200"
        font-style="italic">VI</text>
    </svg>

    <!-- ====== VII. DAWN -- fajar ====== -->
    <svg
      v-else-if="art === 'dawn'"
      class="art-svg"
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="sun-vii" cx="0.5" cy="0.55" r="0.45">
          <stop offset="0%" :stop-color="theme.artGlow" stop-opacity="1" />
          <stop offset="60%" :stop-color="theme.artGlow" stop-opacity="0.4" />
          <stop offset="100%" stop-color="transparent" />
        </radialGradient>
        <linearGradient id="water-vii" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" :stop-color="theme.artInk" stop-opacity="0.4" />
          <stop offset="100%" :stop-color="theme.artInk" stop-opacity="0.85" />
        </linearGradient>
      </defs>

      <!-- sun glow -->
      <circle cx="200" cy="280" r="180" fill="url(#sun-vii)" />
      <circle cx="200" cy="280" r="55" :fill="theme.artGlow" opacity="0.95" />

      <!-- horizon line -->
      <line x1="0" y1="320" x2="400" y2="320"
        :stroke="theme.artInk" stroke-width="1" opacity="0.55" />

      <!-- water -->
      <rect x="0" y="320" width="400" height="280" fill="url(#water-vii)" />

      <!-- sun reflection on water -->
      <g :fill="theme.artGlow" opacity="0.6">
        <ellipse cx="200" cy="335" rx="50" ry="3" />
        <ellipse cx="200" cy="350" rx="60" ry="2" />
        <ellipse cx="200" cy="370" rx="40" ry="2" />
        <ellipse cx="200" cy="395" rx="55" ry="2" />
        <ellipse cx="200" cy="425" rx="35" ry="1.5" />
      </g>

      <!-- two chairs silhouette -->
      <g :fill="theme.artInk" opacity="0.95">
        <!-- chair 1 -->
        <rect x="105" y="450" width="3" height="50" />
        <rect x="125" y="450" width="3" height="50" />
        <rect x="105" y="450" width="23" height="3" />
        <rect x="103" y="430" width="27" height="3" />
        <rect x="103" y="430" width="3" height="22" />
        <rect x="127" y="430" width="3" height="22" />
        <!-- chair 2 -->
        <rect x="265" y="450" width="3" height="50" />
        <rect x="285" y="450" width="3" height="50" />
        <rect x="265" y="450" width="23" height="3" />
        <rect x="263" y="430" width="27" height="3" />
        <rect x="263" y="430" width="3" height="22" />
        <rect x="287" y="430" width="3" height="22" />
      </g>

      <text x="200" y="560" text-anchor="middle"
        :fill="theme.artGlow" opacity="0.55"
        font-family="serif" font-size="100" font-weight="200"
        font-style="italic">VII</text>
    </svg>

    <!-- ====== VIII. SEA -- laut ====== -->
    <svg
      v-else-if="art === 'sea'"
      class="art-svg"
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="moon-viii" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" :stop-color="theme.artGlow" stop-opacity="1" />
          <stop offset="100%" :stop-color="theme.artGlow" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- starfield -->
      <g :fill="theme.artGlow">
        <circle cx="60" cy="80" r="1.2" opacity="0.7" class="star" style="animation-delay: 0s" />
        <circle cx="120" cy="50" r="0.9" opacity="0.5" class="star" style="animation-delay: 1.2s" />
        <circle cx="180" cy="90" r="1.3" opacity="0.8" class="star" style="animation-delay: 0.4s" />
        <circle cx="280" cy="60" r="1.0" opacity="0.6" class="star" style="animation-delay: 0.8s" />
        <circle cx="340" cy="120" r="1.5" opacity="0.7" class="star" style="animation-delay: 1.6s" />
        <circle cx="240" cy="140" r="0.8" opacity="0.5" class="star" style="animation-delay: 0.2s" />
        <circle cx="80" cy="180" r="1.0" opacity="0.6" class="star" style="animation-delay: 1.0s" />
      </g>

      <!-- moon glow -->
      <circle cx="290" cy="170" r="100" fill="url(#moon-viii)" />
      <circle cx="290" cy="170" r="42" :fill="theme.artGlow" opacity="0.95" />

      <!-- sea horizon -->
      <line x1="0" y1="280" x2="400" y2="280"
        :stroke="theme.artInk" stroke-width="0.5" opacity="0.4" />

      <!-- moon reflection on sea -->
      <g :fill="theme.artGlow" opacity="0.5">
        <ellipse cx="290" cy="300" rx="32" ry="2" />
        <ellipse cx="290" cy="320" rx="42" ry="2" />
        <ellipse cx="290" cy="345" rx="28" ry="1.5" />
        <ellipse cx="290" cy="375" rx="36" ry="1.5" />
        <ellipse cx="290" cy="410" rx="22" ry="1" />
      </g>

      <!-- layered waves -->
      <g :fill="theme.artInk">
        <path d="M 0 300 Q 50 290 100 300 T 200 300 T 300 300 T 400 300 L 400 600 L 0 600 Z"
          opacity="0.3" class="wave" style="animation-delay: 0s" />
        <path d="M 0 360 Q 60 350 120 360 T 240 360 T 360 360 T 480 360 L 400 600 L 0 600 Z"
          opacity="0.45" class="wave" style="animation-delay: 0.7s" />
        <path d="M 0 430 Q 80 420 160 430 T 320 430 T 480 430 L 400 600 L 0 600 Z"
          opacity="0.65" class="wave" style="animation-delay: 1.4s" />
        <path d="M 0 510 Q 100 500 200 510 T 400 510 T 600 510 L 400 600 L 0 600 Z"
          opacity="0.85" />
      </g>

      <text x="200" y="565" text-anchor="middle"
        :fill="theme.artGlow" opacity="0.5"
        font-family="serif" font-size="90" font-weight="200"
        font-style="italic">VIII</text>
    </svg>

    <!-- Mood label bottom-left -->
    <div class="mood-label" :style="{ color: theme.artGlow }">
      <span class="mood-num">{{ numeral }}</span>
      <span class="mood-text">{{ theme.mood }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Chapter, ChapterTheme } from '~/data/novel-laut'

const props = defineProps<{
  art: Chapter['art']
  theme: ChapterTheme
  numeral: string
}>()

const bgStyle = computed(() => ({
  background: `linear-gradient(155deg, ${props.theme.artBgFrom} 0%, ${props.theme.artBgTo} 100%)`,
}))
</script>

<style scoped>
.chapter-art {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255,255,255,0.012) 2px,
      rgba(255,255,255,0.012) 3px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.014) 2px,
      rgba(0,0,0,0.014) 3px
    );
  mix-blend-mode: overlay;
  opacity: 0.7;
}

.art-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* ====== Animations ====== */

@keyframes wind-drift {
  0%, 100% { transform: translateX(0); opacity: 0.55; }
  50% { transform: translateX(8px); opacity: 0.8; }
}
.wind-line {
  animation: wind-drift 7s ease-in-out infinite;
  transform-origin: center;
}

@keyframes steam-rise {
  0% { opacity: 0; transform: translate(0, 6px) scale(0.92); }
  40% { opacity: 0.6; }
  100% { opacity: 0; transform: translate(-2px, -16px) scale(1.08); }
}
.steam {
  animation: steam-rise 4s ease-out infinite;
  transform-origin: bottom center;
}

@keyframes petal-fall {
  0%, 100% { transform: translateY(0) rotate(0); opacity: 0.5; }
  50% { transform: translateY(20px) rotate(40deg); opacity: 0.7; }
}
.petal {
  animation: petal-fall 6s ease-in-out infinite;
  transform-origin: center;
  transform-box: fill-box;
}

@keyframes sand-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
.sand-fall {
  animation: sand-pulse 1.4s ease-in-out infinite;
}

@keyframes star-twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
.star {
  animation: star-twinkle 3.2s ease-in-out infinite;
}

@keyframes wave-drift {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-12px); }
}
.wave {
  animation: wave-drift 9s ease-in-out infinite;
}

/* ====== Mood label ====== */

.mood-label {
  position: absolute;
  bottom: 28px;
  left: 32px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: 'Cormorant Garamond', 'Juliett', serif;
  pointer-events: none;
  z-index: 5;
}

.mood-num {
  font-size: 14px;
  letter-spacing: 4px;
  opacity: 0.75;
  font-weight: 300;
}

.mood-text {
  font-size: 18px;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-style: italic;
  opacity: 0.85;
  font-weight: 300;
}

@media (max-width: 768px) {
  .mood-label {
    bottom: 18px;
    left: 22px;
  }
  .mood-num { font-size: 11px; }
  .mood-text { font-size: 14px; }
}
</style>
