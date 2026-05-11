<template>
  <TresGroup>
    <!-- Hero building: a stout stone tower at origin -->
    <GlbModel src="/models/buildings/tower.glb" :scale="3" :position="[0, 0, 0]" />

    <!-- Trees scattered in a loose ring around the building -->
    <GlbModel
      v-for="(t, i) in trees"
      :key="`tree-${i}`"
      :src="t.src"
      :scale="t.scale"
      :position="t.pos"
      :rotation-y="t.rotY"
    />

    <!-- Bushes hugging the building base -->
    <GlbModel
      v-for="(b, i) in bushes"
      :key="`bush-${i}`"
      :src="'/models/nature/bush.glb'"
      :scale="b.scale"
      :position="b.pos"
    />

    <!-- Flowers along the front path -->
    <GlbModel
      v-for="(f, i) in flowers"
      :key="`flower-${i}`"
      :src="f.src"
      :scale="1.2"
      :position="f.pos"
    />

    <!-- Rocks for accent -->
    <GlbModel
      v-for="(r, i) in rocks"
      :key="`rock-${i}`"
      :src="r.src"
      :scale="r.scale"
      :position="r.pos"
    />

    <!-- One whimsical mushroom near a rock -->
    <GlbModel src="/models/nature/mushroom-red.glb" :scale="1.4" :position="[-3.5, 0, 4.2]" />

    <!-- Grass tufts foreground -->
    <GlbModel src="/models/nature/grass.glb" :scale="1.6" :position="[1.8, 0, 6]" />
    <GlbModel src="/models/nature/grass.glb" :scale="1.4" :position="[-2.2, 0, 5.5]" />
    <GlbModel src="/models/nature/grass.glb" :scale="1.5" :position="[4.5, 0, 4]" />
  </TresGroup>
</template>

<script setup lang="ts">
import GlbModel from '~/components/3d/primitives/GlbModel.vue'

// Layout designed so the camera at [12, 5, 18] looking at [0, 3, 0]
// sees: foreground grass + flowers, mid trees framing, hero tower
// center-right, more trees fading into background fog.

type Tree = { src: string; scale: number; pos: [number, number, number]; rotY: number }
type Bush = { scale: number; pos: [number, number, number] }
type Flower = { src: string; pos: [number, number, number] }
type Rock = { src: string; scale: number; pos: [number, number, number] }

const trees: Tree[] = [
  { src: '/models/nature/tree-default.glb', scale: 2.4, pos: [-6, 0, -2],  rotY: 0.3 },
  { src: '/models/nature/tree-fat.glb',     scale: 2.0, pos: [-9, 0, 3],   rotY: 1.1 },
  { src: '/models/nature/tree-blocks.glb',  scale: 2.6, pos: [-7, 0, 7],   rotY: 0.7 },
  { src: '/models/nature/tree-default.glb', scale: 1.9, pos: [6, 0, -4],   rotY: 1.6 },
  { src: '/models/nature/tree-fat.glb',     scale: 2.2, pos: [9, 0, 1],    rotY: 2.1 },
  { src: '/models/nature/tree-blocks.glb',  scale: 1.7, pos: [8, 0, 6],    rotY: 0.4 },
  { src: '/models/nature/tree-default.glb', scale: 2.0, pos: [-3, 0, -8],  rotY: 2.5 },
  { src: '/models/nature/tree-blocks.glb',  scale: 1.8, pos: [4, 0, -7],   rotY: 1.2 },
  // distant fog-fade trees
  { src: '/models/nature/tree-fat.glb',     scale: 2.4, pos: [-14, 0, -5], rotY: 0.6 },
  { src: '/models/nature/tree-default.glb', scale: 2.2, pos: [14, 0, -2],  rotY: 0.9 },
]

const bushes: Bush[] = [
  { scale: 1.6, pos: [-2.5, 0, 2.5] },
  { scale: 1.4, pos: [2.8, 0, 2.2] },
  { scale: 1.3, pos: [-1.6, 0, -2.4] },
  { scale: 1.5, pos: [2.0, 0, -3] },
]

const flowers: Flower[] = [
  { src: '/models/nature/flower-red.glb',    pos: [-1.5, 0, 4] },
  { src: '/models/nature/flower-yellow.glb', pos: [-0.5, 0, 4.6] },
  { src: '/models/nature/flower-red.glb',    pos: [0.8, 0, 4.4] },
  { src: '/models/nature/flower-yellow.glb', pos: [1.8, 0, 4.8] },
  { src: '/models/nature/flower-red.glb',    pos: [-2.4, 0, 3.4] },
]

const rocks: Rock[] = [
  { src: '/models/nature/rock-large.glb', scale: 1.6, pos: [-4.6, 0, 4.5] },
  { src: '/models/nature/rock-small.glb', scale: 1.4, pos: [3.6, 0, 5] },
  { src: '/models/nature/rock-small.glb', scale: 1.2, pos: [-2, 0, 5.6] },
]
</script>
