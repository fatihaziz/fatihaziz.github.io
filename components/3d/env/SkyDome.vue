<template>
  <TresMesh :scale="500" :frustum-culled="false">
    <TresSphereGeometry :args="[1, 32, 16]" @created="onGeo" />
    <TresMeshBasicMaterial :side="BackSide" :vertex-colors="true" :depth-write="false" :fog="false" />
  </TresMesh>
</template>

<script setup lang="ts">
import { BackSide, BufferAttribute, Color, type SphereGeometry } from 'three'
import { useGoldenHour } from '~/composables/useGoldenHour'

const gh = useGoldenHour()

function onGeo({ instance }: { instance: SphereGeometry }) {
  const positions = instance.attributes.position
  const count = positions.count
  const colors = new Float32Array(count * 3)
  const top = new Color(gh.sky.top)
  const mid = new Color(gh.sky.middle)
  const horizon = new Color(gh.sky.horizon)
  for (let i = 0; i < count; i++) {
    const y = positions.getY(i)
    const t = (y + 1) / 2
    let c: Color
    if (t > 0.6) {
      const u = Math.min(1, (t - 0.6) / 0.4)
      c = mid.clone().lerp(top, u)
    } else {
      const u = t / 0.6
      c = horizon.clone().lerp(mid, u)
    }
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  instance.setAttribute('color', new BufferAttribute(colors, 3))
}
</script>
