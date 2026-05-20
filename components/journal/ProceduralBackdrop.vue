<template>
  <div class="backdrop" :class="{ still }" :style="rootStyle" aria-hidden="true">
    <svg class="bd-svg" :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient :id="orbId" cx="50%" cy="50%" r="50%">
          <stop offset="0%" :stop-color="pal.glow" stop-opacity="0.9" />
          <stop offset="55%" :stop-color="pal.glow" stop-opacity="0.22" />
          <stop offset="100%" :stop-color="pal.glow" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- glow orb (sun / moon) -->
      <circle :cx="orb.x" :cy="orb.y" :r="orb.r" :fill="`url(#${orbId})`" class="bd-orb" />
      <circle :cx="orb.x" :cy="orb.y" :r="orb.core" :fill="pal.glow" opacity="0.85" class="bd-core" />

      <!-- starfield -->
      <g :fill="pal.glow">
        <circle
          v-for="(s, i) in stars"
          :key="`s${i}`"
          :cx="s.x" :cy="s.y" :r="s.r" :opacity="s.o"
          class="bd-star"
          :style="{ animationDelay: `${s.d}s` }"
        />
      </g>

      <!-- drifting particles -->
      <g :fill="pal.ink">
        <ellipse
          v-for="(p, i) in particles"
          :key="`p${i}`"
          :cx="p.x" :cy="p.y" :rx="p.rx" :ry="p.ry" :opacity="p.o"
          class="bd-dust"
          :style="{ animationDelay: `${p.d}s`, animationDuration: `${p.dur}s` }"
        />
      </g>

      <!-- layered waves -->
      <g :fill="pal.ink">
        <path
          v-for="(w, i) in waves"
          :key="`w${i}`"
          :d="w.d" :opacity="w.o"
          class="bd-wave"
          :style="{ animationDelay: `${w.delay}s`, animationDuration: `${w.dur}s` }"
        />
      </g>
    </svg>

    <div class="bd-grain"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PALETTES, paletteByName } from '~/data/journal-themes'

const props = withDefaults(
  defineProps<{
    seed: string
    theme?: string
    /** disable animations (used on list cards) */
    still?: boolean
  }>(),
  { theme: '', still: false },
)

const W = 1200
const H = 1600

// ---- deterministic PRNG seeded from the story seed string ----
function hashSeed(str: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
function mulberry32(a: number) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const orbId = computed(() => `bd-orb-${(props.seed || 'x').replace(/[^a-z0-9]/gi, '')}`)

// Palette: explicit theme name wins; otherwise pick deterministically from seed.
const pal = computed(() => {
  if (props.theme) return paletteByName(props.theme)
  return PALETTES[hashSeed(props.seed || 'x') % PALETTES.length]
})

const model = computed(() => {
  const r = mulberry32(hashSeed(props.seed || 'seed'))
  const rand = (min: number, max: number) => min + r() * (max - min)
  const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1))

  const orb = {
    x: rand(0.12, 0.88) * W,
    y: rand(0.08, 0.4) * H,
    r: rand(0.22, 0.42) * W,
    core: rand(0.04, 0.09) * W,
  }

  const starCount = randInt(18, 30)
  const stars = Array.from({ length: starCount }, () => ({
    x: rand(0, W),
    y: rand(0, 0.55 * H),
    r: rand(0.8, 2.6),
    o: rand(0.35, 0.85),
    d: rand(0, 4),
  }))

  const particleCount = randInt(8, 16)
  const particles = Array.from({ length: particleCount }, () => ({
    x: rand(0, W),
    y: rand(0.3 * H, 0.9 * H),
    rx: rand(2, 6),
    ry: rand(1, 3),
    o: rand(0.3, 0.6),
    d: rand(0, 6),
    dur: rand(7, 13),
  }))

  // Layered Q-curve waves rising from the bottom.
  const waveCount = 4
  const seg = 4
  const step = W / seg
  const baseTop = rand(0.5, 0.62) * H
  const waves = Array.from({ length: waveCount }, (_, i) => {
    const y = baseTop + (i / waveCount) * (0.42 * H)
    const amp = rand(24, 90)
    let d = `M 0 ${y.toFixed(1)}`
    for (let s = 0; s < seg; s++) {
      const cx = step * s + step / 2
      const cy = y + (s % 2 === 0 ? -amp : amp)
      const ex = step * (s + 1)
      d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${y.toFixed(1)}`
    }
    d += ` L ${W} ${H} L 0 ${H} Z`
    return {
      d,
      o: 0.25 + (i / waveCount) * 0.6,
      delay: rand(0, 2),
      dur: rand(8, 14),
    }
  })

  const angle = randInt(140, 210)
  return { orb, stars, particles, waves, angle }
})

const orb = computed(() => model.value.orb)
const stars = computed(() => model.value.stars)
const particles = computed(() => model.value.particles)
const waves = computed(() => model.value.waves)

const rootStyle = computed(() => ({
  background: `linear-gradient(${model.value.angle}deg, ${pal.value.bgFrom} 0%, ${pal.value.bgTo} 100%)`,
}))
</script>

<style scoped>
.backdrop {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.bd-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
.bd-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.012) 2px, rgba(255, 255, 255, 0.012) 3px),
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 0, 0, 0.014) 2px, rgba(0, 0, 0, 0.014) 3px);
  mix-blend-mode: overlay;
  opacity: 0.7;
}

@keyframes bd-wave-drift {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-22px); }
}
.bd-wave { animation: bd-wave-drift 11s ease-in-out infinite; }

@keyframes bd-twinkle {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.9; }
}
.bd-star { animation: bd-twinkle 3.4s ease-in-out infinite; }

@keyframes bd-drift {
  0% { opacity: 0; transform: translate(0, 0); }
  20% { opacity: 0.6; }
  100% { opacity: 0; transform: translate(60px, -24px); }
}
.bd-dust {
  animation: bd-drift 10s linear infinite;
  transform-box: fill-box;
  transform-origin: center;
}

@keyframes bd-pulse {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 0.62; }
}
.bd-orb, .bd-core { animation: bd-pulse 7s ease-in-out infinite; }

.still .bd-wave,
.still .bd-star,
.still .bd-dust,
.still .bd-orb,
.still .bd-core {
  animation: none;
}

@media (prefers-reduced-motion: reduce) {
  .bd-wave, .bd-star, .bd-dust, .bd-orb, .bd-core { animation: none; }
}
</style>
