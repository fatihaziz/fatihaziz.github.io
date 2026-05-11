<template>
  <div ref="parent" class="game-canvas-parent" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const parent = ref<HTMLDivElement | null>(null)
let game: unknown = null

onMounted(async () => {
  if (!parent.value) return
  try {
    const PhaserMod: any = await import('phaser')
    const { createGameConfig } = await import('~/game/config')
    const PhaserNS: any = PhaserMod.default ?? PhaserMod
    game = new PhaserNS.Game(createGameConfig(parent.value))
  } catch (err) {
    console.error('[GameCanvas] Phaser init failed:', err)
  }
})

onBeforeUnmount(() => {
  if (game) {
    // @ts-expect-error - Phaser.Game.destroy signature
    game.destroy(true)
    game = null
  }
})
</script>

<style scoped>
.game-canvas-parent {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #355c3c;
}

.game-canvas-parent :deep(canvas) {
  display: block;
  max-width: 100%;
  max-height: 100%;
  image-rendering: pixelated;
}

.canvas-fallback {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #355c3c;
  color: #f5e1b6;
  font-family: monospace;
  font-size: 18px;
}
</style>
