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
    // 3-stop: horizon at t<0.35 -> mid orange ~0.35..0.55 -> blue zenith t>0.55
    float warm = smoothstep(0.0, 0.35, t);
    float cool = smoothstep(0.35, 0.7, t);
    vec3 col = mix(uHorizon, uMid, warm);
    col = mix(col, uTop, cool);
    gl_FragColor = vec4(col, 1.0);
  }
`
</script>
