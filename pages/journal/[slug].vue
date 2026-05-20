<template>
  <div class="reader-root">
    <JournalProceduralBackdrop v-if="story" :seed="story.seed" :theme="story.theme" class="reader-bg" />

    <header class="reader-top">
      <NuxtLink to="/journal" class="r-link">&larr; Jurnal</NuxtLink>
      <NuxtLink v-if="story" :to="`/journal/write?slug=${story.slug}`" class="r-link">Sunting</NuxtLink>
    </header>

    <main class="reader-scroll">
      <div v-if="pending" class="r-msg">Memuat…</div>
      <div v-else-if="error || !story" class="r-msg">
        Cerita tidak ditemukan.
        <NuxtLink to="/journal" class="r-link">Kembali ke jurnal</NuxtLink>
      </div>
      <article v-else class="paper" :style="cardStyle">
        <p v-if="story.author" class="r-author">oleh {{ story.author }}</p>
        <h1 class="r-title">{{ story.title }}</h1>
        <span class="r-rule" :style="{ background: pal.accent }" />
        <div class="r-body" v-html="story.content_html" />
        <p class="r-date">{{ fmtDate(story.updated_at) }}</p>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { fontByName, paletteByName } from '~/data/journal-themes'
import type { StoryRow } from '~/server/utils/db'

const route = useRoute()
const slug = route.params.slug as string

const { data: story, error, pending } = await useAsyncData(`story-${slug}`, () =>
  $fetch<StoryRow>(`/api/stories/${slug}`),
)

const pal = computed(() => paletteByName(story.value?.theme))
const fontStack = computed(() => fontByName(story.value?.font).stack)

const cardStyle = computed(() => ({
  background: pal.value.paper,
  color: pal.value.paperInk,
  fontFamily: fontStack.value,
  fontSize: `${story.value?.base_size || 17}px`,
  '--accent': pal.value.accent,
}))

function fmtDate(s?: string) {
  return s ? s.slice(0, 10) : ''
}

useHead(() => ({
  title: story.value ? `${story.value.title} — Jurnal` : 'Jurnal',
}))
</script>

<style scoped>
.reader-root {
  position: relative;
  min-height: 100vh;
  background: #0e1218;
  font-family: 'Cormorant Garamond', Georgia, serif;
}
.reader-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
}
.reader-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 16px clamp(14px, 4vw, 40px);
  z-index: 10;
}
.r-link {
  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;
  letter-spacing: 2px;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.28);
  padding: 6px 14px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}
.r-link:hover { color: #fff; background: rgba(0, 0, 0, 0.45); }

.reader-scroll {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 84px clamp(14px, 5vw, 40px) 80px;
}
.r-msg {
  color: #e8e0d0;
  font-size: 20px;
  margin-top: 30vh;
  text-align: center;
}

.paper {
  position: relative;
  width: 100%;
  max-width: 720px;
  border-radius: 6px;
  padding: clamp(34px, 6vw, 72px) clamp(26px, 6vw, 66px);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
  line-height: 1.95;
}
.r-author {
  text-align: center;
  font-style: italic;
  opacity: 0.65;
  margin: 0 0 10px;
  font-size: 0.82em;
  letter-spacing: 1px;
}
.r-title {
  text-align: center;
  font-size: 2.1em;
  font-weight: 600;
  line-height: 1.25;
  margin: 0 0 18px;
}
.r-rule {
  display: block;
  width: 70px;
  height: 1px;
  margin: 0 auto 30px;
  opacity: 0.6;
}
.r-body {
  text-align: justify;
  hyphens: auto;
}
.r-body :deep(p) { margin: 0 0 18px; }
.r-body :deep(p:first-of-type::first-letter) {
  font-size: 3.3em;
  font-weight: 700;
  float: left;
  line-height: 0.86;
  margin: 6px 10px 0 0;
  color: var(--accent);
  font-style: italic;
}
.r-body :deep(h1) { font-size: 1.7em; font-weight: 600; margin: 24px 0 12px; }
.r-body :deep(h2) { font-size: 1.35em; font-weight: 600; margin: 20px 0 10px; }
.r-body :deep(strong) { font-weight: 700; }
.r-body :deep(em) { font-style: italic; color: var(--accent); }
.r-body :deep(blockquote) {
  border-left: 3px solid var(--accent);
  padding-left: 18px;
  margin: 18px 0;
  font-style: italic;
  opacity: 0.9;
}
.r-body :deep(ul),
.r-body :deep(ol) { padding-left: 28px; margin: 0 0 18px; }
.r-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--accent);
  opacity: 0.5;
  margin: 28px auto;
  width: 60%;
}
.r-date {
  text-align: center;
  margin: 36px 0 0;
  font-size: 0.72em;
  letter-spacing: 3px;
  text-transform: uppercase;
  opacity: 0.45;
}
</style>
