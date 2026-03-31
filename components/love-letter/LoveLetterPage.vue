<template>
  <div class="content-page">
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
  padding: 50px 0;
}

/* Paper card - wider to create gutter zones for corner photos */
.page-inner {
  width: 640px;
  max-width: 100%;
  margin: 0 auto;
  padding: 75px 90px 80px;
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
