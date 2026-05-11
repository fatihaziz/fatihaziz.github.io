<template>
  <TresMesh :scale="500" :frustum-culled="false">
    <TresSphereGeometry :args="[1, 64, 32]" />
    <TresShaderMaterial
      :side="BackSide"
      :depth-write="false"
      :fog="false"
      :uniforms="uniforms"
      :vertex-shader="vertexShader"
      :fragment-shader="fragmentShader"
    />
  </TresMesh>
</template>

<script setup lang="ts">
import { BackSide, Color } from 'three'
import { useGoldenHour } from '~/composables/useGoldenHour'

const gh = useGoldenHour()

const uniforms = {
  uTop:     { value: new Color(gh.sky.top) },
  uMid:     { value: new Color(gh.sky.middle) },
  uHorizon: { value: new Color(gh.sky.horizon) },
}

const vertexShader = /* glsl */ `
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uMid;
  uniform vec3 uHorizon;
  varying vec3 vWorldPos;
  void main() {
    float h = normalize(vWorldPos).y;          // -1..1 along world up
    float t = clamp((h + 1.0) * 0.5, 0.0, 1.0);
    // 3-stop: horizon(0) -> mid(0.5) -> top(1)
    float warm = smoothstep(0.0, 0.5, t);
    float cool = smoothstep(0.45, 0.85, t);
    vec3 col = mix(uHorizon, uMid, warm);
    col = mix(col, uTop, cool);
    gl_FragColor = vec4(col, 1.0);
  }
`
</script>
