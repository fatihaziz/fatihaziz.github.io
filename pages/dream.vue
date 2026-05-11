<template>
  <div class="dream-page">
    <ClientOnly>
      <TresCanvas
        :clear-color="'#FFCFA0'"
        window-size
        :shadows="true"
        :alpha="false"
        class="dream-canvas"
      >
        <TresPerspectiveCamera
          :position="sandboxCam.pos"
          :look-at="sandboxCam.look"
          :fov="sandboxCam.fov"
          :near="0.1"
          :far="2000"
        />
        <SkyDome />
        <Lighting />
        <GroundPlane />
        <Suspense>
          <VillageScene />
        </Suspense>
      </TresCanvas>
      <template #fallback>
        <div class="canvas-fallback">Preparing the village...</div>
      </template>
    </ClientOnly>

    <RouteCrumb />
    <BackToVillage />

    <div class="hud-note">
      <p>Dream Village &mdash; sandbox</p>
      <p>Kenney CC0 props. Hero camera + 5 routes arrive in J.1.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkyDome from '~/components/3d/env/SkyDome.vue'
import Lighting from '~/components/3d/env/Lighting.vue'
import GroundPlane from '~/components/3d/env/GroundPlane.vue'
import VillageScene from '~/components/3d/VillageScene.vue'
import RouteCrumb from '~/components/ui/RouteCrumb.vue'
import BackToVillage from '~/components/ui/BackToVillage.vue'

// Eye-level approach: camera in front-right of the village, looking at
// the tower mid-height. Frame composition: ground bottom, trees framing,
// sky upper third with horizon visible behind tower.
const sandboxCam = {
  pos: [12, 5, 18] as [number, number, number],
  look: [0, 3, 0] as [number, number, number],
  fov: 50,
}

useHead({
  title: 'Dream Village — Fatih',
  meta: [
    { name: 'description', content: 'Foundation sandbox for fatihaziz.com 3D village.' },
  ],
})
</script>

<style scoped>
.dream-page {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #FFCFA0;
}

.dream-canvas {
  position: absolute !important;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
}

.canvas-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Mangiola', serif;
  color: #5D4037;
  font-size: 18px;
}

.hud-note {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  text-align: center;
  font-family: 'Mangiola', serif;
  color: rgba(245, 229, 197, 0.85);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.55);
  pointer-events: none;
  user-select: none;
}

.hud-note p {
  margin: 0;
  line-height: 1.4;
}

.hud-note p:first-child {
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.9;
}

.hud-note p:last-child {
  font-size: 12px;
  opacity: 0.65;
  margin-top: 4px;
}
</style>
