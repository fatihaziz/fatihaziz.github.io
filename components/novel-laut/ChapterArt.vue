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
      <circle cx="100" cy="110" r="60" fill="url(#sun-i)" class="sun-pulse" />
      <circle cx="100" cy="110" r="32" :fill="theme.artGlow" opacity="0.85" class="sun-disc" />

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

      <!-- floating dust particles drifting on the wind -->
      <g :fill="theme.artInk">
        <ellipse cx="40"  cy="240" rx="3" ry="1.5" opacity="0.6" class="dust" style="animation-delay: 0s" />
        <ellipse cx="80"  cy="310" rx="2.5" ry="1.3" opacity="0.5" class="dust" style="animation-delay: 1.2s" />
        <ellipse cx="60"  cy="380" rx="3.5" ry="1.6" opacity="0.55" class="dust" style="animation-delay: 0.6s" />
        <ellipse cx="120" cy="270" rx="2" ry="1" opacity="0.45" class="dust" style="animation-delay: 2.4s" />
        <ellipse cx="40"  cy="430" rx="3" ry="1.5" opacity="0.6" class="dust" style="animation-delay: 1.8s" />
        <ellipse cx="100" cy="500" rx="2.5" ry="1.3" opacity="0.5" class="dust" style="animation-delay: 3.0s" />
      </g>

      <!-- running figure silhouette -->
      <g :fill="theme.artInk" opacity="0.85" class="runner">
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

      <!-- Two overlapping faces, oval-mask style. Each face breathes. -->
      <g :stroke="theme.artInk" fill="none" stroke-width="1.4">
        <!-- back face (slow breath, slight shift) -->
        <g class="mask-back">
          <ellipse cx="220" cy="280" rx="78" ry="100" opacity="0.55" />
          <ellipse cx="220" cy="240" rx="14" ry="6" opacity="0.4" />
          <ellipse cx="220" cy="280" rx="14" ry="6" opacity="0.4" />
          <path d="M 200 320 Q 220 332 240 320" opacity="0.4" />
        </g>

        <!-- front face (faster breath, opacity pulse) -->
        <g class="mask-front">
          <ellipse cx="170" cy="320" rx="78" ry="100" :fill="theme.artGlow" fill-opacity="0.18" />
          <ellipse cx="148" cy="290" rx="10" ry="4" :fill="theme.artInk" />
          <ellipse cx="192" cy="290" rx="10" ry="4" :fill="theme.artInk" />
          <path d="M 152 350 Q 170 358 188 350" />
        </g>
      </g>

      <!-- whisper traveling between the masks -->
      <g :stroke="theme.artGlow" fill="none" stroke-width="0.8" stroke-linecap="round">
        <path d="M 220 280 Q 195 300 170 320" opacity="0.5" class="whisper" style="animation-delay: 0s" />
        <path d="M 220 280 Q 200 305 180 330" opacity="0.4" class="whisper" style="animation-delay: 1.5s" />
        <path d="M 220 280 Q 190 295 160 310" opacity="0.45" class="whisper" style="animation-delay: 3.0s" />
      </g>

      <!-- vertical silence bars (opacity wave) -->
      <g :stroke="theme.artInk" stroke-width="1">
        <line x1="40"  y1="60" x2="40"  y2="540" opacity="0.18" class="silence-bar" style="animation-delay: 0s"   />
        <line x1="60"  y1="80" x2="60"  y2="520" opacity="0.18" class="silence-bar" style="animation-delay: 0.6s" />
        <line x1="340" y1="80" x2="340" y2="520" opacity="0.18" class="silence-bar" style="animation-delay: 1.2s" />
        <line x1="360" y1="60" x2="360" y2="540" opacity="0.18" class="silence-bar" style="animation-delay: 1.8s" />
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

      <!-- Stacked boxes (subtle breathing) -->
      <g class="gift-stack">
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
      </g>

      <!-- ribbon bow on top (rocking) -->
      <g :fill="theme.artGlow" opacity="0.85" class="ribbon-bow">
        <ellipse cx="190" cy="200" rx="14" ry="10" />
        <ellipse cx="210" cy="200" rx="14" ry="10" />
        <rect x="196" y="194" width="8" height="14" />
      </g>

      <!-- ribbon trailing off the side (flutter) -->
      <g :stroke="theme.artGlow" fill="none" stroke-width="3" stroke-linecap="round" opacity="0.7">
        <path d="M 196 208 Q 240 240 220 290 Q 200 340 250 380" class="ribbon-trail" />
      </g>

      <!-- continuous falling petals (more, varied trajectories) -->
      <g :fill="theme.artInk">
        <ellipse cx="60"  cy="-10" rx="6" ry="3" transform="rotate(20 60 -10)" opacity="0.55"
          class="petal-fall pf-1" style="animation-delay: 0s" />
        <ellipse cx="120" cy="-10" rx="5" ry="2.5" transform="rotate(-10 120 -10)" opacity="0.5"
          class="petal-fall pf-2" style="animation-delay: 1.5s" />
        <ellipse cx="180" cy="-10" rx="6" ry="3" transform="rotate(35 180 -10)" opacity="0.6"
          class="petal-fall pf-3" style="animation-delay: 3.0s" />
        <ellipse cx="260" cy="-10" rx="5" ry="2.5" transform="rotate(-25 260 -10)" opacity="0.5"
          class="petal-fall pf-1" style="animation-delay: 4.5s" />
        <ellipse cx="320" cy="-10" rx="6" ry="3" transform="rotate(15 320 -10)" opacity="0.55"
          class="petal-fall pf-2" style="animation-delay: 6.0s" />
        <ellipse cx="370" cy="-10" rx="4" ry="2" transform="rotate(-20 370 -10)" opacity="0.45"
          class="petal-fall pf-3" style="animation-delay: 2.2s" />
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
      <!-- faded clock face behind (slow rotating hand) -->
      <g :stroke="theme.artInk" fill="none" stroke-width="1" opacity="0.18">
        <circle cx="200" cy="300" r="160" />
        <circle cx="200" cy="300" r="140" />
        <line x1="200" y1="160" x2="200" y2="170" />
        <line x1="200" y1="430" x2="200" y2="440" />
        <line x1="60" y1="300" x2="70" y2="300" />
        <line x1="330" y1="300" x2="340" y2="300" />
      </g>
      <!-- slow-sweeping clock hand -->
      <g class="clock-hand" style="transform-origin: 200px 300px;">
        <line x1="200" y1="300" x2="200" y2="180"
          :stroke="theme.artInk" stroke-width="1.2" opacity="0.22" stroke-linecap="round" />
        <circle cx="200" cy="300" r="3" :fill="theme.artInk" opacity="0.35" />
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

      <!-- falling sand: continuous stream (always-on line) + 5 staggered grains -->
      <line x1="200" y1="298" x2="200" y2="350"
        :stroke="theme.artInk" stroke-width="2" opacity="0.85"
        class="sand-fall" />
      <g :fill="theme.artInk">
        <circle cx="200" cy="298" r="1.6" opacity="0.95" class="sand-grain" style="animation-delay: 0s" />
        <circle cx="200" cy="298" r="1.4" opacity="0.9" class="sand-grain" style="animation-delay: 0.3s" />
        <circle cx="200" cy="298" r="1.8" opacity="0.95" class="sand-grain" style="animation-delay: 0.6s" />
        <circle cx="200" cy="298" r="1.5" opacity="0.9" class="sand-grain" style="animation-delay: 0.9s" />
        <circle cx="200" cy="298" r="1.7" opacity="0.95" class="sand-grain" style="animation-delay: 1.2s" />
      </g>

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

      <!-- chain hanging from top (sway with the keys) -->
      <g class="key-sway" style="transform-origin: 200px 60px;">
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
      </g>

      <!-- dropped key on floor (glint sweep) -->
      <g :fill="theme.artInk" opacity="0.85" transform="translate(80 470) rotate(-25)">
        <circle cx="14" cy="14" r="14" />
        <circle cx="14" cy="14" r="6" :fill="theme.artGlow" />
        <rect x="12" y="28" width="4" height="55" />
        <rect x="12" y="74" width="10" height="3" />
        <!-- glint highlight that sweeps across -->
        <circle cx="14" cy="14" r="3" :fill="theme.artGlow" class="key-glint" />
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

      <!-- light rays radiating from sun (rotating) -->
      <g class="sun-rays" style="transform-origin: 200px 280px;"
        :stroke="theme.artGlow" stroke-width="1" opacity="0.35">
        <line x1="200" y1="280" x2="200" y2="60" />
        <line x1="200" y1="280" x2="380" y2="100" />
        <line x1="200" y1="280" x2="40" y2="120" />
        <line x1="200" y1="280" x2="380" y2="240" />
        <line x1="200" y1="280" x2="40" y2="240" />
        <line x1="200" y1="280" x2="320" y2="60" />
        <line x1="200" y1="280" x2="80" y2="60" />
      </g>

      <!-- sun glow + disc (rising motion) -->
      <g class="sun-rise" style="transform-origin: 200px 280px;">
        <circle cx="200" cy="280" r="180" fill="url(#sun-vii)" />
        <circle cx="200" cy="280" r="55" :fill="theme.artGlow" opacity="0.95" class="sun-disc" />
      </g>

      <!-- horizon line -->
      <line x1="0" y1="320" x2="400" y2="320"
        :stroke="theme.artInk" stroke-width="1" opacity="0.55" />

      <!-- water -->
      <rect x="0" y="320" width="400" height="280" fill="url(#water-vii)" />

      <!-- sun reflection on water (each ellipse ripples scaleX with stagger) -->
      <g :fill="theme.artGlow" opacity="0.6">
        <ellipse cx="200" cy="335" rx="50" ry="3"  class="ripple" style="animation-delay: 0s; transform-origin: 200px 335px;" />
        <ellipse cx="200" cy="350" rx="60" ry="2"  class="ripple" style="animation-delay: 0.4s; transform-origin: 200px 350px;" />
        <ellipse cx="200" cy="370" rx="40" ry="2"  class="ripple" style="animation-delay: 0.8s; transform-origin: 200px 370px;" />
        <ellipse cx="200" cy="395" rx="55" ry="2"  class="ripple" style="animation-delay: 1.2s; transform-origin: 200px 395px;" />
        <ellipse cx="200" cy="425" rx="35" ry="1.5" class="ripple" style="animation-delay: 1.6s; transform-origin: 200px 425px;" />
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

      <!-- shooting star (occasional traversal across sky) -->
      <g class="shooting-star">
        <line x1="0" y1="0" x2="42" y2="14"
          :stroke="theme.artGlow" stroke-width="1.4" stroke-linecap="round" opacity="0.85" />
        <circle cx="42" cy="14" r="2" :fill="theme.artGlow" />
      </g>

      <!-- moon glow (halo pulse) -->
      <circle cx="290" cy="170" r="100" fill="url(#moon-viii)" class="moon-halo" />
      <circle cx="290" cy="170" r="42" :fill="theme.artGlow" opacity="0.95" class="moon-disc" />

      <!-- sea horizon -->
      <line x1="0" y1="280" x2="400" y2="280"
        :stroke="theme.artInk" stroke-width="0.5" opacity="0.4" />

      <!-- moon reflection on sea (ripple scaleX stagger) -->
      <g :fill="theme.artGlow" opacity="0.5">
        <ellipse cx="290" cy="300" rx="32" ry="2"  class="ripple" style="animation-delay: 0s;   transform-origin: 290px 300px;" />
        <ellipse cx="290" cy="320" rx="42" ry="2"  class="ripple" style="animation-delay: 0.5s; transform-origin: 290px 320px;" />
        <ellipse cx="290" cy="345" rx="28" ry="1.5" class="ripple" style="animation-delay: 1.0s; transform-origin: 290px 345px;" />
        <ellipse cx="290" cy="375" rx="36" ry="1.5" class="ripple" style="animation-delay: 1.5s; transform-origin: 290px 375px;" />
        <ellipse cx="290" cy="410" rx="22" ry="1"   class="ripple" style="animation-delay: 2.0s; transform-origin: 290px 410px;" />
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

/* ====== I. WIND -- dust + sun-pulse ====== */
@keyframes dust-drift {
  0%   { opacity: 0; transform: translate(0, 0) scale(0.8); }
  20%  { opacity: 0.7; }
  100% { opacity: 0; transform: translate(80px, -10px) scale(1.1); }
}
.dust {
  animation: dust-drift 6s linear infinite;
  transform-origin: center;
  transform-box: fill-box;
}

@keyframes sun-glow-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.75; }
}
.sun-pulse {
  animation: sun-glow-pulse 5s ease-in-out infinite;
}
.sun-disc {
  animation: sun-glow-pulse 5s ease-in-out infinite;
}

/* tiny stride-bob on the running silhouette */
@keyframes runner-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
.runner {
  animation: runner-bob 1.4s ease-in-out infinite;
  transform-origin: bottom center;
  transform-box: fill-box;
}

/* ====== II. MASK -- breath + whisper + silence-bars ====== */
@keyframes mask-breath {
  0%, 100% { opacity: 1; transform: translate(0, 0); }
  50% { opacity: 0.7; transform: translate(0, 2px); }
}
.mask-front {
  animation: mask-breath 4s ease-in-out infinite;
  transform-origin: 170px 320px;
  transform-box: fill-box;
}
.mask-back {
  animation: mask-breath 5.5s ease-in-out infinite;
  animation-delay: -1.5s;
  transform-origin: 220px 280px;
  transform-box: fill-box;
}

@keyframes whisper-trail {
  0%   { opacity: 0; stroke-dasharray: 0 100; }
  30%  { opacity: 0.7; }
  100% { opacity: 0; stroke-dasharray: 100 0; }
}
.whisper {
  stroke-dasharray: 0 100;
  animation: whisper-trail 4.5s ease-out infinite;
}

@keyframes bar-pulse {
  0%, 100% { opacity: 0.08; }
  50% { opacity: 0.3; }
}
.silence-bar {
  animation: bar-pulse 4s ease-in-out infinite;
}

/* ====== IV. GIFT -- ribbon flutter + petal stream + stack breath ====== */
@keyframes stack-breath {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
.gift-stack {
  animation: stack-breath 5s ease-in-out infinite;
  transform-origin: bottom center;
  transform-box: fill-box;
}

@keyframes bow-rock {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}
.ribbon-bow {
  animation: bow-rock 3.5s ease-in-out infinite;
  transform-origin: 200px 200px;
  transform-box: fill-box;
}

@keyframes ribbon-wave {
  0%, 100% { stroke-dashoffset: 0; opacity: 0.7; }
  50% { stroke-dashoffset: 6; opacity: 0.85; }
}
.ribbon-trail {
  stroke-dasharray: 12 4;
  animation: ribbon-wave 3s ease-in-out infinite;
}

@keyframes petal-stream {
  0%   { opacity: 0; transform: translate(0, 0) rotate(0deg); }
  10%  { opacity: 0.6; }
  100% { opacity: 0; transform: translate(var(--px, 20px), 620px) rotate(540deg); }
}
.petal-fall {
  animation: petal-stream 9s linear infinite;
  transform-origin: center;
  transform-box: fill-box;
}
.pf-1 { --px: 20px; }
.pf-2 { --px: -30px; }
.pf-3 { --px: 40px; animation-duration: 11s; }

/* ====== V. HOURGLASS -- sand grains + clock hand ====== */
@keyframes sand-drop {
  0%   { transform: translateY(0); opacity: 0; }
  10%  { opacity: 0.95; }
  90%  { opacity: 0.95; }
  100% { transform: translateY(60px); opacity: 0; }
}
.sand-grain {
  animation: sand-drop 1.2s linear infinite;
  transform-origin: center;
  transform-box: fill-box;
}

@keyframes clock-sweep {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.clock-hand {
  animation: clock-sweep 30s linear infinite;
}

/* ====== VI. KEYS -- pendulum + glint ====== */
@keyframes key-pendulum {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}
.key-sway {
  animation: key-pendulum 4s ease-in-out infinite;
}

@keyframes key-glint {
  0%, 100% { opacity: 0.4; transform: translate(0, 0) scale(1); }
  50% { opacity: 1; transform: translate(2px, 0) scale(1.4); }
}
.key-glint {
  animation: key-glint 3s ease-in-out infinite;
  transform-origin: center;
  transform-box: fill-box;
}

/* ====== VII. DAWN -- rays rotate + sun rise + ripple ====== */
@keyframes ray-rotate {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.sun-rays {
  animation: ray-rotate 60s linear infinite;
  opacity: 0.35;
}

@keyframes sun-rise {
  0%, 100% { transform: translateY(8px); }
  50% { transform: translateY(-4px); }
}
.sun-rise {
  animation: sun-rise 8s ease-in-out infinite;
}

@keyframes ripple {
  0%, 100% { transform: scaleX(1); opacity: 0.6; }
  50% { transform: scaleX(1.15); opacity: 0.85; }
}
.ripple {
  animation: ripple 4s ease-in-out infinite;
}

/* ====== VIII. SEA -- shooting star + moon halo ====== */
@keyframes shoot {
  0%   { transform: translate(-60px, 80px) rotate(20deg); opacity: 0; }
  4%   { opacity: 1; }
  16%  { opacity: 1; }
  20%  { transform: translate(440px, 230px) rotate(20deg); opacity: 0; }
  100% { transform: translate(440px, 230px) rotate(20deg); opacity: 0; }
}
.shooting-star {
  animation: shoot 9s ease-in infinite;
}

@keyframes halo-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.08); }
}
.moon-halo {
  animation: halo-pulse 6s ease-in-out infinite;
  transform-origin: 290px 170px;
  transform-box: fill-box;
}
.moon-disc {
  animation: halo-pulse 6s ease-in-out infinite;
  transform-origin: 290px 170px;
  transform-box: fill-box;
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
