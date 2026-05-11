<template>
  <primitive v-if="root" :object="root" />
</template>

<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import { useGLTF } from '@tresjs/cientos'
import type { Object3D } from 'three'

const props = defineProps<{
  src: string
  scale?: number | [number, number, number]
  position?: [number, number, number]
  rotationY?: number
}>()

const root = shallowRef<Object3D | null>(null)
const { state, execute } = useGLTF(props.src)

// Kick off load and watch state for the cloned scene.
;(async () => {
  try {
    await execute()
  } catch (err) {
    console.warn(`[GlbModel] failed to load ${props.src}`, err)
  }
})()

watch(
  state,
  (gltf) => {
    if (!gltf?.scene) return
    const clone = gltf.scene.clone(true)
    if (props.scale !== undefined) {
      if (typeof props.scale === 'number') {
        clone.scale.setScalar(props.scale)
      } else {
        clone.scale.set(...props.scale)
      }
    }
    if (props.position) {
      clone.position.set(...props.position)
    }
    if (props.rotationY !== undefined) {
      clone.rotation.y = props.rotationY
    }
    clone.traverse((node) => {
      if ((node as any).isMesh) {
        node.castShadow = true
        node.receiveShadow = true
        ;(node as any).frustumCulled = true
      }
    })
    root.value = clone
  },
  { immediate: true },
)
</script>
