<template>
  <div class="write-root">
    <header class="write-top">
      <NuxtLink to="/journal" class="back">&larr; Jurnal</NuxtLink>
      <span class="write-mode">{{ editingSlug ? 'Menyunting' : 'Cerita baru' }}</span>
      <button class="save-btn" :disabled="saving" @click="save">
        {{ saving ? 'Menyimpan…' : 'Simpan' }}
      </button>
    </header>

    <p v-if="errorMsg" class="err">{{ errorMsg }}</p>

    <div class="write-grid">
      <!-- LEFT: title + body -->
      <section class="write-main">
        <input
          v-model="title"
          class="title-input"
          type="text"
          placeholder="Judul cerita"
          :style="{ fontFamily: fontStack }"
        />
        <ClientOnly>
          <JournalStoryEditor
            v-model="contentHtml"
            :font-stack="fontStack"
            :base-size="baseSize"
            class="body-editor"
          />
          <template #fallback>
            <div class="editor-loading">Memuat editor…</div>
          </template>
        </ClientOnly>
      </section>

      <!-- RIGHT: style controls + live preview -->
      <aside class="write-side">
        <h3 class="side-title">Gaya</h3>

        <label class="field">
          <span>Penulis</span>
          <input v-model="author" type="text" placeholder="mis. Irene" />
        </label>

        <label class="field">
          <span>Font</span>
          <select v-model="font">
            <option v-for="f in FONTS" :key="f.name" :value="f.name">{{ f.label }}</option>
          </select>
        </label>

        <label class="field">
          <span>Tema</span>
          <select v-model="theme">
            <option v-for="p in PALETTES" :key="p.name" :value="p.name">{{ p.label }}</option>
          </select>
        </label>

        <label class="field">
          <span>Ukuran teks — {{ baseSize }}px</span>
          <input v-model.number="baseSize" type="range" min="14" max="24" step="1" />
        </label>

        <div class="preview">
          <JournalProceduralBackdrop :seed="seed" :theme="theme" still class="preview-bg" />
          <div class="preview-card" :style="previewCardStyle">
            <p class="preview-sample" :style="{ fontFamily: fontStack, fontSize: `${baseSize}px` }">
              {{ title || 'Judul cerita' }}
            </p>
            <span class="preview-rule" :style="{ background: pal.accent }" />
            <p class="preview-mood">{{ pal.label }}</p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { FONTS, PALETTES, fontByName, paletteByName } from '~/data/journal-themes'
import type { StoryRow } from '~/server/utils/db'

const route = useRoute()
const router = useRouter()

const editingSlug = ref<string | null>((route.query.slug as string) || null)
const title = ref('')
const contentHtml = ref('<p></p>')
const font = ref('cormorant')
const theme = ref('oceanDeep')
const baseSize = ref(17)
const author = ref('')
const seed = ref('preview-seed')

const saving = ref(false)
const errorMsg = ref('')

const fontStack = computed(() => fontByName(font.value).stack)
const pal = computed(() => paletteByName(theme.value))
const previewCardStyle = computed(() => ({
  background: pal.value.paper,
  color: pal.value.paperInk,
}))

onMounted(async () => {
  if (!editingSlug.value) return
  try {
    const s = await $fetch<StoryRow>(`/api/stories/${editingSlug.value}`)
    title.value = s.title
    contentHtml.value = s.content_html || '<p></p>'
    font.value = s.font
    theme.value = s.theme
    baseSize.value = s.base_size
    author.value = s.author
    seed.value = s.seed
  } catch {
    errorMsg.value = 'Cerita tidak ditemukan.'
  }
})

async function save() {
  if (!title.value.trim()) {
    errorMsg.value = 'Beri judul dulu ya.'
    return
  }
  saving.value = true
  errorMsg.value = ''
  const payload = {
    title: title.value,
    contentHtml: contentHtml.value,
    font: font.value,
    theme: theme.value,
    baseSize: baseSize.value,
    author: author.value,
  }
  try {
    const saved = editingSlug.value
      ? await $fetch<StoryRow>(`/api/stories/${editingSlug.value}`, { method: 'PUT', body: payload })
      : await $fetch<StoryRow>('/api/stories', { method: 'POST', body: payload })
    await router.push(`/journal/${saved.slug}`)
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || e?.message || 'Gagal menyimpan.'
    saving.value = false
  }
}
</script>

<style scoped>
.write-root {
  min-height: 100vh;
  background: #1a1814;
  color: #e8e0d0;
  padding: 18px clamp(14px, 4vw, 48px) 40px;
  font-family: 'Cormorant Garamond', Georgia, serif;
}

.write-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}
.back {
  color: rgba(232, 224, 208, 0.7);
  text-decoration: none;
  letter-spacing: 2px;
  font-size: 14px;
}
.back:hover { color: #fff; }
.write-mode {
  letter-spacing: 4px;
  text-transform: uppercase;
  font-size: 12px;
  opacity: 0.6;
}
.save-btn {
  background: #e8d4a8;
  color: #1a1814;
  border: none;
  border-radius: 4px;
  padding: 9px 22px;
  font-family: inherit;
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease;
}
.save-btn:hover:not(:disabled) { background: #f0e0bc; }
.save-btn:disabled { opacity: 0.5; cursor: default; }

.err {
  background: rgba(180, 70, 70, 0.18);
  border: 1px solid rgba(200, 90, 90, 0.5);
  color: #f0c4c4;
  padding: 8px 14px;
  border-radius: 4px;
  margin: 0 0 14px;
  font-size: 14px;
}

.write-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 22px;
  align-items: start;
}

.write-main { display: flex; flex-direction: column; gap: 14px; }
.title-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(232, 224, 208, 0.25);
  color: #f4ecdc;
  font-size: 30px;
  padding: 6px 2px 12px;
  outline: none;
}
.title-input::placeholder { color: rgba(232, 224, 208, 0.3); }
.body-editor { height: 62vh; }
.editor-loading {
  height: 62vh;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  background: #fffdf8;
  color: #8a7a5e;
  font-style: italic;
}

.write-side {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(232, 224, 208, 0.14);
  border-radius: 8px;
  padding: 18px 18px 22px;
  position: sticky;
  top: 18px;
}
.side-title {
  margin: 0 0 16px;
  font-size: 13px;
  letter-spacing: 5px;
  text-transform: uppercase;
  opacity: 0.7;
  font-weight: 400;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 15px;
  font-size: 13px;
}
.field > span { letter-spacing: 2px; opacity: 0.7; text-transform: uppercase; font-size: 11px; }
.field input[type='text'],
.field select {
  background: #2a2620;
  border: 1px solid rgba(232, 224, 208, 0.2);
  color: #e8e0d0;
  border-radius: 4px;
  padding: 7px 9px;
  font-family: inherit;
  font-size: 15px;
}
.field input[type='range'] { width: 100%; accent-color: #c9b58c; }

.preview {
  position: relative;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 4px;
}
.preview-bg { position: absolute; inset: 0; }
.preview-card {
  position: absolute;
  inset: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  text-align: center;
  padding: 14px;
}
.preview-sample { margin: 0; font-weight: 600; line-height: 1.2; }
.preview-rule { width: 50px; height: 1px; opacity: 0.7; }
.preview-mood {
  margin: 0;
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  opacity: 0.6;
}

@media (max-width: 820px) {
  .write-grid { grid-template-columns: 1fr; }
  .write-side { position: static; }
  .body-editor { height: 56vh; }
}
</style>
