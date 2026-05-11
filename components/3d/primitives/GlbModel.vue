<template>
  <primitive v-if="root" :object="root" />
</template>

<script setup lang="ts">
import { shallowRef, watchEffect } from 'vue'
import { useGLTF } from '@tresjs/cientos'
import type { Object3D } from 'three'

const props = defineProps<{
  src: string
  scale?: number | [number, number, number]
}>()

const root = shallowRef<Object3D | null>(null)

watchEffect(async () => {
  if (!props.src) return
  try {
    const { scene } = await useGLTF(props.src)
    const clone = scene.clone(true)
    if (props.scale !== undefined) {
      if (typeof props.scale === 'number') {
        clone.scale.setScalar(props.scale)
      } else {
        clone.scale.set(...props.scale)
      }
    }
    clone.traverse((node) => {
      if ((node as any).isMesh) {
        node.castShadow = true
        node.receiveShadow = true
        ;(node as any).frustumCulled = true
      }
    })
    root.value = clone
  } catch (err) {
    console.warn(`[GlbModel] failed to load ${props.src}`, err)
    root.value = null
  }
})
</script>
