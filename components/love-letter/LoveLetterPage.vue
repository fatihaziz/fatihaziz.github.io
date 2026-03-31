<template>
  <div class="content-page" :style="bgStyle">
    <!-- Background hearts (faint, scattered) -->
    <div class="bg-hearts" aria-hidden="true">
      <span v-for="i in 8" :key="i" class="bg-heart" :class="`bh-${i}`"></span>
    </div>

    <div
      class="page-inner"
      :style="paperStyle"
    >
      <!-- Stickers layer -->
      <div class="stickers-layer" aria-hidden="true">
        <template v-for="(sticker, idx) in pageData.theme.stickers" :key="idx">
          <span
            v-if="sticker.type === 'confetti'"
            class="sticker sticker-confetti"
            :style="stickerPositionStyle(sticker)"
          />
          <span
            v-else-if="sticker.type === 'ribbon'"
            class="sticker sticker-ribbon"
            :style="stickerPositionStyle(sticker)"
          />
          <span
            v-else
            class="sticker sticker-char"
            :style="stickerPositionStyle(sticker)"
          >{{ stickerChar(sticker.type) }}</span>
        </template>
      </div>

      <!-- Origami shapes taped to sides of paper -->
      <div class="origami-layer" aria-hidden="true">
        <div
          v-for="(ori, idx) in origamiShapes"
          :key="idx"
          class="origami-piece"
          :class="ori.shape"
          :style="ori.style"
        >
          <div class="origami-tape"></div>
        </div>
      </div>

      <!-- Photos at corners (absolutely positioned, overflow visible) -->
      <LoveLetterTapedPhoto
        v-for="(photo, idx) in pageData.photos"
        :key="photo.src"
        :src="photo.src"
        :alt="photo.alt"
        :caption="photo.caption"
        :position="photo.position"
        :rotation="photo.rotation"
        :class="{ 'animate-photo': isActive }"
        :style="{ animationDelay: `${0.2 + idx * 0.15}s` }"
      />

      <!-- Page number label -->
      <div
        v-if="pageData.pageNumber"
        class="page-number"
        :style="{ color: pageData.theme.goldColor }"
      >
        {{ pageData.pageNumber }}
      </div>

      <!-- Title -->
      <h2
        v-if="pageData.title"
        class="page-title"
        :class="[pageData.theme.titleFont, { 'animate-in': isActive }]"
        :style="{ color: pageData.theme.inkColor }"
      >
        {{ pageData.title }}
      </h2>

      <!-- Subtitle -->
      <p
        v-if="pageData.subtitle"
        class="page-title-sub"
        :class="{ 'animate-in': isActive }"
        :style="{ color: pageData.theme.roseColor }"
      >
        {{ pageData.subtitle }}
      </p>

      <!-- Separator -->
      <div
        v-if="pageData.title"
        class="separator"
        :style="{ background: pageData.theme.goldColor }"
      />

      <!-- Essay text (continuous flow, photos are at corners) -->
      <div
        v-for="(block, idx) in pageData.textBlocks"
        :key="idx"
        class="essay-text"
        :class="[pageData.theme.bodyFont, { 'animate-in': isActive }]"
        :style="textStyle"
        v-html="block"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PageData, StickerData } from '~/data/love-letter'

const props = defineProps<{
  pageData: PageData
  isActive: boolean
}>()

const STICKER_CHARS: Record<string, string> = {
  heart: '\u2665',
  star: '\u2605',
  flower: '\u273F',
  sparkle: '\u2726',
  butterfly: '\u2666',
  moon: '\u263D',
}

const paperStyle = computed(() => ({
  background: props.pageData.theme.paperColor,
  '--line-color': props.pageData.theme.lineColor,
}))

// Tinted radial glow behind the paper + heart color for bg decorations
const bgStyle = computed(() => ({
  '--bg-glow': props.pageData.theme.paperColor,
  '--bg-heart-color': props.pageData.theme.roseColor,
}))

// Origami shapes taped to the sides -- different per page
const origamiLayouts: Record<string, Array<{ shape: string; style: Record<string, string> }>> = {
  gratitude: [
    { shape: 'ori-heart',     style: { top: '18%', left: '-18px', transform: 'rotate(-8deg)',  '--ori-color': '#e8b0b0', '--ori-fold': 'rgba(0,0,0,0.06)' } },
    { shape: 'ori-butterfly', style: { top: '45%', right: '-16px', transform: 'rotate(10deg)', '--ori-color': '#e8d090', '--ori-fold': 'rgba(0,0,0,0.05)' } },
    { shape: 'ori-star',      style: { top: '70%', left: '-12px', transform: 'rotate(15deg)',  '--ori-color': '#d4c090', '--ori-fold': 'rgba(0,0,0,0.05)' } },
    { shape: 'ori-crane',     style: { top: '85%', right: '-18px', transform: 'rotate(-6deg)', '--ori-color': '#d8c8b0', '--ori-fold': 'rgba(0,0,0,0.05)' } },
  ],
  love: [
    { shape: 'ori-heart',  style: { top: '12%', right: '-20px', transform: 'rotate(-10deg)', '--ori-color': '#e89898', '--ori-fold': 'rgba(0,0,0,0.07)' } },
    { shape: 'ori-cat',    style: { top: '35%', left: '-14px', transform: 'rotate(8deg)',     '--ori-color': '#f0b8c0', '--ori-fold': 'rgba(0,0,0,0.05)' } },
    { shape: 'ori-heart',  style: { top: '55%', left: '-16px', transform: 'rotate(6deg)',     '--ori-color': '#f0b0b8', '--ori-fold': 'rgba(0,0,0,0.05)' } },
    { shape: 'ori-rabbit', style: { top: '68%', right: '-14px', transform: 'rotate(-12deg)',  '--ori-color': '#f0c8a0', '--ori-fold': 'rgba(0,0,0,0.05)' } },
    { shape: 'ori-star',   style: { top: '85%', right: '-12px', transform: 'rotate(14deg)',   '--ori-color': '#d8a0b0', '--ori-fold': 'rgba(0,0,0,0.06)' } },
  ],
  commitment: [
    { shape: 'ori-crane',     style: { top: '15%', left: '-18px', transform: 'rotate(10deg)',  '--ori-color': '#c0a8d0', '--ori-fold': 'rgba(0,0,0,0.06)' } },
    { shape: 'ori-heart',     style: { top: '42%', left: '-14px', transform: 'rotate(-8deg)',  '--ori-color': '#d0b0d8', '--ori-fold': 'rgba(0,0,0,0.06)' } },
    { shape: 'ori-butterfly', style: { top: '55%', right: '-16px', transform: 'rotate(-12deg)','--ori-color': '#b8c0e0', '--ori-fold': 'rgba(0,0,0,0.05)' } },
    { shape: 'ori-star',      style: { top: '75%', right: '-14px', transform: 'rotate(16deg)', '--ori-color': '#b0b8d0', '--ori-fold': 'rgba(0,0,0,0.05)' } },
    { shape: 'ori-rabbit',    style: { top: '88%', left: '-12px', transform: 'rotate(6deg)',   '--ori-color': '#c8b0d8', '--ori-fold': 'rgba(0,0,0,0.06)' } },
  ],
}

const origamiShapes = computed(() => origamiLayouts[props.pageData.id] || [])

const textStyle = computed(() => ({
  color: props.pageData.theme.inkColor,
  '--highlight-color': props.pageData.theme.accentColor,
  '--accent-color': props.pageData.theme.roseColor,
}))

function stickerChar(type: string): string {
  return STICKER_CHARS[type] || ''
}

function stickerPositionStyle(sticker: StickerData): Record<string, string> {
  const style: Record<string, string> = {
    transform: `rotate(${sticker.rotation}deg)`,
    opacity: String(sticker.opacity),
  }
  if (sticker.top) style.top = sticker.top
  if (sticker.bottom) style.bottom = sticker.bottom
  if (sticker.left) style.left = sticker.left
  if (sticker.right) style.right = sticker.right

  if (sticker.type === 'confetti') {
    style.width = sticker.size
    style.height = sticker.size
    style.background = sticker.color
  } else if (sticker.type === 'ribbon') {
    style.width = sticker.size
    style.background = sticker.color
  } else {
    style.fontSize = sticker.size
    style.color = sticker.color
  }
  return style
}
</script>

<style scoped>
.content-page {
  padding: 80px 0;
  position: relative;
  /* Soft radial glow behind the paper */
  background:
    radial-gradient(ellipse at center, var(--bg-glow, rgba(250,247,242,0.3)) 0%, transparent 55%),
    /* Subtle linen texture */
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(0,0,0,0.008) 3px,
      rgba(0,0,0,0.008) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 3px,
      rgba(0,0,0,0.006) 3px,
      rgba(0,0,0,0.006) 4px
    );
}

/* ===== BACKGROUND HEARTS ===== */
.bg-hearts {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-heart {
  position: absolute;
  display: block;
  opacity: 0;
  color: var(--bg-heart-color, rgba(200,100,100,0.15));
  animation: bg-float 12s ease-in-out infinite;
}

.bg-heart::before,
.bg-heart::after {
  content: '';
  position: absolute;
  width: 50%;
  height: 100%;
  top: 0;
}

/* Left half - lighter (origami fold effect) */
.bg-heart::before {
  left: 0;
  background:
    linear-gradient(135deg, currentColor 50%, transparent 50%),
    linear-gradient(225deg, currentColor 50%, transparent 50%);
  background-size: 100% 50%, 100% 50%;
  background-position: top, bottom;
  background-repeat: no-repeat;
  border-radius: 50% 0 0 0;
  opacity: 0.9;
}

/* Right half - darker (origami fold shadow) */
.bg-heart::after {
  right: 0;
  background:
    linear-gradient(45deg, currentColor 50%, transparent 50%),
    linear-gradient(315deg, currentColor 50%, transparent 50%);
  background-size: 100% 50%, 100% 50%;
  background-position: top, bottom;
  background-repeat: no-repeat;
  border-radius: 0 50% 0 0;
  opacity: 0.7;
  border-left: 1px solid rgba(0,0,0,0.04);
}

/* 8 scattered hearts with staggered positions */
.bh-1 { width: 18px; height: 18px; top: 8%;  left: 6%;  animation-delay: 0s;   animation-duration: 10s; }
.bh-2 { width: 12px; height: 12px; top: 25%; right: 8%; animation-delay: 2s;   animation-duration: 13s; }
.bh-3 { width: 22px; height: 22px; top: 45%; left: 4%;  animation-delay: 4s;   animation-duration: 11s; }
.bh-4 { width: 10px; height: 10px; top: 60%; right: 5%; animation-delay: 1s;   animation-duration: 14s; }
.bh-5 { width: 16px; height: 16px; top: 75%; left: 8%;  animation-delay: 3s;   animation-duration: 12s; }
.bh-6 { width: 14px; height: 14px; top: 15%; right: 4%; animation-delay: 5s;   animation-duration: 10s; }
.bh-7 { width: 20px; height: 20px; top: 85%; right: 7%; animation-delay: 2.5s; animation-duration: 15s; }
.bh-8 { width: 11px; height: 11px; top: 35%; left: 3%;  animation-delay: 6s;   animation-duration: 11s; }

@keyframes bg-float {
  0%, 100% {
    opacity: 0;
    transform: translateY(0) scale(0.8);
  }
  15% {
    opacity: 0.12;
  }
  50% {
    opacity: 0.18;
    transform: translateY(-15px) scale(1);
  }
  85% {
    opacity: 0.12;
  }
}

/* ===== ORIGAMI SHAPES TAPED TO SIDES ===== */
.origami-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.origami-piece {
  position: absolute;
}

/* Tape strip on origami -- horizontal tape on the side */
.origami-tape {
  position: absolute;
  width: 50px;
  height: 14px;
  background: linear-gradient(
    155deg,
    rgba(215, 198, 162, 0.75),
    rgba(200, 183, 147, 0.45)
  );
  border-radius: 1px;
  top: 8px;
  left: 50%;
  margin-left: -25px;
  transform: rotate(2deg);
  z-index: 2;
}

/* ---- Origami Heart ---- */
.ori-heart {
  width: 38px;
  height: 38px;
  position: relative;
}

/* Two halves with fold effect */
.ori-heart::before {
  content: '';
  position: absolute;
  width: 50%;
  height: 100%;
  left: 0;
  top: 0;
  background:
    linear-gradient(135deg, var(--ori-color, #e8b0b0) 50%, transparent 50%) no-repeat,
    linear-gradient(225deg, var(--ori-color, #e8b0b0) 50%, transparent 50%) no-repeat;
  background-size: 100% 50%, 100% 50%;
  background-position: top, bottom;
  border-radius: 50% 0 0 0;
  filter: brightness(1.05);
}

.ori-heart::after {
  content: '';
  position: absolute;
  width: 50%;
  height: 100%;
  right: 0;
  top: 0;
  background:
    linear-gradient(45deg, var(--ori-color, #e8b0b0) 50%, transparent 50%) no-repeat,
    linear-gradient(315deg, var(--ori-color, #e8b0b0) 50%, transparent 50%) no-repeat;
  background-size: 100% 50%, 100% 50%;
  background-position: top, bottom;
  border-radius: 0 50% 0 0;
  filter: brightness(0.95);
  border-left: 1px solid var(--ori-fold, rgba(0,0,0,0.06));
}

/* ---- Origami Star ---- */
.ori-star {
  width: 32px;
  height: 32px;
  position: relative;
  background: var(--ori-color, #e8d090);
  clip-path: polygon(
    50% 0%, 61% 35%, 98% 35%,
    68% 57%, 79% 91%,
    50% 70%, 21% 91%,
    32% 57%, 2% 35%, 39% 35%
  );
}

/* Fold line on star */
.ori-star::after {
  content: '';
  position: absolute;
  width: 1px;
  height: 100%;
  left: 50%;
  top: 0;
  background: var(--ori-fold, rgba(0,0,0,0.06));
}

/* ---- Origami Crane ---- */
.ori-crane {
  width: 42px;
  height: 36px;
  position: relative;
  background: var(--ori-color, #d0c8b8);
  clip-path: polygon(
    0% 20%, 30% 45%, 5% 65%, 25% 55%, 35% 55%,
    50% 80%, 65% 55%, 75% 55%, 95% 65%, 70% 45%,
    100% 20%, 50% 40%
  );
}

.ori-crane::after {
  content: '';
  position: absolute;
  width: 1px;
  height: 100%;
  left: 50%;
  top: 0;
  background: var(--ori-fold, rgba(0,0,0,0.06));
}

/* ---- Origami Butterfly ---- */
.ori-butterfly {
  width: 38px;
  height: 34px;
  position: relative;
  background: var(--ori-color, #c8b0d8);
  clip-path: polygon(
    50% 0%, 75% 5%, 100% 15%, 95% 40%, 58% 50%,
    95% 55%, 100% 75%, 80% 95%, 55% 75%, 50% 100%,
    45% 75%, 20% 95%, 0% 75%, 5% 55%, 42% 50%,
    5% 40%, 0% 15%, 25% 5%
  );
}

.ori-butterfly::after {
  content: '';
  position: absolute;
  width: 1px;
  height: 100%;
  left: 50%;
  top: 0;
  background: var(--ori-fold, rgba(0,0,0,0.06));
}

/* ---- Origami Rabbit ---- */
.ori-rabbit {
  width: 32px;
  height: 42px;
  position: relative;
  background: var(--ori-color, #e0d0c0);
  clip-path: polygon(
    25% 0%, 18% 30%, 30% 35%, 20% 40%, 8% 60%,
    15% 85%, 25% 100%, 50% 95%, 75% 100%, 85% 85%,
    92% 60%, 80% 40%, 70% 35%, 82% 30%, 75% 0%,
    65% 25%, 50% 32%, 35% 25%
  );
}

.ori-rabbit::after {
  content: '';
  position: absolute;
  width: 1px;
  height: 100%;
  left: 50%;
  top: 0;
  background: var(--ori-fold, rgba(0,0,0,0.06));
}

/* ---- Origami Cat ---- */
.ori-cat {
  width: 34px;
  height: 36px;
  position: relative;
  background: var(--ori-color, #d8c8b0);
  clip-path: polygon(
    12% 0%, 5% 30%, 2% 55%, 15% 85%, 30% 97%,
    50% 100%, 70% 97%, 85% 85%, 98% 55%, 95% 30%,
    88% 0%, 72% 25%, 62% 28%, 50% 25%, 38% 28%, 28% 25%
  );
}

.ori-cat::after {
  content: '';
  position: absolute;
  width: 1px;
  height: 100%;
  left: 50%;
  top: 0;
  background: var(--ori-fold, rgba(0,0,0,0.06));
}

/* Shadow for all origami to look like paper */
.ori-heart,
.ori-star,
.ori-crane,
.ori-butterfly,
.ori-rabbit,
.ori-cat {
  filter: drop-shadow(1px 2px 3px rgba(0,0,0,0.1));
}

/* Paper card - wider with gutter zones for corner photos */
.page-inner {
  width: 640px;
  max-width: 100%;
  margin: 0 auto;
  padding: 120px 90px 120px;
  border-radius: 3px;
  position: relative;
  overflow: visible;
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.08),
    0 12px 40px rgba(0, 0, 0, 0.13);
}

/* Paper texture lines - uses CSS variable from theme */
.page-inner::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 3px;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 27px,
    var(--line-color, rgba(170, 150, 120, 0.03)) 27px,
    var(--line-color, rgba(170, 150, 120, 0.03)) 28px
  );
  pointer-events: none;
  z-index: 0;
}

/* Book spine shadow */
.page-inner::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 22px;
  border-radius: 3px 0 0 3px;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.03), transparent);
  pointer-events: none;
  z-index: 0;
}

/* Stickers */
.stickers-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
  border-radius: 3px;
}

.sticker {
  position: absolute;
  pointer-events: none;
  line-height: 1;
  user-select: none;
}

.sticker-char {
  display: inline-block;
}

.sticker-confetti {
  border-radius: 50%;
  display: block;
}

.sticker-ribbon {
  height: 3px;
  border-radius: 2px;
  display: block;
}

/* Page number */
.page-number {
  font-family: 'Quicksand', sans-serif;
  font-size: 9px;
  letter-spacing: 5px;
  text-transform: uppercase;
  margin-bottom: 6px;
  text-align: center;
  position: relative;
  z-index: 2;
}

/* Title */
.page-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.page-title-sub {
  font-size: 13px;
  font-style: italic;
  margin-bottom: 24px;
  font-weight: 300;
  text-align: center;
  position: relative;
  z-index: 2;
}

/* Separator */
.separator {
  width: 36px;
  height: 1px;
  margin: 0 auto 24px;
  position: relative;
  z-index: 2;
}

/* Essay text */
.essay-text {
  font-size: 16px;
  line-height: 1.85;
  font-weight: 300;
  position: relative;
  z-index: 2;
}

.essay-text :deep(p) {
  margin-bottom: 16px;
  text-align: justify;
}

.essay-text :deep(.highlight) {
  color: var(--highlight-color);
  font-style: italic;
  font-weight: 400;
}

.essay-text :deep(.accent) {
  color: var(--accent-color);
  font-weight: 500;
}

/* Entry animations */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-title.animate-in {
  animation: fadeUp 0.6s ease-out 0.1s both;
}

.page-title-sub.animate-in {
  animation: fadeUp 0.6s ease-out 0.15s both;
}

.essay-text.animate-in {
  animation: fadeUp 0.6s ease-out 0.3s both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-photo {
  animation: fadeIn 0.5s ease-out both;
}

/* Responsive */
@media (max-width: 680px) {
  .content-page {
    padding: 40px 0;
  }

  .page-inner {
    padding: 60px 50px 65px;
  }

  .page-title {
    font-size: 28px;
  }

  .essay-text {
    font-size: 15px;
  }
}

@media (max-width: 420px) {
  .content-page {
    padding: 30px 0;
  }

  .page-inner {
    padding: 50px 30px 55px;
  }

  .page-title {
    font-size: 24px;
  }

  .essay-text {
    font-size: 14px;
  }
}
</style>
