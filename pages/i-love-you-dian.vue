<template>
  <div class="love-letter-root">
    <!-- Slider container -->
    <div
      class="slider"
      :style="{ transform: sliderTransform, transition: sliderTransition }"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend="onTouchEnd"
    >
      <!-- PAGE 0: COVER -->
      <div class="page cover" :class="{ active: currentPage === 0 }">
        <div
          class="cover-content"
          :style="{ background: coverTheme.paperColor }"
        >
          <div class="stickers-layer" aria-hidden="true">
            <template v-for="(sticker, idx) in coverTheme.stickers" :key="idx">
              <span
                v-if="sticker.type === 'confetti'"
                class="sticker sticker-confetti"
                :style="stickerStyleObj(sticker)"
              />
              <span v-else class="sticker sticker-char" :style="stickerStyleObj(sticker)">
                {{ stickerChar(sticker.type) }}
              </span>
            </template>
          </div>

          <div class="cover-ornament" :class="coverTheme.bodyFont">A Letter For You</div>
          <div class="cover-line"></div>
          <h1 :class="coverTheme.titleFont">
            My Dearest,<br>
            <span>My Dian,</span>
            My Only One.
          </h1>
          <p class="cover-subtitle">
            The one who opened my heart and eyes &mdash;<br>
            I will never leave you alone.
          </p>
          <div class="cover-line"></div>
          <p class="cover-date" :class="coverTheme.bodyFont">December 2025 &mdash; March 2026</p>
        </div>
        <div v-if="currentPage === 0" class="swipe-hint" :class="coverTheme.bodyFont">
          Swipe
        </div>
      </div>

      <!-- PAGES 1-3: CONTENT PAGES -->
      <div
        v-for="(page, idx) in contentPages"
        :key="page.id"
        class="page content-page-wrapper"
        :class="{ active: currentPage === idx + 1 }"
      >
        <LoveLetterPage
          :page-data="page"
          :is-active="currentPage === idx + 1"
        />
      </div>

      <!-- PAGE 4: CLOSING -->
      <div class="page closing" :class="{ active: currentPage === 4 }">
        <div
          class="cover-content closing-card"
          :style="{ background: closingTheme.paperColor }"
        >
          <div class="stickers-layer" aria-hidden="true">
            <template v-for="(sticker, idx) in closingTheme.stickers" :key="idx">
              <span
                v-if="sticker.type === 'confetti'"
                class="sticker sticker-confetti"
                :style="stickerStyleObj(sticker)"
              />
              <span v-else class="sticker sticker-char" :style="stickerStyleObj(sticker)">
                {{ stickerChar(sticker.type) }}
              </span>
            </template>
          </div>

          <div class="cover-ornament heart-ornament">&hearts;</div>
          <div class="closing-text" :class="closingTheme.titleFont">
            I'm not going anywhere.<br><br>
            I'm choosing you today, tomorrow, and every day after.<br><br>
            Not because you need me to.<br>
            But because you deserve someone like me who will in front of you to stay, hold, and forever with you.<br>
            and I refuse to let that someone be anyone else.
          </div>
          <div class="cover-line"></div>
          <p class="closing-sig">Forever yours, Fatih</p>
          <p class="closing-date" :class="closingTheme.bodyFont">
            Written with everything I have<br>March 2026 &mdash; Three months in. A lifetime to go.
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation dots -->
    <LoveLetterNav
      :current="currentPage"
      :total="totalPages"
      @go-to="goTo"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { pages, letterTitle } from '~/data/love-letter'
import type { StickerData } from '~/data/love-letter'

definePageMeta({
  layout: 'love-letter',
})

useHead({
  title: letterTitle,
})

// Data
const contentPages = pages.filter(p => p.type === 'content')
const coverTheme = pages.find(p => p.type === 'cover')!.theme
const closingTheme = pages.find(p => p.type === 'closing')!.theme
const totalPages = pages.length

// Carousel state -- all reactive, no direct DOM manipulation
const currentPage = ref(0)
const sliderTransform = ref('translateX(0px)')
const sliderTransition = ref('transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)')

// Touch tracking
let startX = 0
let startY = 0
let isDragging = false
let diff = 0

function getPageWidth(): number {
  // Use clientWidth of the root element (excludes scrollbar, always accurate)
  return document.documentElement.clientWidth
}

function goTo(index: number) {
  if (index < 0) index = 0
  if (index >= totalPages) index = totalPages - 1
  currentPage.value = index
  sliderTransform.value = `translateX(${-index * getPageWidth()}px)`
}

// Touch handlers -- all through reactive refs
function onTouchStart(e: TouchEvent) {
  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
  isDragging = true
  sliderTransition.value = 'none'
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging) return
  diff = e.touches[0].clientX - startX
  const diffY = Math.abs(e.touches[0].clientY - startY)
  if (diffY > Math.abs(diff) && Math.abs(diff) < 30) return

  const offset = -currentPage.value * getPageWidth() + diff
  sliderTransform.value = `translateX(${offset}px)`
}

function onTouchEnd() {
  isDragging = false
  sliderTransition.value = 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)'

  if (Math.abs(diff) > 60) {
    if (diff < 0) goTo(currentPage.value + 1)
    else goTo(currentPage.value - 1)
  } else {
    goTo(currentPage.value)
  }
  diff = 0
}

// Keyboard navigation
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') goTo(currentPage.value + 1)
  if (e.key === 'ArrowLeft') goTo(currentPage.value - 1)
}

// Recalculate position on resize
function handleResize() {
  sliderTransform.value = `translateX(${-currentPage.value * getPageWidth()}px)`
}

onMounted(() => {
  // Lock html/body to prevent scrollbar (critical for vw/px alignment)
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
  document.documentElement.style.height = '100%'
  document.body.style.height = '100%'

  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', handleResize)

  // Set initial position
  goTo(0)
})

onUnmounted(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  document.documentElement.style.height = ''
  document.body.style.height = ''

  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
})

// Sticker helpers
const STICKER_CHARS: Record<string, string> = {
  heart: '\u2665',
  star: '\u2605',
  flower: '\u273F',
  sparkle: '\u2726',
  butterfly: '\u2666',
  moon: '\u263D',
}

function stickerChar(type: string): string {
  return STICKER_CHARS[type] || ''
}

function stickerStyleObj(sticker: StickerData): Record<string, string> {
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
/* ===== ROOT ===== */
.love-letter-root {
  overflow: hidden;
  height: 100vh;
  width: 100%;
  background: #9e958b;
  -webkit-font-smoothing: antialiased;
  touch-action: pan-y;
}

/* ===== SLIDER ===== */
.slider {
  display: flex;
  height: 100%;
  will-change: transform;
}

/* ===== PAGE ===== */
.page {
  width: 100vw;
  min-width: 100vw;
  flex-shrink: 0;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  -webkit-overflow-scrolling: touch;
  padding: 28px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.page::-webkit-scrollbar {
  display: none;
}

/* ===== SHARED BG TEXTURE ===== */
.cover,
.content-page-wrapper,
.closing {
  background:
    radial-gradient(ellipse at center, rgba(250,247,242,0.25) 0%, transparent 50%),
    repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.008) 3px, rgba(0,0,0,0.008) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.006) 3px, rgba(0,0,0,0.006) 4px),
    #9e958b;
}

/* ===== COVER ===== */
.cover {
  align-items: center;
  text-align: center;
}

.cover-content {
  padding: 60px 90px;
  width: 640px;
  max-width: 100%;
  border-radius: 3px;
  position: relative;
  z-index: 2;
  animation: fadeUp 1.2s ease-out;
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.08),
    0 12px 40px rgba(0, 0, 0, 0.13);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
}

.cover-ornament {
  font-size: 10px;
  letter-spacing: 6px;
  color: #96751a;
  text-transform: uppercase;
  margin-bottom: 28px;
  font-weight: 300;
}

.heart-ornament {
  font-size: 28px;
  letter-spacing: 0;
  color: #c06868;
}

.cover h1 {
  font-size: 30px;
  font-weight: 400;
  font-style: italic;
  line-height: 1.3;
  color: #2c2420;
  margin-bottom: 14px;
}

.cover h1 span {
  display: block;
  font-size: 38px;
  font-style: normal;
  font-weight: 700;
  color: #96751a;
  margin: 8px 0;
}

.cover-subtitle {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px;
  font-style: italic;
  color: #c06868;
  line-height: 1.6;
  max-width: 280px;
  margin: 16px auto 36px;
  font-weight: 300;
}

.cover-line {
  width: 50px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #96751a, transparent);
  margin: 0 auto 24px;
}

.cover-date {
  font-size: 10px;
  letter-spacing: 4px;
  color: #8a7e72;
  text-transform: uppercase;
}

/* ===== SWIPE HINT ===== */
.swipe-hint {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  letter-spacing: 3px;
  color: #8a7e72;
  text-transform: uppercase;
  animation: pulse 2s ease-in-out infinite;
  z-index: 10;
}

.swipe-hint::after {
  content: '';
  display: block;
  width: 16px;
  height: 16px;
  border-right: 1.5px solid #96751a;
  border-bottom: 1.5px solid #96751a;
  transform: rotate(-45deg);
  margin: 6px auto 0;
  animation: slideRight 1.5s ease-in-out infinite;
}

/* ===== CONTENT PAGE WRAPPER ===== */
.content-page-wrapper {
  background: #9e958b;
  align-items: flex-start;
}

/* ===== CLOSING ===== */
.closing {
  background: #9e958b;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.closing-card {
  min-height: auto;
  padding: 60px 44px;
}

.closing-text {
  font-size: 21px;
  font-style: italic;
  color: #2c2420;
  line-height: 1.6;
  max-width: 300px;
  margin: 0 auto 28px;
}

.closing-sig {
  font-family: 'Cormorant Garamond', serif;
  font-size: 17px;
  color: #96751a;
  font-style: italic;
  font-weight: 300;
}

.closing-date {
  font-size: 9px;
  letter-spacing: 3px;
  color: #8a7e72;
  margin-top: 18px;
  text-transform: uppercase;
}

/* ===== STICKERS (cover/closing) ===== */
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

/* ===== ANIMATIONS ===== */
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

@keyframes pulse {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}

@keyframes slideRight {
  0%,
  100% {
    transform: rotate(-45deg) translate(0, 0);
  }
  50% {
    transform: rotate(-45deg) translate(3px, 3px);
  }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 520px) {
  .page {
    padding: 16px;
  }

  .content-page-wrapper {
    padding: 16px;
  }

  .cover-content,
  .closing-card {
    padding: 36px 26px 44px;
  }

  .cover h1 {
    font-size: 26px;
  }

  .cover h1 span {
    font-size: 32px;
  }
}

@media (max-width: 380px) {
  .cover-content,
  .closing-card {
    padding: 28px 20px 36px;
  }

  .cover h1 {
    font-size: 22px;
  }

  .cover h1 span {
    font-size: 28px;
  }
}
</style>
