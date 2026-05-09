<template>
  <div class="novel-root">
    <!-- ====== AMBIENT BACKGROUND ====== -->
    <div class="ambient" aria-hidden="true">
      <div class="ambient-glow" />
      <svg class="ambient-waves" viewBox="0 0 1600 900" preserveAspectRatio="none">
        <defs>
          <linearGradient id="amb-w" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#2c3e4a" stop-opacity="0" />
            <stop offset="100%" stop-color="#0e1820" stop-opacity="0.6" />
          </linearGradient>
        </defs>
        <path
          d="M 0 600 Q 400 560 800 600 T 1600 600 L 1600 900 L 0 900 Z"
          fill="url(#amb-w)" class="amb-wave amb-w1"
        />
        <path
          d="M 0 700 Q 400 660 800 700 T 1600 700 L 1600 900 L 0 900 Z"
          fill="url(#amb-w)" class="amb-wave amb-w2" opacity="0.7"
        />
      </svg>
      <div class="ambient-stars">
        <span v-for="i in 24" :key="i" class="amb-star" :class="`s-${i}`"></span>
      </div>
    </div>

    <!-- ====== TOP BAR ====== -->
    <div class="topbar">
      <div class="topbar-title">
        <span class="topbar-novel">{{ novelTitle }}</span>
        <span class="topbar-divider">&middot;</span>
        <span class="topbar-loc">{{ locationLabel }}</span>
      </div>
      <button
        v-if="currentIdx > 0"
        class="topbar-toc"
        @click="tocOpen = !tocOpen"
        :aria-expanded="tocOpen"
      >
        Daftar Isi
      </button>
    </div>

    <!-- ====== BOOK CONTAINER ====== -->
    <div
      class="book-stage"
      ref="stageEl"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <div class="book-shadow" aria-hidden="true"></div>

      <div class="book" :style="bookStyle">
        <!-- Page-stack edge texture (right side stack, decorative) -->
        <div class="stack-edge stack-edge-right" :style="{ width: `${rightStackWidth}px` }" aria-hidden="true">
          <span v-for="i in rightStackCount" :key="`r-${i}`" class="stack-line"></span>
        </div>
        <!-- Page-stack edge texture (left side stack, decorative) -->
        <div class="stack-edge stack-edge-left" :style="{ width: `${leftStackWidth}px` }" aria-hidden="true">
          <span v-for="i in leftStackCount" :key="`l-${i}`" class="stack-line"></span>
        </div>

        <!-- ====== SPREAD UNDERNEATH (revealing during flip) ====== -->
        <div v-if="flipping" class="spread spread-bottom">
          <div class="page-half page-left">
            <NovelLautSpreadHalf :spread="revealingSpread" side="left" />
          </div>
          <div class="page-half page-right">
            <NovelLautSpreadHalf :spread="revealingSpread" side="right" />
          </div>
        </div>

        <!-- ====== CURRENT SPREAD (visible at rest) ====== -->
        <div v-if="!flipping || flipDir === 'next'" class="spread spread-top">
          <div class="page-half page-left">
            <NovelLautSpreadHalf :spread="currentSpread" side="left" />
          </div>
          <div v-if="!flipping" class="page-half page-right">
            <NovelLautSpreadHalf :spread="currentSpread" side="right" />
          </div>
        </div>
        <!-- For backward flip: keep current spread RIGHT half, hide LEFT half (because flipping page covers it) -->
        <div v-if="flipping && flipDir === 'prev'" class="spread spread-top">
          <div class="page-half page-right">
            <NovelLautSpreadHalf :spread="currentSpread" side="right" />
          </div>
        </div>

        <!-- ====== FLIPPING PAGE ====== -->
        <div
          v-if="flipping"
          class="flipper"
          :class="{ 'flip-back': flipDir === 'prev' }"
          :style="flipperStyle"
        >
          <!-- FRONT FACE -->
          <div class="face face-front">
            <NovelLautSpreadHalf
              :spread="flipFrontSpread"
              :side="flipFrontSide"
            />
            <!-- Page curl shadow (front side, near spine) -->
            <div class="curl-shadow curl-shadow-front" />
          </div>
          <!-- BACK FACE -->
          <div class="face face-back">
            <NovelLautSpreadHalf
              :spread="flipBackSpread"
              :side="flipBackSide"
            />
            <!-- Page curl shadow (back side, near spine) -->
            <div class="curl-shadow curl-shadow-back" />
          </div>
        </div>

        <!-- Center spine seam -->
        <div class="spine" aria-hidden="true"></div>

        <!-- Page-corner peel hint (only when can go next, not flipping) -->
        <div
          v-if="canGoNext && !flipping"
          class="corner-hint"
          @click="flipNext"
          aria-label="Halaman berikutnya"
        >
          <svg viewBox="0 0 60 60" aria-hidden="true">
            <path d="M 60 0 L 60 60 L 0 60 Z" fill="rgba(255,255,255,0.15)" />
            <path d="M 60 0 L 0 60" stroke="rgba(255,255,255,0.4)" stroke-width="0.6" fill="none" />
            <path d="M 60 0 Q 35 5 30 30 Q 25 55 0 60"
              stroke="rgba(255,255,255,0.35)" stroke-width="0.6" fill="rgba(255,255,255,0.06)" />
          </svg>
        </div>
      </div>

      <!-- ====== NAV ARROWS ====== -->
      <button
        v-if="canGoPrev"
        class="nav-btn nav-prev"
        :disabled="flipping"
        @click="flipPrev"
        aria-label="Halaman sebelumnya"
      >
        <span class="nav-arrow">&larr;</span>
      </button>
      <button
        v-if="canGoNext"
        class="nav-btn nav-next"
        :disabled="flipping"
        @click="flipNext"
        aria-label="Halaman berikutnya"
      >
        <span class="nav-arrow">&rarr;</span>
      </button>
    </div>

    <!-- ====== BOTTOM PROGRESS DOTS ====== -->
    <div class="dots">
      <button
        v-for="(s, i) in spreads"
        :key="i"
        class="dot"
        :class="{ active: i === currentIdx, visited: i < currentIdx }"
        :disabled="flipping"
        @click="goTo(i)"
        :aria-label="`Spread ${i + 1}: ${dotLabel(i)}`"
        :title="dotLabel(i)"
      >
        <span class="dot-num">{{ dotNum(i) }}</span>
      </button>
    </div>

    <!-- ====== TOC OVERLAY ====== -->
    <transition name="toc">
      <div v-if="tocOpen" class="toc-overlay" @click.self="tocOpen = false">
        <div class="toc-panel">
          <h3 class="toc-title">{{ novelTitle }}</h3>
          <p class="toc-subtitle">{{ novelSubtitle }} &middot; {{ novelAuthor }}</p>
          <ul class="toc-list">
            <li v-for="(c, i) in chapters" :key="c.id">
              <button @click="goTo(i + 1); tocOpen = false">
                <span class="toc-num">{{ c.numeral }}</span>
                <span class="toc-name">{{ c.title }}</span>
              </button>
            </li>
          </ul>
          <button class="toc-close" @click="tocOpen = false">tutup</button>
        </div>
      </div>
    </transition>

    <!-- ====== KEYBOARD HINT ====== -->
    <div v-if="currentIdx === 0 && !flipping" class="kbd-hint">
      tekan &larr; / &rarr; atau seret halaman
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  chapters,
  novelTitle,
  novelSubtitle,
  novelAuthor,
} from '~/data/novel-laut'
import type { Chapter } from '~/data/novel-laut'

definePageMeta({
  layout: 'novel-laut',
})

useHead({
  title: `${novelTitle} -- ${novelAuthor}`,
  meta: [
    { name: 'description', content: `${novelTitle} -- ${novelSubtitle} oleh ${novelAuthor}` },
  ],
})

// ====================================================================
// SPREAD MODEL
// ====================================================================
// Index 0          = front cover
// Index 1..8       = chapters I..VIII
// Index 9          = back cover

type Spread =
  | { type: 'cover' }
  | { type: 'chapter'; chapter: Chapter }
  | { type: 'back' }

const spreads = computed<Spread[]>(() => [
  { type: 'cover' },
  ...chapters.map(c => ({ type: 'chapter' as const, chapter: c })),
  { type: 'back' },
])

const totalSpreads = computed(() => spreads.value.length)

// ====================================================================
// STATE
// ====================================================================
const currentIdx = ref(0)
const flipping = ref(false)
const flipDir = ref<'next' | 'prev' | null>(null)
const flipAngle = ref(0) // degrees: 0 (rest) to -180 (flipped fully forward) or 180 (backward)
const tocOpen = ref(false)

// Drag tracking
let isPointerDown = false
let startX = 0
let startY = 0
let dragMoved = false
let pageWidth = 800

// ====================================================================
// COMPUTED SPREADS
// ====================================================================
const currentSpread = computed(() => spreads.value[currentIdx.value])

const revealingIdx = computed(() => {
  if (!flipping.value) return currentIdx.value
  return flipDir.value === 'next' ? currentIdx.value + 1 : currentIdx.value - 1
})

const revealingSpread = computed(() => spreads.value[revealingIdx.value])

const canGoNext = computed(() => currentIdx.value < totalSpreads.value - 1)
const canGoPrev = computed(() => currentIdx.value > 0)

// What goes on the flipper's faces:
//   forward:
//     front = current.right (text being lifted)
//     back  = next.left (art being revealed as page lays on left side)
//   backward:
//     front = prev.right (text being put back to right side)
//     back  = current.left (currently visible art being un-revealed)
const flipFrontSpread = computed(() =>
  flipDir.value === 'next' ? currentSpread.value : revealingSpread.value
)
const flipFrontSide = computed<'left' | 'right'>(() => 'right')

const flipBackSpread = computed(() =>
  flipDir.value === 'next' ? revealingSpread.value : currentSpread.value
)
const flipBackSide = computed<'left' | 'right'>(() => 'left')

// ====================================================================
// STYLES
// ====================================================================
const bookStyle = computed(() => ({
  perspective: '2400px',
}))

const flipperStyle = computed(() => {
  // forward: 0deg -> -180deg
  // backward: -180deg -> 0deg (page comes from the left side back to the right)
  return {
    transform: `rotateY(${flipAngle.value}deg)`,
    transition: flipping.value
      ? 'transform 0.85s cubic-bezier(0.55, 0.08, 0.45, 0.95)'
      : 'none',
  }
})

// Decorative: how thick the right/left page-stack edges look
const rightStackCount = computed(() => Math.max(0, totalSpreads.value - currentIdx.value - 1))
const leftStackCount = computed(() => currentIdx.value)
const rightStackWidth = computed(() => Math.min(20, rightStackCount.value * 1.5 + 3))
const leftStackWidth = computed(() => Math.min(20, leftStackCount.value * 1.5 + 3))

// Top-bar location label
const locationLabel = computed(() => {
  const s = currentSpread.value
  if (s.type === 'cover') return 'Sampul'
  if (s.type === 'back') return 'Penutup'
  return `Bab ${s.chapter.numeral}`
})

// ====================================================================
// FLIP ACTIONS
// ====================================================================
function flipNext() {
  if (flipping.value || !canGoNext.value) return
  flipDir.value = 'next'
  flipping.value = true
  // Set start angle, then animate to end on next tick so transition kicks in
  flipAngle.value = 0
  requestAnimationFrame(() => {
    flipAngle.value = -180
    setTimeout(() => commitFlip(), 850)
  })
}

function flipPrev() {
  if (flipping.value || !canGoPrev.value) return
  flipDir.value = 'prev'
  flipping.value = true
  // Start at -180 (page already on the left), animate back to 0 (back to right side)
  flipAngle.value = -180
  requestAnimationFrame(() => {
    flipAngle.value = 0
    setTimeout(() => commitFlip(), 850)
  })
}

function commitFlip() {
  if (!flipping.value) return
  if (flipDir.value === 'next') currentIdx.value++
  else if (flipDir.value === 'prev') currentIdx.value--
  flipping.value = false
  flipDir.value = null
  flipAngle.value = 0
}

function goTo(idx: number) {
  if (flipping.value) return
  if (idx === currentIdx.value) return
  if (idx < 0 || idx >= totalSpreads.value) return
  // Quick teleport (no flip animation)
  currentIdx.value = idx
}

// ====================================================================
// POINTER (drag-to-flip)
// ====================================================================
function onPointerDown(e: PointerEvent) {
  // Ignore if clicking buttons/links inside text or scrollbars
  const t = e.target as HTMLElement
  if (t.closest('button, a, .text-scroll')) return
  if (flipping.value) return
  isPointerDown = true
  startX = e.clientX
  startY = e.clientY
  dragMoved = false
  pageWidth = (e.currentTarget as HTMLElement).clientWidth
}

function onPointerMove(e: PointerEvent) {
  if (!isPointerDown) return
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  if (Math.abs(dx) > 8 || Math.abs(dy) > 8) dragMoved = true
}

function onPointerUp(e: PointerEvent) {
  if (!isPointerDown) return
  const dx = e.clientX - startX
  isPointerDown = false
  if (!dragMoved) return
  // Threshold: ~10% of viewport width
  const threshold = Math.max(60, pageWidth * 0.08)
  if (dx < -threshold) flipNext()
  else if (dx > threshold) flipPrev()
}

// ====================================================================
// KEYBOARD
// ====================================================================
function onKeydown(e: KeyboardEvent) {
  if (tocOpen.value) {
    if (e.key === 'Escape') tocOpen.value = false
    return
  }
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
    e.preventDefault()
    flipNext()
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault()
    flipPrev()
  } else if (e.key === 'Home') {
    e.preventDefault()
    goTo(0)
  } else if (e.key === 'End') {
    e.preventDefault()
    goTo(totalSpreads.value - 1)
  }
}

// ====================================================================
// LIFECYCLE
// ====================================================================
onMounted(() => {
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
  document.documentElement.style.height = '100%'
  document.body.style.height = '100%'
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  document.documentElement.style.height = ''
  document.body.style.height = ''
  document.removeEventListener('keydown', onKeydown)
})

// ====================================================================
// HELPERS
// ====================================================================
function dotLabel(i: number): string {
  const s = spreads.value[i]
  if (s.type === 'cover') return 'Sampul'
  if (s.type === 'back') return 'Penutup'
  return `${s.chapter.numeral}. ${s.chapter.title}`
}

function dotNum(i: number): string {
  const s = spreads.value[i]
  if (s.type === 'cover') return '❖' // diamond
  if (s.type === 'back') return '❖'
  return s.chapter.numeral
}
</script>

<style scoped>
/* ====================================================================
   ROOT
   ==================================================================== */
.novel-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #1a1814;
  color: #e8e0d0;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  font-family: 'Cormorant Garamond', 'Juliett', Georgia, serif;
  touch-action: pan-y;
}

/* ====================================================================
   AMBIENT BACKGROUND
   ==================================================================== */
.ambient {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.ambient-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 20%, rgba(80, 110, 130, 0.18), transparent 55%),
    radial-gradient(ellipse at 50% 80%, rgba(40, 60, 80, 0.35), transparent 65%),
    linear-gradient(180deg, #0e1218 0%, #1a1814 60%, #0a0d12 100%);
}

.ambient-waves {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  opacity: 0.5;
}

@keyframes wave-amb {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-30px); }
}
.amb-wave {
  animation: wave-amb 14s ease-in-out infinite;
}
.amb-w2 {
  animation-duration: 18s;
  animation-delay: -3s;
}

.ambient-stars {
  position: absolute;
  inset: 0;
}

.amb-star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #d8e0e8;
  border-radius: 50%;
  opacity: 0.5;
  animation: amb-star-twinkle 4s ease-in-out infinite;
}

@keyframes amb-star-twinkle {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.85; }
}

/* Distribute 24 stars across the top half */
.s-1  { top: 6%;  left: 8%;  animation-delay: 0s;   }
.s-2  { top: 12%; left: 22%; animation-delay: 1.2s; }
.s-3  { top: 4%;  left: 38%; animation-delay: 2.4s; }
.s-4  { top: 18%; left: 51%; animation-delay: 0.6s; }
.s-5  { top: 8%;  left: 64%; animation-delay: 1.8s; }
.s-6  { top: 14%; left: 79%; animation-delay: 3.0s; }
.s-7  { top: 22%; left: 92%; animation-delay: 0.4s; }
.s-8  { top: 26%; left: 5%;  animation-delay: 2.0s; }
.s-9  { top: 32%; left: 17%; animation-delay: 1.4s; }
.s-10 { top: 38%; left: 33%; animation-delay: 0.8s; }
.s-11 { top: 28%; left: 46%; animation-delay: 2.2s; }
.s-12 { top: 30%; left: 58%; animation-delay: 1.6s; }
.s-13 { top: 36%; left: 73%; animation-delay: 0.2s; }
.s-14 { top: 24%; left: 88%; animation-delay: 2.8s; }
.s-15 { top: 5%;  left: 12%; animation-delay: 1.0s; width: 1.5px; height: 1.5px; }
.s-16 { top: 16%; left: 30%; animation-delay: 2.6s; width: 1.5px; height: 1.5px; }
.s-17 { top: 21%; left: 44%; animation-delay: 0.5s; width: 3px;   height: 3px;   }
.s-18 { top: 9%;  left: 56%; animation-delay: 1.7s; }
.s-19 { top: 19%; left: 71%; animation-delay: 2.3s; }
.s-20 { top: 27%; left: 84%; animation-delay: 0.9s; }
.s-21 { top: 34%; left: 25%; animation-delay: 1.3s; width: 1.5px; height: 1.5px; }
.s-22 { top: 38%; left: 50%; animation-delay: 2.1s; }
.s-23 { top: 30%; left: 67%; animation-delay: 0.7s; }
.s-24 { top: 33%; left: 95%; animation-delay: 1.9s; }

/* ====================================================================
   TOPBAR
   ==================================================================== */
.topbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
  pointer-events: none;
}
.topbar > * { pointer-events: auto; }

.topbar-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(232, 224, 208, 0.65);
  font-weight: 300;
}

.topbar-novel {
  font-style: italic;
  font-weight: 400;
}

.topbar-divider {
  margin: 0 10px;
  opacity: 0.4;
}

.topbar-loc {
  letter-spacing: 5px;
  opacity: 0.85;
}

.topbar-toc {
  font-family: 'Cormorant Garamond', serif;
  font-size: 12px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(232, 224, 208, 0.7);
  background: transparent;
  border: 1px solid rgba(232, 224, 208, 0.25);
  padding: 6px 14px;
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}
.topbar-toc:hover {
  background: rgba(232, 224, 208, 0.08);
  color: rgba(232, 224, 208, 1);
}

/* ====================================================================
   BOOK STAGE
   ==================================================================== */
.book-stage {
  position: absolute;
  inset: 60px 0 90px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  cursor: grab;
}
.book-stage:active {
  cursor: grabbing;
}

/* Drop shadow underneath book */
.book-shadow {
  position: absolute;
  bottom: 4%;
  left: 50%;
  transform: translateX(-50%);
  width: min(85%, 1280px);
  height: 30px;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.55), transparent 70%);
  filter: blur(12px);
  z-index: 0;
}

.book {
  position: relative;
  width: min(92%, 1280px);
  aspect-ratio: 16 / 10;
  max-height: 86%;
  transform-style: preserve-3d;
  z-index: 2;
}

/* Center spine line over the seam */
.spine {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 14px;
  margin-left: -7px;
  background:
    linear-gradient(90deg,
      transparent 0%,
      rgba(0,0,0,0.45) 30%,
      rgba(0,0,0,0.7) 50%,
      rgba(0,0,0,0.45) 70%,
      transparent 100%);
  z-index: 30;
  pointer-events: none;
}

/* Page-stack edges (decorative, look like a real book stack) */
.stack-edge {
  position: absolute;
  top: 1.5%;
  bottom: 1.5%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.stack-edge-right {
  right: -4px;
  border-radius: 0 4px 4px 0;
  background: linear-gradient(90deg, rgba(245,235,217,0.05), rgba(245,235,217,0.5));
  box-shadow: 2px 2px 6px rgba(0,0,0,0.35);
}

.stack-edge-left {
  left: -4px;
  border-radius: 4px 0 0 4px;
  background: linear-gradient(-90deg, rgba(245,235,217,0.05), rgba(245,235,217,0.5));
  box-shadow: -2px 2px 6px rgba(0,0,0,0.35);
}

.stack-line {
  display: block;
  height: 1px;
  background: rgba(0,0,0,0.12);
  width: 100%;
}

/* ====================================================================
   SPREAD (two halves: left art + right text)
   ==================================================================== */
.spread {
  position: absolute;
  inset: 0;
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  box-shadow:
    0 4px 12px rgba(0,0,0,0.35),
    0 18px 50px rgba(0,0,0,0.55);
}

.spread-bottom {
  z-index: 5;
}

.spread-top {
  z-index: 10;
}

.page-half {
  flex: 1 1 50%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* When page-half is alone (during prev-flip showing only right half),
   it must NOT take 50% but rather sit on the right side. */
.spread-top > .page-half:only-child.page-right {
  position: absolute;
  right: 0;
  top: 0;
  width: 50%;
  height: 100%;
}

.page-left {
  border-right: 1px solid rgba(0,0,0,0.12);
}

/* ====================================================================
   FLIPPER (the page that rotates)
   ==================================================================== */
.flipper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 50%;
  transform-origin: left center;
  transform-style: preserve-3d;
  z-index: 20;
  will-change: transform;
}

.face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  overflow: hidden;
  border-radius: 0 4px 4px 0;
  box-shadow:
    0 4px 12px rgba(0,0,0,0.4),
    0 18px 40px rgba(0,0,0,0.4);
}

.face-front {
  z-index: 2;
}

.face-back {
  transform: rotateY(180deg);
  /* Back face becomes the "left" side once flipped */
  border-radius: 4px 0 0 4px;
}

/* Curl shadow near the spine of the flipping page (gives 3D depth) */
.curl-shadow {
  position: absolute;
  top: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 5;
}

.curl-shadow-front {
  left: 0;
  width: 50px;
  background: linear-gradient(90deg, rgba(0,0,0,0.45), transparent);
  opacity: 0.7;
}

.curl-shadow-back {
  right: 0;
  width: 50px;
  background: linear-gradient(-90deg, rgba(0,0,0,0.45), transparent);
  opacity: 0.7;
}

/* ====================================================================
   CORNER PEEL HINT
   ==================================================================== */
.corner-hint {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 60px;
  height: 60px;
  z-index: 25;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease, transform 0.4s ease;
  animation: corner-peek 4s ease-in-out infinite;
}
.corner-hint svg { width: 100%; height: 100%; display: block; }
.corner-hint:hover {
  opacity: 1;
  transform: translate(-3px, -3px) rotate(-3deg);
}

@keyframes corner-peek {
  0%, 100% { transform: translate(0,0) rotate(0); }
  50% { transform: translate(-2px, -2px) rotate(-2deg); }
}

/* ====================================================================
   NAV ARROWS
   ==================================================================== */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.18);
  color: rgba(232, 224, 208, 0.85);
  font-size: 22px;
  cursor: pointer;
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.25s ease, color 0.25s ease, transform 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.14);
  color: #fff;
  transform: translateY(-50%) scale(1.1);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.nav-prev { left: 18px; }
.nav-next { right: 18px; }

.nav-arrow {
  display: block;
  line-height: 1;
}

/* ====================================================================
   BOTTOM DOTS
   ==================================================================== */
.dots {
  position: absolute;
  bottom: 22px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 6px;
  z-index: 10;
  pointer-events: none;
}
.dots > * { pointer-events: auto; }

.dot {
  background: transparent;
  border: 1px solid rgba(232, 224, 208, 0.25);
  color: rgba(232, 224, 208, 0.5);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 9.5px;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
}

.dot:hover:not(:disabled) {
  border-color: rgba(232, 224, 208, 0.7);
  color: rgba(232, 224, 208, 0.95);
}

.dot.active {
  background: rgba(232, 224, 208, 0.85);
  color: #1a1814;
  border-color: rgba(232, 224, 208, 1);
  width: 36px;
}

.dot.visited:not(.active) {
  border-color: rgba(232, 224, 208, 0.5);
  color: rgba(232, 224, 208, 0.7);
}

.dot:disabled { cursor: default; }

.dot-num {
  display: block;
  line-height: 1;
}

/* ====================================================================
   TOC OVERLAY
   ==================================================================== */
.toc-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 14, 20, 0.85);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.toc-panel {
  background: #f4ebd9;
  color: #2d231a;
  width: 100%;
  max-width: 480px;
  padding: 40px 38px 28px;
  border-radius: 4px;
  box-shadow: 0 30px 80px rgba(0,0,0,0.5);
  font-family: 'Cormorant Garamond', serif;
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
}

.toc-title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 4px;
  font-style: italic;
}

.toc-subtitle {
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-align: center;
  color: #8a7a5e;
  margin-bottom: 28px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0 0 18px;
}

.toc-list li {
  border-bottom: 1px dashed rgba(140, 100, 50, 0.25);
}
.toc-list li:last-child { border-bottom: none; }

.toc-list button {
  display: flex;
  align-items: baseline;
  gap: 14px;
  width: 100%;
  padding: 12px 0;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  color: inherit;
  font-family: inherit;
  transition: color 0.2s ease, padding-left 0.2s ease;
}

.toc-list button:hover {
  color: #a87234;
  padding-left: 6px;
}

.toc-num {
  font-style: italic;
  font-size: 14px;
  color: #a87234;
  min-width: 32px;
  letter-spacing: 1px;
}

.toc-name {
  font-size: 16px;
  line-height: 1.3;
  flex: 1;
}

.toc-close {
  display: block;
  margin: 0 auto;
  background: transparent;
  border: 1px solid #a87234;
  color: #a87234;
  font-family: inherit;
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  padding: 8px 22px;
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.toc-close:hover {
  background: #a87234;
  color: #f4ebd9;
}

.toc-enter-active, .toc-leave-active {
  transition: opacity 0.25s ease;
}
.toc-enter-from, .toc-leave-to {
  opacity: 0;
}

/* ====================================================================
   KEYBOARD HINT
   ==================================================================== */
.kbd-hint {
  position: absolute;
  bottom: 64px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(232, 224, 208, 0.45);
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  z-index: 10;
  pointer-events: none;
  animation: hint-fade 4s ease-in-out infinite;
}

@keyframes hint-fade {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.85; }
}

/* ====================================================================
   RESPONSIVE
   ==================================================================== */
@media (max-width: 900px) {
  .book {
    width: 95%;
    aspect-ratio: 4 / 5;
  }
  .book-stage {
    inset: 50px 0 80px 0;
  }
  .topbar {
    padding: 12px 18px;
  }
  .topbar-title {
    font-size: 11px;
    letter-spacing: 3px;
  }
  .nav-btn {
    width: 38px;
    height: 38px;
    font-size: 18px;
  }
  .nav-prev { left: 8px; }
  .nav-next { right: 8px; }
}

@media (max-width: 600px) {
  /* On very small screens, render single-page mode */
  /* Still keep the spread but it's less ideal. Future: stack pages vertically. */
  .corner-hint {
    width: 44px;
    height: 44px;
  }
  .topbar-toc {
    font-size: 10px;
    padding: 5px 10px;
    letter-spacing: 3px;
  }
  .dot {
    width: 22px;
    height: 22px;
    font-size: 8px;
  }
  .dot.active { width: 28px; }
}
</style>
