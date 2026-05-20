<template>
  <div class="idx-root">
    <header class="idx-head">
      <div>
        <h1 class="idx-title">Jurnal</h1>
        <p class="idx-sub">cerita yang kita tulis bersama</p>
      </div>
      <NuxtLink to="/journal/write" class="idx-new">Tulis cerita baru</NuxtLink>
    </header>

    <div v-if="pending" class="idx-msg">Memuat…</div>

    <div v-else-if="!stories || stories.length === 0" class="idx-empty">
      <p>Belum ada cerita di sini.</p>
      <NuxtLink to="/journal/write" class="idx-new">Tulis yang pertama</NuxtLink>
    </div>

    <div v-else class="idx-grid">
      <NuxtLink
        v-for="s in stories"
        :key="s.slug"
        :to="`/journal/${s.slug}`"
        class="card"
      >
        <JournalProceduralBackdrop :seed="s.seed" :theme="s.theme" still class="card-bg" />
        <div class="card-veil" />
        <div class="card-body">
          <h2 class="card-title">{{ s.title }}</h2>
          <p class="card-ex">{{ s.excerpt || '…' }}</p>
          <div class="card-meta">
            <span v-if="s.author">{{ s.author }}</span>
            <span>{{ fmtDate(s.updated_at) }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StoryRow } from '~/server/utils/db'

const { data: stories, pending } = await useAsyncData('stories-list', () =>
  $fetch<StoryRow[]>('/api/stories'),
)

function fmtDate(s?: string) {
  return s ? s.slice(0, 10) : ''
}

useHead({ title: 'Jurnal' })
</script>

<style scoped>
.idx-root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(80, 110, 130, 0.16), transparent 55%),
    linear-gradient(180deg, #0e1218 0%, #1a1814 70%, #0a0d12 100%);
  color: #e8e0d0;
  padding: 40px clamp(16px, 5vw, 64px) 70px;
  font-family: 'Cormorant Garamond', Georgia, serif;
}

.idx-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 36px;
  flex-wrap: wrap;
}
.idx-title {
  font-size: clamp(34px, 6vw, 52px);
  font-weight: 600;
  font-style: italic;
  margin: 0;
  letter-spacing: 1px;
}
.idx-sub {
  margin: 4px 0 0;
  letter-spacing: 4px;
  text-transform: uppercase;
  font-size: 12px;
  opacity: 0.6;
}
.idx-new {
  background: #e8d4a8;
  color: #1a1814;
  text-decoration: none;
  border-radius: 4px;
  padding: 11px 22px;
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
  white-space: nowrap;
  transition: background 0.2s ease;
}
.idx-new:hover { background: #f0e0bc; }

.idx-msg,
.idx-empty {
  text-align: center;
  margin-top: 20vh;
  font-size: 20px;
  opacity: 0.85;
}
.idx-empty { display: flex; flex-direction: column; align-items: center; gap: 18px; }

.idx-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 22px;
}

.card {
  position: relative;
  height: 230px;
  border-radius: 10px;
  overflow: hidden;
  text-decoration: none;
  color: #f2ead8;
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.4);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  display: block;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55);
}
.card-bg { position: absolute; inset: 0; z-index: 0; }
.card-veil {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.6) 100%);
}
.card-body {
  position: absolute;
  inset: 0;
  z-index: 2;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.card-title {
  font-size: 23px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 8px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
}
.card-ex {
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 12px;
  opacity: 0.88;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.6);
}
.card-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.7;
}
</style>
