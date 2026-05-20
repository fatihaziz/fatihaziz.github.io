<template>
  <div class="editor">
    <div v-if="editor" class="toolbar">
      <button type="button" title="Tebal" :class="{ on: editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()"><b>B</b></button>
      <button type="button" title="Miring" :class="{ on: editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()"><i>I</i></button>
      <button type="button" title="Garis bawah" :class="{ on: editor.isActive('underline') }" @click="editor.chain().focus().toggleUnderline().run()"><u>U</u></button>
      <button type="button" title="Coret" :class="{ on: editor.isActive('strike') }" @click="editor.chain().focus().toggleStrike().run()"><s>S</s></button>
      <span class="sep" />
      <button type="button" title="Judul besar" :class="{ on: editor.isActive('heading', { level: 1 }) }" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">H1</button>
      <button type="button" title="Judul kecil" :class="{ on: editor.isActive('heading', { level: 2 }) }" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">H2</button>
      <button type="button" title="Kutipan" :class="{ on: editor.isActive('blockquote') }" @click="editor.chain().focus().toggleBlockquote().run()">&ldquo;</button>
      <button type="button" title="Daftar titik" :class="{ on: editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()">&bull;</button>
      <button type="button" title="Daftar angka" :class="{ on: editor.isActive('orderedList') }" @click="editor.chain().focus().toggleOrderedList().run()">1.</button>
      <span class="sep" />
      <button type="button" title="Rata kiri" :class="{ on: editor.isActive({ textAlign: 'left' }) }" @click="editor.chain().focus().setTextAlign('left').run()">&#8676;</button>
      <button type="button" title="Rata tengah" :class="{ on: editor.isActive({ textAlign: 'center' }) }" @click="editor.chain().focus().setTextAlign('center').run()">&#8596;</button>
      <button type="button" title="Rata kanan" :class="{ on: editor.isActive({ textAlign: 'right' }) }" @click="editor.chain().focus().setTextAlign('right').run()">&#8677;</button>
      <span class="sep" />
      <button type="button" title="Garis pemisah" @click="editor.chain().focus().setHorizontalRule().run()">&mdash;</button>
      <button type="button" title="Urungkan" @click="editor.chain().focus().undo().run()">&#8630;</button>
      <button type="button" title="Ulangi" @click="editor.chain().focus().redo().run()">&#8631;</button>
    </div>

    <EditorContent
      :editor="editor"
      class="editor-content"
      :style="{ fontFamily: fontStack, fontSize: `${baseSize}px` }"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'

const props = withDefaults(
  defineProps<{
    modelValue: string
    editable?: boolean
    fontStack?: string
    baseSize?: number
  }>(),
  { editable: true, fontStack: "'Cormorant Garamond', Georgia, serif", baseSize: 17 },
)
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const editor = useEditor({
  content: props.modelValue || '<p></p>',
  editable: props.editable,
  extensions: [
    StarterKit,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
  ],
  onUpdate: ({ editor }) => emit('update:modelValue', editor.getHTML()),
})

// Sync external content changes (e.g. loading an existing story to edit).
watch(
  () => props.modelValue,
  (val) => {
    if (editor.value && val !== editor.value.getHTML()) {
      editor.value.commands.setContent(val || '<p></p>', false)
    }
  },
)

onBeforeUnmount(() => editor.value?.destroy())
</script>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  background: #fffdf8;
  overflow: hidden;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  padding: 8px 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: #f5f1e8;
  position: sticky;
  top: 0;
  z-index: 2;
}

.toolbar button {
  min-width: 30px;
  height: 30px;
  padding: 0 7px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: #3a342a;
  font-size: 14px;
  font-family: Georgia, serif;
  cursor: pointer;
  line-height: 1;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.toolbar button:hover { background: rgba(0, 0, 0, 0.06); }
.toolbar button.on {
  background: #e3d6bd;
  border-color: #c9b58c;
  color: #5a3a1a;
}

.sep {
  width: 1px;
  height: 18px;
  background: rgba(0, 0, 0, 0.14);
  margin: 0 5px;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  color: #2d231a;
  line-height: 1.85;
}

.editor-content :deep(.ProseMirror) {
  min-height: 100%;
  padding: 28px 32px;
  outline: none;
}
.editor-content :deep(.ProseMirror p) { margin: 0 0 14px; }
.editor-content :deep(.ProseMirror h1) { font-size: 1.9em; font-weight: 600; margin: 18px 0 12px; }
.editor-content :deep(.ProseMirror h2) { font-size: 1.45em; font-weight: 600; margin: 16px 0 10px; }
.editor-content :deep(.ProseMirror blockquote) {
  border-left: 3px solid #c9b58c;
  margin: 14px 0;
  padding-left: 16px;
  font-style: italic;
  color: #5a3a1a;
}
.editor-content :deep(.ProseMirror ul),
.editor-content :deep(.ProseMirror ol) { padding-left: 26px; margin: 0 0 14px; }
.editor-content :deep(.ProseMirror hr) {
  border: none;
  border-top: 1px solid #c9b58c;
  margin: 22px 0;
}
.editor-content :deep(.ProseMirror:focus) { outline: none; }
.editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: 'Mulai menulis di sini…';
  color: #b3a892;
  float: left;
  height: 0;
  pointer-events: none;
  font-style: italic;
}
</style>
