<template>
  <div
    class="chapter-text"
    :style="bgStyle"
  >
    <!-- Faint horizontal ruled lines (paper texture) -->
    <div class="paper-lines" aria-hidden="true"></div>

    <!-- Page top edge / spine shadow -->
    <div class="spine-shadow" aria-hidden="true"></div>

    <!-- Reading progress bar (top edge of paper) -->
    <div class="progress-rail" aria-hidden="true">
      <div
        class="progress-fill"
        :style="{ width: `${scrollProgress * 100}%`, background: theme.accentColor }"
      ></div>
    </div>

    <div
      ref="scrollEl"
      class="text-scroll"
      @scroll.passive="onScroll"
    >
      <div class="text-inner">
        <!-- Hint above title (e.g., "Lompat kalau butuh.") -->
        <p
          v-if="chapter.reader_hint"
          class="reader-hint"
          :style="{ color: theme.accentColor }"
        >
          {{ chapter.reader_hint }}
        </p>

        <!-- Subtitle pre-tag (e.g., "Interlude") -->
        <p
          v-if="chapter.subtitle"
          class="chapter-pretitle"
          :style="{ color: theme.accentColor }"
        >
          {{ chapter.subtitle }}
        </p>

        <!-- Big roman numeral -->
        <div
          class="numeral-wrap"
          :style="{ color: theme.goldColor }"
        >
          <span class="numeral">{{ chapter.numeral }}</span>
          <span class="numeral-rule" :style="{ background: theme.goldColor }"></span>
        </div>

        <!-- Title -->
        <h2
          class="chapter-title"
          :style="{ color: theme.inkColor }"
        >
          {{ chapter.title }}
        </h2>

        <!-- Decorative ornament -->
        <div class="ornament" aria-hidden="true">
          <span :style="{ color: theme.accentColor }">&sect;</span>
        </div>

        <!-- Paragraphs with drop cap on first -->
        <div
          class="paragraphs"
          :style="{ color: theme.inkColor, '--accent': theme.accentColor }"
        >
          <div
            v-for="(html, i) in chapter.paragraphs"
            :key="i"
            class="paragraph"
            :class="{ 'first-p': i === 0 }"
            v-html="html"
          />
        </div>

        <!-- End-of-chapter mark -->
        <div class="end-mark" :style="{ color: theme.goldColor }">&#10086;</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Chapter, ChapterTheme } from '~/data/novel-laut'

const props = defineProps<{
  chapter: Chapter
  theme: ChapterTheme
}>()

const scrollEl = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)

const bgStyle = computed(() => ({
  background: props.theme.paperColor,
  '--line-color': props.theme.lineColor,
}))

function onScroll() {
  const el = scrollEl.value
  if (!el) return
  const max = el.scrollHeight - el.clientHeight
  scrollProgress.value = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0
}
</script>

<style scoped>
.chapter-text {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Paper grain rules */
.paper-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 30px,
      var(--line-color, rgba(0,0,0,0.025)) 30px,
      var(--line-color, rgba(0,0,0,0.025)) 31px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 3px,
      rgba(0,0,0,0.005) 3px,
      rgba(0,0,0,0.005) 4px
    );
  z-index: 1;
}

/* Spine shadow on left edge of right page */
.spine-shadow {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 30px;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.18), transparent);
  pointer-events: none;
  z-index: 2;
}

/* Reading progress bar */
.progress-rail {
  position: absolute;
  top: 0;
  left: 30px;
  right: 0;
  height: 2px;
  background: rgba(0, 0, 0, 0.04);
  z-index: 4;
}

.progress-fill {
  height: 100%;
  width: 0;
  transition: width 0.15s ease-out;
}

/* Scroll container */
.text-scroll {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 3;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.18) transparent;
}

.text-scroll::-webkit-scrollbar {
  width: 6px;
}
.text-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.text-scroll::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.18);
  border-radius: 3px;
}

.text-inner {
  padding: 70px 60px 80px 70px;
  max-width: 580px;
  margin: 0 auto;
  font-family: 'Cormorant Garamond', 'Juliett', Georgia, serif;
}

/* Reader hint (italic small italic above title) */
.reader-hint {
  font-style: italic;
  font-size: 12px;
  letter-spacing: 1px;
  margin-bottom: 30px;
  text-align: center;
  opacity: 0.7;
  font-family: 'Cormorant Garamond', serif;
}

/* Pre-title (e.g. "Interlude" or "Epilog") */
.chapter-pretitle {
  font-size: 11px;
  letter-spacing: 6px;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 18px;
  font-weight: 400;
  font-family: 'Cormorant Garamond', serif;
}

/* Numeral block: big I, II, III etc */
.numeral-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 14px;
}

.numeral {
  font-size: 38px;
  font-weight: 400;
  letter-spacing: 4px;
  font-family: 'Cormorant Garamond', 'Juliett', serif;
  font-style: italic;
}

.numeral-rule {
  width: 60px;
  height: 1px;
  opacity: 0.55;
}

/* Chapter title */
.chapter-title {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  line-height: 1.3;
  margin-bottom: 24px;
  font-family: 'Cormorant Garamond', 'Juliett', Georgia, serif;
  letter-spacing: 0.3px;
}

/* Decorative ornament */
.ornament {
  text-align: center;
  font-size: 22px;
  margin-bottom: 32px;
  opacity: 0.6;
  font-style: italic;
}

/* Paragraphs */
.paragraphs {
  font-size: 16.5px;
  line-height: 1.95;
  font-weight: 400;
  text-align: justify;
  hyphens: auto;
}

.paragraphs :deep(p) {
  margin-bottom: 18px;
}

/* Drop cap on first paragraph (paragraph HTML is injected via v-html, needs :deep) */
.paragraph.first-p :deep(p:first-of-type::first-letter) {
  font-size: 56px;
  font-weight: 700;
  float: left;
  line-height: 0.92;
  margin: 6px 8px 0 0;
  color: var(--accent);
  font-family: 'Cormorant Garamond', 'Juliett', serif;
  font-style: italic;
}

/* Inline emphasis */
.paragraphs :deep(em) {
  font-style: italic;
  color: var(--accent);
  font-weight: 500;
}

.paragraphs :deep(.quote) {
  font-style: italic;
  color: var(--accent);
}

.paragraphs :deep(.big-quote) {
  display: block;
  font-size: 18.5px;
  text-align: center;
  margin: 22px 14px;
  padding: 16px 8px;
  border-top: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
  border-color: var(--accent);
  border-image: linear-gradient(90deg, transparent, currentColor, transparent) 1;
  font-style: italic;
  line-height: 1.5;
  opacity: 0.9;
}

/* End-of-chapter mark */
.end-mark {
  text-align: center;
  font-size: 22px;
  margin-top: 36px;
  opacity: 0.6;
}

@media (max-width: 1024px) {
  .text-inner {
    padding: 50px 40px 60px 50px;
  }
  .chapter-title { font-size: 25px; }
  .paragraphs { font-size: 15.5px; }
  .numeral { font-size: 32px; }
}

@media (max-width: 768px) {
  .text-inner {
    padding: 40px 28px 50px 36px;
  }
  .chapter-title { font-size: 22px; }
  .paragraphs { font-size: 15px; line-height: 1.85; }
  .numeral { font-size: 28px; }
  .paragraphs :deep(.big-quote) { font-size: 16px; }
  .paragraph.first-p :deep(p:first-of-type::first-letter) {
    font-size: 46px;
  }
}
</style>
