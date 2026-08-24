<template>
  <div
    ref="pageRoot"
    class="fe-page"
    :class="{ 'fe-reduced-motion': prefersReducedMotion }"
    @keydown="onPageKeydown"
  >
    <canvas
      ref="canvas"
      class="fe-canvas"
      tabindex="0"
      aria-label="Interactive beach scene. Hover or tap the floating letters P, L, A, Y."
    />

    <div class="fe-sky-wash" aria-hidden="true"></div>

    <header class="fe-header">
      <div class="fe-brand">
        <span class="fe-brand-mark" aria-hidden="true">~</span>
        <span>shoreline / 01</span>
      </div>
      <p class="fe-sample-chip">SAMPLE E &middot; shoreline alphabet</p>
    </header>

    <main class="fe-interface">
      <section class="fe-intro" aria-labelledby="shoreline-title">
        <p class="fe-kicker">A playful landing experiment</p>
        <h1 id="shoreline-title">A shore you can<br />play with.</h1>
        <p class="fe-intro-copy">
          Touch the floating alphabet. Each letter becomes a real content
          portal later; the words are placeholders while the experience wins.
        </p>

        <div class="fe-letter-controls" aria-label="Choose a floating letter">
          <button
            v-for="(portal, index) in portals"
            :key="portal.letter"
            class="fe-letter-button"
            :class="{ 'fe-letter-button-active': selectedIndex === index }"
            type="button"
            :aria-pressed="selectedIndex === index"
            @mouseenter="setHover(index)"
            @mouseleave="setHover(null)"
            @focus="setHover(index)"
            @blur="setHover(null)"
            @click="selectPortal(index)"
          >
            <span class="fe-letter-key" aria-hidden="true">{{ portal.letter }}</span>
            <span>{{ portal.label }}</span>
          </button>
        </div>
      </section>

      <aside
        class="fe-portal-card"
        :class="{ 'fe-portal-card-visible': selectedPortal, 'fe-portal-card-idle': !selectedPortal }"
        aria-live="polite"
      >
        <template v-if="selectedPortal">
          <div class="fe-portal-head">
            <span class="fe-portal-letter" aria-hidden="true">{{ selectedPortal.letter }}</span>
            <div>
              <p>Portal {{ String(selectedIndex + 1).padStart(2, '0') }}</p>
              <h2>{{ selectedPortal.label }}</h2>
            </div>
            <button
              class="fe-close-button"
              type="button"
              aria-label="Close selected portal"
              title="Close"
              @click="clearSelection"
            >
              <span aria-hidden="true">&times;</span>
              <span>Close</span>
            </button>
          </div>
          <p class="fe-portal-copy">{{ selectedPortal.copy }}</p>
          <div class="fe-portal-placeholder">
            <span aria-hidden="true">&rarr;</span>
            proper information comes after the visual direction wins
          </div>
        </template>
        <template v-else>
          <div class="fe-idle-card">
            <span class="fe-idle-icon" aria-hidden="true">&#9788;</span>
            <p><strong>Touch a letter.</strong> It rises, tilts, and sends a ripple through the water.</p>
          </div>
        </template>
      </aside>
    </main>

    <footer class="fe-footer">
      <p><span aria-hidden="true">&#8596;</span> move pointer to shift the tide</p>
      <p><span aria-hidden="true">&#9678;</span> hover letters &middot; click to open &middot; keys 1&ndash;4</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

interface Portal {
  letter: string;
  label: string;
  copy: string;
  color: number;
  baseX: number;
  phase: number;
}

interface Ripple {
  mesh: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
  bornAt: number;
}

interface LetterObject {
  group: THREE.Group;
  body: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhysicalMaterial>;
  hitArea: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
  baseX: number;
  baseY: number;
  baseZ: number;
  phase: number;
  index: number;
}

useHead({
  title: 'Sample E - Shoreline Alphabet',
  meta: [
    { name: 'robots', content: 'noindex' },
    { name: 'theme-color', content: '#8ed7ec' },
  ],
});

const portals: Portal[] = [
  {
    letter: 'P',
    label: 'Playground',
    copy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur luctus, justo sed varius interdum, floats here as a future introduction.',
    color: 0xff6b6b,
    baseX: -2.15,
    phase: 0.2,
  },
  {
    letter: 'L',
    label: 'Lorem Lab',
    copy: 'Sed posuere, neque eu faucibus commodo, augue tellus sodales lectus, becomes the home for experiments, prototypes, and curious systems.',
    color: 0xf5c451,
    baseX: -0.05,
    phase: 1.4,
  },
  {
    letter: 'A',
    label: 'Amet Archive',
    copy: 'Donec ultricies sapien vitae mi finibus posuere. This portal can later hold work, case studies, or an archive without changing the scene.',
    color: 0x20b5a7,
    baseX: 2.05,
    phase: 2.7,
  },
  {
    letter: 'Y',
    label: 'Your Signal',
    copy: 'Aliquam erat volutpat. A warm final portal for contact, conversation, or any action the real landing should eventually invite.',
    color: 0x8167d9,
    baseX: 4.15,
    phase: 4.2,
  },
];

const pageRoot = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const selectedIndex = ref(-1);
const hoveredIndex = ref<number | null>(null);
const prefersReducedMotion = ref(false);
const selectedPortal = computed(() =>
  selectedIndex.value >= 0 ? portals[selectedIndex.value] : null,
);

let sceneCleanup: (() => void) | null = null;
let rippleTrigger: ((index: number) => void) | null = null;
let hoverSync: ((index: number | null) => void) | null = null;

function setHover(index: number | null) {
  hoveredIndex.value = index;
  hoverSync?.(index);
}

function selectPortal(index: number) {
  selectedIndex.value = index;
  rippleTrigger?.(index);
}

function clearSelection() {
  selectedIndex.value = -1;
  canvas.value?.focus();
}

function onPageKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    clearSelection();
    return;
  }

  const number = Number(event.key);
  if (number >= 1 && number <= portals.length) {
    event.preventDefault();
    selectPortal(number - 1);
  }
}

function createLetterTexture(letter: string) {
  const surface = document.createElement('canvas');
  surface.width = 512;
  surface.height = 512;
  const context = surface.getContext('2d');
  if (!context) throw new Error('Canvas 2D context unavailable');

  context.clearRect(0, 0, surface.width, surface.height);
  context.fillStyle = '#fffdf7';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '900 360px Arial Black, Arial, sans-serif';
  context.shadowColor = 'rgba(5, 40, 58, 0.28)';
  context.shadowBlur = 18;
  context.shadowOffsetY = 10;
  context.fillText(letter, surface.width / 2, surface.height / 2 + 12);

  const texture = new THREE.CanvasTexture(surface);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

onMounted(() => {
  const root = pageRoot.value;
  const targetCanvas = canvas.value;
  if (!root || !targetCanvas) return;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  prefersReducedMotion.value = motionQuery.matches;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x83d4e9, 0.018);

  const camera = new THREE.PerspectiveCamera(54, 1, 0.1, 120);
  camera.position.set(0, 3.4, 10.8);
  camera.lookAt(0, 1.15, -4);

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: targetCanvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch {
    root.classList.add('fe-webgl-fallback');
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Ocean: a real displaced surface, not a flat CSS gradient.
  const oceanGeometry = new THREE.PlaneGeometry(70, 90, 120, 120);
  const oceanMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uNear: { value: new THREE.Color(0x42b9cd) },
      uFar: { value: new THREE.Color(0x075d7d) },
      uSun: { value: new THREE.Color(0xffe4a8) },
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying float vWave;
      void main() {
        vUv = uv;
        vec3 p = position;
        float waveA = sin(p.x * 0.34 + uTime * 0.95) * 0.18;
        float waveB = sin(p.y * 0.20 - uTime * 0.72) * 0.12;
        float waveC = sin((p.x + p.y) * 0.13 + uTime * 0.48) * 0.08;
        p.z += waveA + waveB + waveC;
        vWave = p.z;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uNear;
      uniform vec3 uFar;
      uniform vec3 uSun;
      varying vec2 vUv;
      varying float vWave;
      void main() {
        vec3 water = mix(uNear, uFar, smoothstep(0.0, 1.0, vUv.y));
        float crest = smoothstep(0.12, 0.36, vWave);
        float horizonGlow = pow(1.0 - vUv.y, 5.0) * 0.16;
        vec3 color = mix(water, vec3(0.88, 0.98, 1.0), crest * 0.32);
        color = mix(color, uSun, horizonGlow);
        gl_FragColor = vec4(color, 0.94);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.set(0, -0.1, -22);
  scene.add(ocean);

  // Sand foreground closes the perspective and gives the scene a warm floor.
  const sandGeometry = new THREE.PlaneGeometry(80, 28, 1, 1);
  const sandMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1d59c,
    roughness: 0.98,
    metalness: 0,
  });
  const sand = new THREE.Mesh(sandGeometry, sandMaterial);
  sand.rotation.x = -Math.PI / 2;
  sand.position.set(0, 0.18, 11);
  sand.receiveShadow = true;
  scene.add(sand);

  // Sun and simple volumetric-looking clouds at the horizon.
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffe6a8 });
  const sun = new THREE.Mesh(new THREE.SphereGeometry(2.35, 32, 32), sunMaterial);
  sun.position.set(-9, 8.3, -34);
  scene.add(sun);

  const cloudMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
  });
  const cloudGeometry = new THREE.SphereGeometry(1, 18, 18);
  const cloudGroups: THREE.Group[] = [];
  const cloudData = [
    { x: -9, y: 6.4, z: -18, scale: 1.2 },
    { x: 8.5, y: 7.3, z: -24, scale: 1.55 },
    { x: 3, y: 9.2, z: -31, scale: 0.9 },
  ];
  for (const cloud of cloudData) {
    const group = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const puff = new THREE.Mesh(cloudGeometry, cloudMaterial);
      puff.position.set((i - 2) * 1.25, Math.abs(i - 2) * -0.18, (i % 2) * 0.2);
      puff.scale.set(1.25 - Math.abs(i - 2) * 0.12, 0.7 + (i % 2) * 0.18, 0.9);
      group.add(puff);
    }
    group.position.set(cloud.x, cloud.y, cloud.z);
    group.scale.setScalar(cloud.scale);
    scene.add(group);
    cloudGroups.push(group);
  }

  // Soft foam lines where the water meets the beach.
  const foamLines: THREE.Line[] = [];
  const foamMaterials: THREE.LineBasicMaterial[] = [];
  for (let row = 0; row < 3; row++) {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 120; i++) {
      const x = -30 + i * 0.5;
      points.push(new THREE.Vector3(x, 0.23 + row * 0.012, 4.6 + row * 0.65 + Math.sin(i * 0.2 + row) * 0.16));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xfff9e8,
      transparent: true,
      opacity: 0.58 - row * 0.12,
    });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    foamLines.push(line);
    foamMaterials.push(material);
  }

  // Letter objects: solid boxes + canvas letter faces + buoy rings.
  const letterObjects: LetterObject[] = [];
  const letterTextures: THREE.CanvasTexture[] = [];
  const hitTargets: THREE.Object3D[] = [];
  const boxGeometry = new THREE.BoxGeometry(1.5, 1.72, 0.38, 4, 4, 1);
  const faceGeometry = new THREE.PlaneGeometry(1.1, 1.32);
  const ringGeometry = new THREE.TorusGeometry(0.95, 0.045, 10, 48);
  const hitGeometry = new THREE.BoxGeometry(1.85, 2.1, 0.8);

  portals.forEach((portal, index) => {
    const group = new THREE.Group();
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: portal.color,
      roughness: 0.3,
      metalness: 0.08,
      transmission: 0.03,
      clearcoat: 0.7,
      clearcoatRoughness: 0.22,
      emissive: new THREE.Color(portal.color).multiplyScalar(0.05),
      emissiveIntensity: 0.7,
    });
    const body = new THREE.Mesh(boxGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const texture = createLetterTexture(portal.letter);
    letterTextures.push(texture);
    const faceMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });
    const face = new THREE.Mesh(faceGeometry, faceMaterial);
    face.position.z = 0.196;
    group.add(face);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: portal.color,
      transparent: true,
      opacity: 0.28,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.z = -0.22;
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    const hitArea = new THREE.Mesh(
      hitGeometry,
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
    );
    hitArea.userData.portalIndex = index;
    group.add(hitArea);
    hitTargets.push(hitArea);

    group.position.set(portal.baseX, 1.65, -4.1 + (index % 2) * 0.22);
    group.rotation.y = (index - 1.5) * -0.055;
    scene.add(group);

    letterObjects.push({
      group,
      body,
      hitArea,
      baseX: portal.baseX,
      baseY: 1.65,
      baseZ: -4.1 + (index % 2) * 0.22,
      phase: portal.phase,
      index,
    });
  });

  // Ground the glossy letters with actual lighting and shadows.
  const hemi = new THREE.HemisphereLight(0xbceeff, 0x8f6a3c, 2.5);
  const key = new THREE.DirectionalLight(0xfff2d4, 4.2);
  key.position.set(-5, 10, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  const fill = new THREE.DirectionalLight(0x4bc5df, 1.8);
  fill.position.set(8, 5, -4);
  scene.add(hemi, key, fill);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(2, 2);
  const cameraTarget = new THREE.Vector2(0, 0);
  const ripples: Ripple[] = [];
  const rippleGeometry = new THREE.RingGeometry(0.25, 0.3, 64);

  function addRipple(index: number) {
    const object = letterObjects[index];
    if (!object) return;
    const material = new THREE.MeshBasicMaterial({
      color: portals[index].color,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(rippleGeometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(object.group.position.x, 0.11, object.group.position.z + 0.25);
    scene.add(mesh);
    ripples.push({ mesh, bornAt: performance.now() });
  }
  rippleTrigger = addRipple;

  function updateHoverFromRaycast() {
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(hitTargets, false)[0];
    const index = hit ? Number(hit.object.userData.portalIndex) : null;
    if (hoveredIndex.value !== index) {
      hoveredIndex.value = index;
    }
    targetCanvas.style.cursor = index === null ? 'grab' : 'pointer';
  }

  hoverSync = (index) => {
    hoveredIndex.value = index;
  };

  let pressedAt = { x: 0, y: 0 };

  function onPointerMove(event: PointerEvent) {
    const rect = targetCanvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    cameraTarget.set(pointer.x * 0.65, pointer.y * 0.28);
    updateHoverFromRaycast();
  }

  function onPointerLeave() {
    pointer.set(2, 2);
    hoveredIndex.value = null;
    targetCanvas.style.cursor = 'grab';
  }

  function onPointerDown(event: PointerEvent) {
    pressedAt = { x: event.clientX, y: event.clientY };
    targetCanvas.style.cursor = 'grabbing';
  }

  function onPointerUp(event: PointerEvent) {
    const moved = Math.hypot(event.clientX - pressedAt.x, event.clientY - pressedAt.y);
    targetCanvas.style.cursor = hoveredIndex.value === null ? 'grab' : 'pointer';
    if (moved < 8 && hoveredIndex.value !== null) {
      selectPortal(hoveredIndex.value);
    }
  }

  targetCanvas.addEventListener('pointermove', onPointerMove);
  targetCanvas.addEventListener('pointerleave', onPointerLeave);
  targetCanvas.addEventListener('pointerdown', onPointerDown);
  targetCanvas.addEventListener('pointerup', onPointerUp);

  function resize() {
    const width = root.clientWidth;
    const height = root.clientHeight;
    const mobile = width < 720;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = mobile ? 13.8 : 10.8;
    camera.position.y = mobile ? 3.6 : 3.4;
    camera.updateProjectionMatrix();

    const scale = mobile ? 0.78 : 1;
    letterObjects.forEach((object, index) => {
      object.baseX = mobile ? (index - 1.5) * 1.62 : portals[index].baseX;
      object.group.scale.setScalar(scale);
    });
  }
  resize();
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  let raf = 0;

  function renderFrame() {
    const elapsed = clock.getElapsedTime();
    const now = performance.now();
    const motion = prefersReducedMotion.value ? 0 : 1;

    oceanMaterial.uniforms.uTime.value = elapsed * motion;

    // Hover has spring-like continuity: no jump, just a controlled rise/tilt.
    letterObjects.forEach((object) => {
      const hovered = hoveredIndex.value === object.index;
      const selected = selectedIndex.value === object.index;
      const bob = Math.sin(elapsed * 1.45 + object.phase) * 0.1 * motion;
      const targetY = object.baseY + bob + (hovered ? 0.42 : selected ? 0.24 : 0);
      object.group.position.x += (object.baseX - object.group.position.x) * 0.08;
      object.group.position.y += (targetY - object.group.position.y) * 0.11;
      object.group.position.z += (object.baseZ - object.group.position.z) * 0.08;
      const targetRotX = hovered ? -0.14 : 0;
      const targetRotY = (object.index - 1.5) * -0.055 + (hovered ? 0.22 : 0);
      object.group.rotation.x += (targetRotX - object.group.rotation.x) * 0.09;
      object.group.rotation.y += (targetRotY - object.group.rotation.y) * 0.09;
      const targetScale = (root.clientWidth < 720 ? 0.78 : 1) * (hovered ? 1.08 : selected ? 1.04 : 1);
      object.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      object.body.material.emissiveIntensity = hovered ? 1.8 : selected ? 1.25 : 0.7;
    });

    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];
      const age = (now - ripple.bornAt) / 1300;
      if (age >= 1) {
        scene.remove(ripple.mesh);
        ripple.mesh.material.dispose();
        ripples.splice(i, 1);
        continue;
      }
      const scale = 1 + age * 8;
      ripple.mesh.scale.setScalar(scale);
      ripple.mesh.material.opacity = (1 - age) * 0.72;
    }

    foamLines.forEach((line, index) => {
      line.position.x = Math.sin(elapsed * 0.3 + index) * 0.16 * motion;
      line.position.z = Math.sin(elapsed * 0.65 + index * 0.7) * 0.12 * motion;
    });
    cloudGroups.forEach((cloud, index) => {
      cloud.position.x += Math.sin(elapsed * 0.08 + index) * 0.0012 * motion;
    });

    camera.position.x += (cameraTarget.x - camera.position.x) * 0.025 * motion;
    camera.position.y += (3.4 - cameraTarget.y - camera.position.y) * 0.025 * motion;
    camera.lookAt(0, 1.15, -4);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(renderFrame);
  }
  renderFrame();

  function onMotionChange(event: MediaQueryListEvent) {
    prefersReducedMotion.value = event.matches;
  }
  motionQuery.addEventListener('change', onMotionChange);

  sceneCleanup = () => {
    cancelAnimationFrame(raf);
    motionQuery.removeEventListener('change', onMotionChange);
    window.removeEventListener('resize', resize);
    targetCanvas.removeEventListener('pointermove', onPointerMove);
    targetCanvas.removeEventListener('pointerleave', onPointerLeave);
    targetCanvas.removeEventListener('pointerdown', onPointerDown);
    targetCanvas.removeEventListener('pointerup', onPointerUp);
    rippleTrigger = null;
    hoverSync = null;

    ripples.forEach((ripple) => {
      scene.remove(ripple.mesh);
      ripple.mesh.material.dispose();
    });
    letterTextures.forEach((texture) => texture.dispose());
    letterObjects.forEach((object) => {
      object.body.material.dispose();
      object.group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material;
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else if (material !== object.body.material) material.dispose();
        }
      });
    });
    boxGeometry.dispose();
    faceGeometry.dispose();
    ringGeometry.dispose();
    rippleGeometry.dispose();
    oceanGeometry.dispose();
    oceanMaterial.dispose();
    hitGeometry.dispose();
    sandGeometry.dispose();
    sandMaterial.dispose();
    cloudGeometry.dispose();
    cloudMaterial.dispose();
    foamLines.forEach((line) => line.geometry.dispose());
    foamMaterials.forEach((material) => material.dispose());
    sun.geometry.dispose();
    sunMaterial.dispose();
    renderer.dispose();
  };
});

onBeforeUnmount(() => {
  sceneCleanup?.();
  sceneCleanup = null;
});
</script>

<style scoped>
.fe-page {
  --sky: #8ed7ec;
  --sky-light: #d8f4fa;
  --navy: #083b50;
  --navy-soft: #205c70;
  --cream: #fff8e7;
  --cream-glass: rgba(255, 248, 231, 0.82);
  --coral: #ff6b6b;
  --line: rgba(8, 59, 80, 0.17);
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  background: linear-gradient(180deg, var(--sky-light) 0%, var(--sky) 58%, #65c4dc 100%);
  color: var(--navy);
  font-family: 'Switzer', system-ui, -apple-system, sans-serif;
}

.fe-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: block;
  width: 100%;
  height: 100%;
  outline: none;
  touch-action: pan-y;
}

.fe-canvas:focus-visible {
  outline: 3px solid var(--coral);
  outline-offset: -5px;
}

.fe-sky-wash {
  position: absolute;
  z-index: 1;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.09), transparent 44%),
    radial-gradient(circle at 50% 46%, transparent 26%, rgba(0, 66, 92, 0.08) 100%);
}

.fe-header {
  position: relative;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem clamp(1rem, 3vw, 3rem);
}

.fe-brand,
.fe-sample-chip {
  display: inline-flex;
  align-items: center;
  min-height: 2.35rem;
  margin: 0;
  padding: 0.42rem 0.78rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 248, 231, 0.63);
  box-shadow: 0 0.55rem 1.7rem rgba(8, 59, 80, 0.09);
  backdrop-filter: blur(10px);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.fe-brand { gap: 0.45rem; }
.fe-brand-mark { color: var(--coral); font-size: 1.3rem; line-height: 0; }

.fe-interface {
  position: absolute;
  z-index: 3;
  inset: 4.4rem 0 3.2rem;
  pointer-events: none;
}

.fe-intro {
  position: absolute;
  left: clamp(1rem, 4.8vw, 5rem);
  bottom: clamp(2rem, 7vh, 5.5rem);
  width: min(23rem, calc(100vw - 2rem));
  padding: clamp(1.1rem, 2vw, 1.45rem);
  border: 1px solid rgba(8, 59, 80, 0.14);
  border-radius: 1.45rem;
  background: var(--cream-glass);
  box-shadow:
    0 1.4rem 4rem rgba(8, 59, 80, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  pointer-events: auto;
}

.fe-kicker {
  margin: 0 0 0.55rem;
  color: var(--coral);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.fe-intro h1 {
  margin: 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.15rem, 3.8vw, 3.55rem);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.95;
}

.fe-intro-copy {
  max-width: 100%;
  margin: 0.9rem 0 0;
  color: var(--navy-soft);
  font-size: 0.88rem;
  line-height: 1.65;
}
.fe-letter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.15rem;
}

.fe-letter-button {
  display: inline-flex;
  align-items: center;
  min-height: 2.4rem;
  gap: 0.45rem;
  padding: 0.38rem 0.72rem 0.38rem 0.42rem;
  border: 1px solid rgba(8, 59, 80, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.54);
  color: var(--navy);
  font: inherit;
  font-size: 0.72rem;
  font-weight: 750;
  cursor: pointer;
  transition: transform 170ms ease, border-color 170ms ease, background 170ms ease, box-shadow 170ms ease;
}

.fe-letter-button:hover,
.fe-letter-button:focus-visible,
.fe-letter-button-active {
  transform: translateY(-2px);
  border-color: rgba(255, 107, 107, 0.58);
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 0.5rem 1.2rem rgba(8, 59, 80, 0.1);
  outline: none;
}

.fe-letter-button:focus-visible {
  outline: 3px solid rgba(255, 107, 107, 0.45);
  outline-offset: 2px;
}

.fe-letter-key {
  display: grid;
  place-items: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  background: var(--navy);
  color: var(--cream);
  font-size: 0.78rem;
}

.fe-portal-card {
  position: absolute;
  right: clamp(1rem, 4vw, 4rem);
  bottom: clamp(2rem, 7vh, 5.5rem);
  width: min(25rem, calc(100vw - 2rem));
  min-height: 11.2rem;
  padding: 1.15rem;
  border: 1px solid rgba(8, 59, 80, 0.16);
  border-radius: 1.35rem;
  background: rgba(8, 59, 80, 0.78);
  box-shadow:
    0 1.4rem 4rem rgba(8, 59, 80, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  color: var(--cream);
  backdrop-filter: blur(16px);
  pointer-events: auto;
  transform: translateY(0.4rem);
  transition: transform 220ms ease, background 220ms ease;
}

.fe-portal-card-visible { transform: translateY(0); background: rgba(8, 59, 80, 0.9); }

.fe-portal-card-idle {
  width: min(18rem, calc(100vw - 2rem));
  min-height: 0;
  padding: 0.8rem 1rem;
}

.fe-portal-head {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.75rem;
  align-items: center;
}

.fe-portal-letter {
  display: grid;
  place-items: center;
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 0.85rem;
  background: var(--coral);
  color: #fff;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.55rem;
  font-weight: 800;
}

.fe-portal-head p {
  margin: 0;
  color: rgba(255, 248, 231, 0.66);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.fe-portal-head h2 {
  margin: 0.15rem 0 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.35rem;
  line-height: 1.1;
}

.fe-close-button {
  display: inline-flex;
  align-items: center;
  min-height: 2.25rem;
  gap: 0.35rem;
  border: 1px solid rgba(255, 248, 231, 0.25);
  border-radius: 999px;
  padding: 0.35rem 0.65rem;
  background: transparent;
  color: var(--cream);
  font: inherit;
  font-size: 0.7rem;
  cursor: pointer;
}

.fe-close-button:hover,
.fe-close-button:focus-visible { background: rgba(255, 255, 255, 0.1); outline: 2px solid var(--cream); }
.fe-close-button span:first-child { font-size: 1.1rem; line-height: 0.6; }

.fe-portal-copy {
  margin: 0.9rem 0 0;
  color: rgba(255, 248, 231, 0.8);
  font-size: 0.88rem;
  line-height: 1.6;
}

.fe-portal-placeholder {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.75rem;
  padding-top: 0.7rem;
  border-top: 1px solid rgba(255, 248, 231, 0.16);
  color: rgba(255, 248, 231, 0.65);
  font-size: 0.7rem;
  letter-spacing: 0.04em;
}

.fe-idle-card {
  display: flex;
  min-height: 3.8rem;
  align-items: center;
  gap: 1rem;
}

.fe-idle-card p { margin: 0; color: rgba(255, 248, 231, 0.74); line-height: 1.55; }
.fe-idle-card strong { display: block; color: var(--cream); }
.fe-idle-icon { color: #f5c451; font-size: 1.7rem; }

.fe-footer {
  position: absolute;
  z-index: 4;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem clamp(1rem, 3vw, 3rem);
  color: rgba(8, 59, 80, 0.74);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  pointer-events: none;
}

.fe-footer p { margin: 0; }

.fe-webgl-fallback .fe-canvas { display: none; }
.fe-webgl-fallback::before {
  position: absolute;
  inset: 15% 10%;
  border-radius: 50%;
  background: radial-gradient(circle at 55% 35%, #fff5ce, transparent 15%), linear-gradient(180deg, #8ed7ec 0 55%, #2a9db9 55% 72%, #f1d59c 72%);
  content: '';
  opacity: 0.9;
}

@media (max-width: 960px) {
  .fe-interface {
    inset: 4.4rem 0 2.8rem;
    display: grid;
    align-content: space-between;
    gap: 1rem;
    padding: 0 1rem 1rem;
  }

  .fe-intro,
  .fe-portal-card {
    position: relative;
    inset: auto;
    width: min(100%, 34rem);
  }

  .fe-intro { align-self: start; padding: 1.05rem 1.1rem; }
  .fe-portal-card { justify-self: end; align-self: end; min-height: 7.5rem; padding: 0.9rem; }
  .fe-idle-card { min-height: 5.7rem; }
  .fe-intro h1 { font-size: clamp(2rem, 9vw, 3rem); }
  .fe-intro-copy { display: none; }
  .fe-letter-controls { margin-top: 0.8rem; }
  .fe-letter-button { min-height: 2.2rem; }
}

@media (max-width: 640px) {
  .fe-page { min-height: 100svh; }
  .fe-header { align-items: flex-start; }
  .fe-sample-chip { max-width: 12rem; text-align: right; line-height: 1.35; }
  .fe-interface { padding-bottom: 0.55rem; }
  .fe-intro { width: min(100%, 21rem); }
  .fe-portal-card { width: min(100%, 21rem); }
  .fe-kicker { font-size: 0.62rem; }
  .fe-letter-controls { gap: 0.35rem; }
  .fe-letter-button { padding-right: 0.5rem; font-size: 0.65rem; }
  .fe-letter-button span:last-child { display: none; }
  .fe-portal-head { gap: 0.55rem; }
  .fe-portal-letter { width: 2.35rem; height: 2.35rem; font-size: 1.25rem; }
  .fe-portal-copy { font-size: 0.78rem; }
  .fe-portal-placeholder { display: none; }
  .fe-footer { display: none; }
}

@media (max-height: 720px) and (min-width: 721px) {
  .fe-intro { bottom: 1.5rem; padding: 1rem 1.2rem; }
  .fe-intro-copy { display: none; }
  .fe-letter-controls { margin-top: 0.75rem; }
  .fe-portal-card { bottom: 1.5rem; min-height: 8.5rem; }
}

@media (prefers-reduced-motion: reduce) {
  .fe-letter-button,
  .fe-portal-card { transition: none; }
}
</style>
