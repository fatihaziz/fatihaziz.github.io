<template>
  <div ref="root" class="lsel" :class="{ open }">
    <button type="button" class="lsel-btn" :disabled="disabled" @click="toggle">
      <span class="lsel-label" :class="{ ph: !currentLabel }">{{ currentLabel || placeholder }}</span>
      <span class="lsel-caret" aria-hidden="true">{{ open ? '^' : 'v' }}</span>
    </button>
    <div v-if="open" class="lsel-pop">
      <input
        ref="searchEl"
        v-model="q"
        class="lsel-search"
        type="text"
        placeholder="cari..."
        @keydown.enter.prevent="pickFirst"
        @keydown.esc.stop="close"
      />
      <ul class="lsel-list" role="listbox">
        <li v-for="o in filtered" :key="String(o.value)">
          <button
            type="button"
            class="lsel-opt"
            :class="{ sel: o.value === modelValue }"
            role="option"
            :aria-selected="o.value === modelValue"
            @click="pick(o)"
          >{{ o.label }}</button>
        </li>
        <li v-if="!filtered.length" class="lsel-none">tidak ada hasil</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// Searchable replacement for native <select> on the Lunar tracker. Options
// filter as you type; Enter picks the first match.
export interface LunarSelectOption {
  value: string | number
  label: string
}

const props = defineProps<{
  modelValue: string | number
  options: LunarSelectOption[]
  placeholder?: string
  disabled?: boolean
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string | number): void }>()

const open = ref(false)
const q = ref('')
const root = ref<HTMLElement | null>(null)
const searchEl = ref<HTMLInputElement | null>(null)

const currentLabel = computed(
  () => props.options.find((o) => o.value === props.modelValue)?.label ?? '',
)
const filtered = computed(() => {
  const needle = q.value.trim().toLowerCase()
  if (!needle) return props.options
  return props.options.filter((o) => o.label.toLowerCase().includes(needle))
})

function toggle() {
  open.value = !open.value
  if (open.value) {
    q.value = ''
    nextTick(() => searchEl.value?.focus())
  }
}
function close() {
  open.value = false
}
function pick(o: LunarSelectOption) {
  emit('update:modelValue', o.value)
  close()
}
function pickFirst() {
  const first = filtered.value[0]
  if (first) pick(first)
}

function onDocClick(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) close()
}
onMounted(() => document.addEventListener('mousedown', onDocClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocClick))
</script>

<style scoped>
/* Inherits the .lunar-root custom properties (dark mission-control palette). */
.lsel { position: relative; display: inline-block; min-width: 8rem; }
.lsel-btn {
  display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
  width: 100%; border: 1px solid var(--line, #444); border-radius: 0.6rem;
  background: var(--paper, #111); color: var(--ink, #eee);
  font: 400 0.85rem var(--font-body, sans-serif); padding: 0.45rem 0.7rem; cursor: pointer;
  text-align: left;
}
.lsel-btn:disabled { opacity: 0.55; cursor: default; }
.lsel.open .lsel-btn, .lsel-btn:hover:not(:disabled) { border-color: var(--accent-2, #7fd4e4); }
.lsel-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lsel-label.ph { color: oklch(52% 0.02 265); }
.lsel-caret { font: 600 0.62rem var(--font-mono, monospace); color: var(--muted, #999); }
.lsel-pop {
  position: absolute; z-index: 40; top: calc(100% + 0.3rem); left: 0;
  min-width: 100%; width: max-content; max-width: min(24rem, 90vw);
  border: 1px solid var(--line, #444); border-radius: 0.7rem;
  background: var(--paper-2, #181818); box-shadow: 0 0.8rem 2rem oklch(10% 0.02 265 / 0.6);
  padding: 0.4rem;
}
.lsel-search {
  width: 100%; border: 1px solid var(--line, #444); border-radius: 0.5rem;
  background: var(--paper, #111); color: var(--ink, #eee);
  font: 400 0.82rem var(--font-body, sans-serif); padding: 0.35rem 0.6rem;
}
.lsel-search:focus-visible { outline: 2px solid var(--accent-2, #7fd4e4); outline-offset: 1px; }
.lsel-list { list-style: none; margin: 0.35rem 0 0; padding: 0; max-height: 14rem; overflow: auto; display: grid; gap: 0.1rem; }
.lsel-opt {
  width: 100%; text-align: left; border: 0; border-radius: 0.45rem; background: transparent;
  color: var(--ink, #eee); font: 400 0.82rem var(--font-body, sans-serif);
  padding: 0.4rem 0.55rem; cursor: pointer;
}
.lsel-opt:hover { background: oklch(30% 0.04 265); }
.lsel-opt.sel { color: var(--accent, #ecc06a); background: oklch(82% 0.13 85 / 0.1); }
.lsel-none { color: var(--muted, #999); font-size: 0.78rem; padding: 0.4rem 0.55rem; }
</style>
