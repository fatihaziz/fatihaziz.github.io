<template>
  <TresDirectionalLight
    :position="gh.sun.pos"
    :intensity="gh.sun.intensity"
    :color="gh.sun.color"
    :cast-shadow="true"
  />
  <TresAmbientLight :intensity="gh.ambient.intensity" :color="gh.ambient.color" />
  <TresHemisphereLight
    :args="[gh.hemisphere.sky, gh.hemisphere.ground, gh.hemisphere.intensity]"
  />
  <TresFogExp2 :args="[gh.fog.color, gh.fog.density]" attach="fog" />
</template>

<script setup lang="ts">
import { useGoldenHour } from '~/composables/useGoldenHour'
const gh = useGoldenHour()
</script>
