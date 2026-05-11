<template>
  <TresMesh :rotation-x="-Math.PI / 2" :receive-shadow="true">
    <TresPlaneGeometry :args="[200, 200, 1, 1]" />
    <TresMeshStandardMaterial :color="color" :roughness="1" :metalness="0" />
  </TresMesh>
</template>

<script setup lang="ts">
// Stylized matte ground. Texture / nature props arrive in J.1 hero phase.
const color = '#7A8F5A'
</script>
