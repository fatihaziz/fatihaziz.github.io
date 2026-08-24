<template>
  <div
    ref="root"
    class="ff-page"
    :class="{ 'ff-reduced-motion': prefersReducedMotion }"
    @keydown="onPageKeydown"
  >
    <div class="ff-stage">
      <div class="ff-pool-pattern" :style="patternStyle" aria-hidden="true"></div>
      <canvas
        ref="canvas"
        class="ff-canvas"
        tabindex="0"
        aria-label="Interactive 3D pool. Drag the floating letters F L O A T."
      />

      <header class="ff-header">
        <div class="ff-brand">
          <span class="ff-brand-dot" aria-hidden="true"></span>
          <span>FLOAT</span>
          <small>pool-world experiment</small>
        </div>
        <button class="ff-skip" type="button" @click="goToSection('about')">
          <span>Skip intro</span>
          <span aria-hidden="true">&#8600;</span>
        </button>
      </header>

      <nav
        class="ff-nav"
        :class="{ 'ff-nav-visible': scrollProgress > 0.24 }"
        aria-label="Sample sections"
      >
        <button
          v-for="item in sections"
          :key="item.id"
          type="button"
          :class="{ 'ff-nav-active': activeSection === item.id }"
          @click="goToSection(item.id)"
        >
          <span :aria-hidden="true">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <section class="ff-hero" :style="heroStyle" aria-label="Intro">
        <p class="ff-hero-kicker">SAMPLE F / SCROLL TO ASSEMBLE</p>
        <h1>FLOAT</h1>
        <p>creative studio &middot; lorem ipsum</p>
      </section>

      <div class="ff-letter-controls" :style="letterControlsStyle" aria-label="Nudge a letter">
        <button
          v-for="(letter, index) in letters"
          :aria-label="`Nudge 3D letter ${letter}`"
          :key="letter"
          type="button"
          @click="pulseLetter(index)"
        >
          <span>{{ letter }}</span>
        </button>
      </div>

      <p class="ff-scroll-cue" :style="heroStyle">
        <span aria-hidden="true">&#8595;</span>
        drag the letters &middot; then scroll
      </p>

      <article
        class="ff-content-panel ff-about-panel"
        :class="{ 'ff-panel-active': activeSection === 'about' }"
        :style="panelStyles.about"
        aria-labelledby="ff-about-title"
      >
        <p class="ff-section-index">01 / ABOUT</p>
        <h2 id="ff-about-title">
          Hi, I&rsquo;m Lorem.<br />
          <em>I make digital spaces feel alive.</em>
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
          vitae nibh sed justo dignissim pretium. I like useful systems,
          playful interfaces, and the strange little details that make a page
          worth touching.
        </p>
        <dl>
          <div><dt>Based</dt><dd>Somewhere warm</dd></div>
          <div><dt>Exploring</dt><dd>Playful human interfaces</dd></div>
        </dl>
      </article>

      <article
        class="ff-content-panel ff-projects-panel"
        :class="{ 'ff-panel-active': activeSection === 'projects' }"
        :style="panelStyles.projects"
        aria-labelledby="ff-projects-title"
      >
        <p class="ff-section-index">02 / PROJECTS</p>
        <h2 id="ff-projects-title">Small worlds,<br /><em>built to be touched.</em></h2>
        <div class="ff-project-grid">
          <button v-for="project in placeholderProjects" :key="project.index" type="button">
            <span>{{ project.index }}</span>
            <strong>{{ project.title }}</strong>
            <small>{{ project.type }}</small>
            <i aria-hidden="true">&#8599;</i>
          </button>
        </div>
      </article>

      <article
        class="ff-content-panel ff-skills-panel"
        :class="{ 'ff-panel-active': activeSection === 'skills' }"
        :style="panelStyles.skills"
        aria-labelledby="ff-skills-title"
      >
        <p class="ff-section-index">03 / SKILLS</p>
        <h2 id="ff-skills-title">A deliberately<br /><em>unfinished toolkit.</em></h2>
        <div class="ff-skill-list">
          <div v-for="skill in placeholderSkills" :key="skill.label">
            <span>{{ skill.label }}</span>
            <div><i :style="{ width: skill.value + '%' }"></i></div>
            <small>{{ skill.note }}</small>
          </div>
        </div>
      </article>

      <article
        class="ff-content-panel ff-contact-panel"
        :class="{ 'ff-panel-active': activeSection === 'contact' }"
        :style="panelStyles.contact"
        aria-labelledby="ff-contact-title"
      >
        <p class="ff-section-index">04 / CONTACT</p>
        <h2 id="ff-contact-title">Send a signal<br /><em>across the pool.</em></h2>
        <p>
          Lorem ipsum dolor sit amet. The real call to action can arrive after
          this visual world earns its place.
        </p>
        <button type="button" @click="pulseMascot">
          <span aria-hidden="true">&#9993;</span>
          <span>hello@lorem.example</span>
        </button>
      </article>

      <div class="ff-progress" aria-label="Intro progress">
        <span :style="{ height: `${Math.max(4, scrollProgress * 100)}%` }"></span>
      </div>

      <div class="ff-corner-note" aria-hidden="true">
        SAMPLE F &middot; draggable pool world
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import helvetiker from 'three/examples/fonts/helvetiker_bold.typeface.json';
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';

interface NavSection {
  id: 'intro' | 'about' | 'projects' | 'skills' | 'contact';
  label: string;
  icon: string;
  progress: number;
}

interface LetterObject {
  group: THREE.Group;
  mesh: THREE.Mesh<TextGeometry, THREE.MeshPhysicalMaterial>;
  hitTarget: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
  scatter: THREE.Vector3;
  word: THREE.Vector3;
  dragOffset: THREE.Vector3;
  baseRotation: number;
  phase: number;
}

interface Ripple {
  mesh: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
  bornAt: number;
}

useHead({
  title: 'Sample F - FLOAT Pool World',
  meta: [
    { name: 'robots', content: 'noindex' },
    { name: 'theme-color', content: '#83d6e8' },
  ],
});


const letters = ['F', 'L', 'O', 'A', 'T'];
const palette = [0x8fd3e1, 0xf2c84b, 0xf4a0b2, 0x62bde2, 0xf0dfb5];
const sections: NavSection[] = [
  { id: 'about', label: 'About', icon: '◉', progress: 0.38 },
  { id: 'projects', label: 'Projects', icon: '▦', progress: 0.56 },
  { id: 'skills', label: 'Skills', icon: '✦', progress: 0.73 },
  { id: 'contact', label: 'Contact', icon: '✉', progress: 0.89 },
];
const placeholderProjects = [
  { index: '01', title: 'Lorem Object', type: 'Interactive / Three.js' },
  { index: '02', title: 'Ipsum System', type: 'Product / Interface' },
  { index: '03', title: 'Dolor World', type: 'Experiment / Motion' },
];
const placeholderSkills = [
  { label: 'Lorem craft', value: 88, note: 'systems & structure' },
  { label: 'Ipsum motion', value: 74, note: 'interaction & continuity' },
  { label: 'Dolor detail', value: 94, note: 'the tiny things' },
  { label: 'Sit amet', value: 82, note: 'shipping the work' },
];

const root = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const scrollProgress = ref(0);
const smoothProgress = ref(0);
const prefersReducedMotion = ref(false);
const activeSection = computed<NavSection['id']>(() => {
  const value = scrollProgress.value;
  if (value < 0.3) return 'intro';
  if (value < 0.49) return 'about';
  if (value < 0.66) return 'projects';
  if (value < 0.82) return 'skills';
  return 'contact';
});

const patternStyle = computed(() => ({
  opacity: String(smoothstep(0.27, 0.43, scrollProgress.value)),
}));
const heroStyle = computed(() => {
  const fade = 1 - smoothstep(0.18, 0.31, scrollProgress.value);
  return {
    opacity: String(fade),
    transform: `translate3d(0, ${Math.round((1 - fade) * -24)}px, 0)`,
    pointerEvents: fade > 0.4 ? 'auto' : 'none',
  };
});
const letterControlsStyle = computed(() => {
  const fade = 1 - smoothstep(0.18, 0.31, scrollProgress.value);
  return {
    opacity: String(fade),
    pointerEvents: fade > 0.4 ? 'auto' : 'none',
  };
});
const panelStyles = computed(() => ({
  about: makePanelStyle(scrollProgress.value, 0.32, 0.52),
  projects: makePanelStyle(scrollProgress.value, 0.50, 0.69),
  skills: makePanelStyle(scrollProgress.value, 0.67, 0.85),
  contact: makePanelStyle(scrollProgress.value, 0.83, 1.02),
}));

const sceneActions = reactive<{
  pulseLetter: ((index: number) => void) | null;
  pulseMascot: (() => void) | null;
}>({ pulseLetter: null, pulseMascot: null });

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(from: number, to: number, value: number) {
  const t = clamp01((value - from) / Math.max(0.0001, to - from));
  return t * t * (3 - 2 * t);
}

function makePanelStyle(progress: number, from: number, to: number) {
  const enter = smoothstep(from, from + 0.055, progress);
  const leave = 1 - smoothstep(to - 0.045, to, progress);
  const opacity = enter * leave;
  return {
    opacity: String(opacity),
    transform: `translate3d(${Math.round((1 - enter) * 44)}px, calc(-50% + ${Math.round((1 - opacity) * 22)}px), 0)`,
    pointerEvents: opacity > 0.72 ? 'auto' : 'none',
    visibility: opacity > 0.015 ? 'visible' : 'hidden',
  };
}

function goToSection(id: NavSection['id']) {
  const target = sections.find((section) => section.id === id);
  if (!target || !root.value) return;
  const distance = root.value.scrollHeight - window.innerHeight;
  window.scrollTo({
    top: distance * target.progress,
    behavior: prefersReducedMotion.value ? 'auto' : 'smooth',
  });
}

function pulseLetter(index: number) {
  sceneActions.pulseLetter?.(index);
}

function pulseMascot() {
  sceneActions.pulseMascot?.();
}

function onPageKeydown(event: KeyboardEvent) {
  const number = Number(event.key);
  if (number >= 1 && number <= letters.length) {
    event.preventDefault();
    pulseLetter(number - 1);
  }
  if (event.key === 'Home') {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion.value ? 'auto' : 'smooth' });
  }
}

function centerTextGeometry(geometry: TextGeometry) {
  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox;
  if (!bounds) return;
  const width = bounds.max.x - bounds.min.x;
  const height = bounds.max.y - bounds.min.y;
  geometry.translate(-width / 2, -height / 2, 0);
}

let cleanupScene: (() => void) | null = null;

onMounted(() => {
  const page = root.value;
  const targetCanvas = canvas.value;
  if (!page || !targetCanvas) return;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  prefersReducedMotion.value = motionQuery.matches;
  const font = new FontLoader().parse(helvetiker as never);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 10.8, 11.5);
  camera.lookAt(0, 0, -2.4);

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: targetCanvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
  } catch {
    page.classList.add('ff-webgl-fallback');
    return;
  }

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const poolObjects: THREE.Object3D[] = [];

  // Pool tiles: canvas-authored so the grid is crisp from a top-down camera.
  const tileCanvas = document.createElement('canvas');
  tileCanvas.width = 1024;
  tileCanvas.height = 1024;
  const tileContext = tileCanvas.getContext('2d');
  if (!tileContext) return;
  tileContext.fillStyle = '#8cd9e9';
  tileContext.fillRect(0, 0, 1024, 1024);
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const alternating = (x + y) % 3 === 0;
      tileContext.fillStyle = alternating ? 'rgba(255,255,255,.065)' : 'rgba(35,150,184,.035)';
      tileContext.fillRect(x * 128 + 3, y * 128 + 3, 122, 122);
    }
  }
  tileContext.strokeStyle = 'rgba(241,252,255,.62)';
  tileContext.lineWidth = 3;
  for (let i = 0; i <= 8; i++) {
    tileContext.beginPath();
    tileContext.moveTo(i * 128, 0);
    tileContext.lineTo(i * 128, 1024);
    tileContext.stroke();
    tileContext.beginPath();
    tileContext.moveTo(0, i * 128);
    tileContext.lineTo(1024, i * 128);
    tileContext.stroke();
  }
  const tileTexture = new THREE.CanvasTexture(tileCanvas);
  tileTexture.colorSpace = THREE.SRGBColorSpace;
  tileTexture.wrapS = THREE.RepeatWrapping;
  tileTexture.wrapT = THREE.RepeatWrapping;
  tileTexture.repeat.set(3.2, 3.8);

  const floorGeometry = new THREE.PlaneGeometry(34, 42, 1, 1);
  geometries.push(floorGeometry);
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: tileTexture,
    color: 0xffffff,
    roughness: 0.78,
    transparent: true,
  });
  materials.push(floorMaterial);
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -0.52, -7);
  floor.receiveShadow = true;
  scene.add(floor);
  poolObjects.push(floor);

  const waterGeometry = new THREE.PlaneGeometry(34, 42, 80, 80);
  geometries.push(waterGeometry);
  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uFade: { value: 1 } },
    transparent: true,
    depthWrite: false,
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying float vWave;
      void main() {
        vUv = uv;
        vec3 p = position;
        p.z += sin(p.x * .7 + uTime) * .045 + sin(p.y * .5 - uTime * .7) * .035;
        vWave = p.z;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uFade;
      varying vec2 vUv;
      varying float vWave;
      void main() {
        float lightBand = sin(vUv.x * 34.0 + sin(vUv.y * 12.0 + uTime) * 2.2 + uTime * 1.2);
        lightBand = smoothstep(.76, 1.0, lightBand) * .12;
        vec3 color = vec3(.54, .87, .94) + lightBand + vWave * .35;
        gl_FragColor = vec4(color, .23 * uFade);
      }
    `,
  });
  materials.push(waterMaterial);
  const water = new THREE.Mesh(waterGeometry, waterMaterial);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, -0.05, -7);
  scene.add(water);
  poolObjects.push(water);

  // Real extruded type, laid onto the pool floor like chunky foam blocks.
  const letterObjects: LetterObject[] = [];
  const hitTargets: THREE.Object3D[] = [];
  const letterTarget = new THREE.BoxGeometry(2.3, 1.9, 1.2);
  geometries.push(letterTarget);
  const scatterPositions = [
    new THREE.Vector3(-4.8, 0.1, -0.5),
    new THREE.Vector3(-1.8, 0.1, -4.4),
    new THREE.Vector3(1.2, 0.1, -1.1),
    new THREE.Vector3(4.2, 0.1, -3.7),
    new THREE.Vector3(2.5, 0.1, 1.7),
  ];
  const wordXs = [-4.5, -2.25, 0, 2.25, 5.3];

  letters.forEach((letter, index) => {
    const geometry = new TextGeometry(letter, {
      font,
      size: 1.72,
      depth: 0.48,
      curveSegments: 8,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.055,
      bevelOffset: 0,
      bevelSegments: 4,
    });
    centerTextGeometry(geometry);
    geometries.push(geometry);
    const material = new THREE.MeshPhysicalMaterial({
      color: palette[index],
      roughness: 0.36,
      metalness: 0.04,
      clearcoat: 0.55,
      clearcoatRoughness: 0.25,
      transparent: true,
    });
    materials.push(material);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const hitMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
    materials.push(hitMaterial);
    const hitTarget = new THREE.Mesh(letterTarget, hitMaterial);
    hitTarget.position.y = 0.45;
    hitTarget.userData.letterIndex = index;

    const group = new THREE.Group();
    group.add(mesh, hitTarget);
    const scatter = scatterPositions[index].clone();
    group.position.copy(scatter);
    group.rotation.y = [-0.22, 0.14, -0.08, 0.18, -0.16][index];
    scene.add(group);
    hitTargets.push(hitTarget);
    letterObjects.push({
      group,
      mesh,
      hitTarget,
      scatter,
      word: new THREE.Vector3(wordXs[index], 0.1, -2.1),
      dragOffset: new THREE.Vector3(),
      baseRotation: group.rotation.y,
      phase: index * 1.1,
    });
  });

  // Pool toys: sparse, large enough to register, never decoration confetti.
  function makeFloatRing(color: number, position: THREE.Vector3, radius = 1.25) {
    const geometry = new THREE.TorusGeometry(radius, 0.34, 18, 64);
    geometries.push(geometry);
    const material = new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.32,
      clearcoat: 0.72,
      clearcoatRoughness: 0.2,
      transparent: true,
    });
    materials.push(material);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.copy(position);
    mesh.castShadow = true;
    scene.add(mesh);
    poolObjects.push(mesh);
    return mesh;
  }
  const limeRing = makeFloatRing(0xf4e177, new THREE.Vector3(-6.2, 0.16, -6.2), 1.15);
  const coralRing = makeFloatRing(0xffa681, new THREE.Vector3(0.4, 0.18, -8.4), 0.88);

  function makeSoftBlock(color: number, x: number, z: number, scale: number) {
    const geometry = new THREE.BoxGeometry(1.15, 0.48, 1.05, 3, 2, 3);
    geometries.push(geometry);
    const material = new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.3,
      clearcoat: 0.55,
      transparent: true,
    });
    materials.push(material);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, 0.18, z);
    mesh.rotation.y = x * 0.08;
    mesh.scale.setScalar(scale);
    mesh.castShadow = true;
    scene.add(mesh);
    poolObjects.push(mesh);
    return mesh;
  }
  const blocks = [
    makeSoftBlock(0xf4a7bb, -5.8, 2.5, 0.82),
    makeSoftBlock(0xd9edf1, 5.7, 2.2, 0.9),
    makeSoftBlock(0x8bbbc9, -0.8, -8.6, 0.75),
  ];

  // Original mascot: a tiny robot lounging on a yellow ring.
  const mascot = new THREE.Group();
  const mascotRingGeometry = new THREE.TorusGeometry(1.02, 0.28, 18, 64);
  const mascotRingMaterial = new THREE.MeshPhysicalMaterial({ color: 0xf4c95d, roughness: 0.3, clearcoat: 0.7, transparent: true });
  geometries.push(mascotRingGeometry);
  materials.push(mascotRingMaterial);
  const mascotRing = new THREE.Mesh(mascotRingGeometry, mascotRingMaterial);
  mascotRing.rotation.x = -Math.PI / 2;
  mascot.add(mascotRing);

  const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.56, 6, 14);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x225e84, roughness: 0.48, transparent: true });
  geometries.push(bodyGeometry);
  materials.push(bodyMaterial);
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.set(0, 0.62, 0.08);
  body.rotation.z = -0.25;
  mascot.add(body);

  const headGeometry = new THREE.SphereGeometry(0.36, 24, 24);
  const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffd7bd, roughness: 0.56, transparent: true });
  geometries.push(headGeometry);
  materials.push(headMaterial);
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.set(-0.18, 1.2, 0.06);
  mascot.add(head);

  const visorGeometry = new THREE.BoxGeometry(0.48, 0.15, 0.38);
  const visorMaterial = new THREE.MeshPhysicalMaterial({ color: 0x0e405d, metalness: 0.22, roughness: 0.18, transparent: true });
  geometries.push(visorGeometry);
  materials.push(visorMaterial);
  const visor = new THREE.Mesh(visorGeometry, visorMaterial);
  visor.position.set(-0.2, 1.25, 0.27);
  visor.rotation.z = -0.08;
  mascot.add(visor);

  mascot.position.set(5.4, 0.28, -7.8);
  mascot.rotation.y = -0.35;
  scene.add(mascot);
  poolObjects.push(mascot);

  // Lighting makes the pastel foam feel tactile rather than flat.
  const hemi = new THREE.HemisphereLight(0xe8fbff, 0x5b8ca2, 2.7);
  const key = new THREE.DirectionalLight(0xfff6dc, 4.7);
  key.position.set(-6, 13, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(1536, 1536);
  key.shadow.camera.left = -13;
  key.shadow.camera.right = 13;
  key.shadow.camera.top = 13;
  key.shadow.camera.bottom = -13;
  const fill = new THREE.DirectionalLight(0x6dcfe7, 2.1);
  fill.position.set(8, 5, -8);
  scene.add(hemi, key, fill);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(2, 2);
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.16);
  const dragPoint = new THREE.Vector3();
  const cameraParallax = new THREE.Vector2();
  const ripples: Ripple[] = [];
  const rippleGeometry = new THREE.RingGeometry(0.2, 0.26, 64);
  geometries.push(rippleGeometry);
  let hoveredIndex: number | null = null;
  let draggedIndex: number | null = null;
  let pointerStart = { x: 0, y: 0 };
  let mascotPulseUntil = 0;

  function addRipple(x: number, z: number, color: number) {
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.72, side: THREE.DoubleSide, depthWrite: false });
    materials.push(material);
    const mesh = new THREE.Mesh(rippleGeometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.08, z);
    scene.add(mesh);
    ripples.push({ mesh, bornAt: performance.now() });
  }

  function setPointerFromEvent(event: PointerEvent) {
    const rect = targetCanvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    cameraParallax.set(pointer.x, pointer.y);
  }

  function updateHover() {
    if (smoothProgress.value > 0.34 || draggedIndex !== null) {
      hoveredIndex = null;
      targetCanvas.style.cursor = 'default';
      return;
    }
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(hitTargets, false)[0];
    hoveredIndex = hit ? Number(hit.object.userData.letterIndex) : null;
    targetCanvas.style.cursor = hoveredIndex === null ? 'grab' : 'grab';
  }

  function onPointerMove(event: PointerEvent) {
    setPointerFromEvent(event);
    if (draggedIndex !== null) {
      raycaster.setFromCamera(pointer, camera);
      if (raycaster.ray.intersectPlane(dragPlane, dragPoint)) {
        const letter = letterObjects[draggedIndex];
        const base = letter.word.clone().lerp(letter.scatter, 1 - smoothstep(0.04, 0.22, smoothProgress.value));
        letter.dragOffset.x = THREE.MathUtils.clamp(dragPoint.x - base.x, -3.8, 3.8);
        letter.dragOffset.z = THREE.MathUtils.clamp(dragPoint.z - base.z, -4.2, 4.2);
      }
      return;
    }
    updateHover();
  }

  function onPointerDown(event: PointerEvent) {
    if (smoothProgress.value > 0.34) return;
    setPointerFromEvent(event);
    updateHover();
    pointerStart = { x: event.clientX, y: event.clientY };
    if (hoveredIndex !== null) {
      draggedIndex = hoveredIndex;
      targetCanvas.setPointerCapture(event.pointerId);
      targetCanvas.style.cursor = 'grabbing';
    }
  }

  function onPointerUp(event: PointerEvent) {
    if (draggedIndex === null) return;
    const moved = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
    const index = draggedIndex;
    draggedIndex = null;
    if (targetCanvas.hasPointerCapture(event.pointerId)) targetCanvas.releasePointerCapture(event.pointerId);
    targetCanvas.style.cursor = 'grab';
    if (moved < 8) {
      const letter = letterObjects[index];
      addRipple(letter.group.position.x, letter.group.position.z, palette[index]);
    }
  }

  function onPointerLeave() {
    if (draggedIndex === null) {
      hoveredIndex = null;
      pointer.set(2, 2);
      targetCanvas.style.cursor = 'grab';
    }
  }

  targetCanvas.addEventListener('pointermove', onPointerMove);
  targetCanvas.addEventListener('pointerdown', onPointerDown);
  targetCanvas.addEventListener('pointerup', onPointerUp);
  targetCanvas.addEventListener('pointerleave', onPointerLeave);

  sceneActions.pulseLetter = (index) => {
    const object = letterObjects[index];
    if (!object) return;
    object.dragOffset.y = 0.8;
    addRipple(object.group.position.x, object.group.position.z, palette[index]);
    targetCanvas.focus();
  };
  sceneActions.pulseMascot = () => {
    mascotPulseUntil = performance.now() + 900;
  };

  function onScroll() {
    const available = Math.max(1, page.scrollHeight - window.innerHeight);
    scrollProgress.value = clamp01(window.scrollY / available);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  let isMobileViewport = false;

  function resize() {
    const width = page.clientWidth;
    const height = window.innerHeight;
    const mobile = width < 720;
    isMobileViewport = mobile;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.4 : 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = mobile ? 78 : 38;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  function onMotionChange(event: MediaQueryListEvent) {
    prefersReducedMotion.value = event.matches;
  }
  motionQuery.addEventListener('change', onMotionChange);

  const clock = new THREE.Clock();
  let raf = 0;

  function renderFrame() {
    const elapsed = clock.getElapsedTime();
    const now = performance.now();
    const motion = prefersReducedMotion.value ? 0 : 1;
    const target = scrollProgress.value;
    smoothProgress.value += (target - smoothProgress.value) * (prefersReducedMotion.value ? 1 : 0.08);
    const progress = smoothProgress.value;
    const assemble = smoothstep(0.035, 0.22, progress);
    const exit = smoothstep(0.26, 0.39, progress);
    const worldFade = 1 - smoothstep(0.26, 0.38, progress);

    waterMaterial.uniforms.uTime.value = elapsed * motion;
    waterMaterial.uniforms.uFade.value = worldFade;
    floorMaterial.opacity = 0.96 * worldFade;

    letterObjects.forEach((letter, index) => {
      const assembled = letter.scatter.clone().lerp(letter.word, assemble);
      const direction = index - 2;
      const exitPosition = new THREE.Vector3(
        letter.word.x + direction * 2.8,
        0.3 + Math.abs(direction) * 0.35,
        letter.word.z + (index % 2 ? -4.5 : 4.5),
      );
      const base = assembled.lerp(exitPosition, exit);
      const hoverLift = hoveredIndex === index ? 0.52 : 0;
      const pulse = Math.max(0, letter.dragOffset.y);
      const bob = Math.sin(elapsed * 1.25 + letter.phase) * 0.06 * motion * (1 - exit);
      const desired = base.clone().add(new THREE.Vector3(letter.dragOffset.x, letter.dragOffset.y, letter.dragOffset.z));
      desired.y += hoverLift + bob;
      letter.group.position.lerp(desired, draggedIndex === index ? 0.35 : 0.1);
      letter.dragOffset.y *= 0.9;
      const targetRotY = THREE.MathUtils.lerp(letter.baseRotation, 0, assemble) + (hoveredIndex === index ? 0.22 : 0) + exit * direction * 0.22;
      letter.group.rotation.y += (targetRotY - letter.group.rotation.y) * 0.1;
      letter.group.rotation.z += ((draggedIndex === index ? pointer.x * 0.08 : 0) - letter.group.rotation.z) * 0.1;
      letter.mesh.material.opacity = worldFade;
      letter.hitTarget.visible = progress < 0.36;
    });

    limeRing.position.x = isMobileViewport ? -4.35 : -6.2;
    blocks[0].position.x = isMobileViewport ? -3.8 : -5.8;
    blocks[1].position.x = isMobileViewport ? 3.8 : 5.7;

    [limeRing, coralRing, ...blocks].forEach((object, index) => {
      object.position.y = 0.15 + Math.sin(elapsed * 0.8 + index) * 0.05 * motion;
      object.rotation.y += 0.0018 * motion;
      object.traverse((child) => {
        if (child instanceof THREE.Mesh && 'opacity' in child.material) {
          (child.material as THREE.Material & { opacity: number }).opacity = worldFade;
        }
      });
    });

    const aboutTravel = smoothstep(0.27, 0.38, progress);
    const laterTravel = smoothstep(0.42, 0.92, progress);
    const startX = isMobileViewport ? 3.1 : 5.4;
    const aboutTargetX = isMobileViewport ? 2.2 : 6.5;
    const endX = isMobileViewport ? -2.0 : -3.6;
    const aboutTargetZ = isMobileViewport ? -6.55 : -7.2;
    const endZ = isMobileViewport ? 0.4 : 1.6;
    const aboutX = THREE.MathUtils.lerp(startX, aboutTargetX, aboutTravel);
    const aboutZ = THREE.MathUtils.lerp(-7.8, aboutTargetZ, aboutTravel);
    mascot.position.x = THREE.MathUtils.lerp(aboutX, endX, laterTravel);
    mascot.position.z = THREE.MathUtils.lerp(aboutZ, endZ, laterTravel);
    mascot.position.y = 0.28 + Math.sin(elapsed * 0.8) * 0.06 * motion + (now < mascotPulseUntil ? Math.sin((mascotPulseUntil - now) * 0.03) * 0.18 : 0);
    mascot.rotation.y = -0.35 + laterTravel * 0.5;
    const mascotBaseScale = isMobileViewport ? 0.88 : 1;
    mascot.scale.setScalar(mascotBaseScale * (1 + smoothstep(0.30, 0.42, progress) * 0.42));

    cloudlessCamera(progress, camera, cameraParallax, motion);

    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];
      const age = (now - ripple.bornAt) / 1200;
      if (age >= 1) {
        scene.remove(ripple.mesh);
        ripple.mesh.material.dispose();
        ripples.splice(i, 1);
        continue;
      }
      ripple.mesh.scale.setScalar(1 + age * 7);
      ripple.mesh.material.opacity = (1 - age) * 0.72;
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(renderFrame);
  }

  function cloudlessCamera(
    progress: number,
    targetCamera: THREE.PerspectiveCamera,
    parallax: THREE.Vector2,
    motion: number,
  ) {
    const introMove = smoothstep(0, 0.28, progress);
    const contentMove = smoothstep(0.3, 1, progress);
    const desiredX = THREE.MathUtils.lerp(0, -1.3, contentMove) + parallax.x * 0.35 * motion * (1 - contentMove);
    const desiredY = THREE.MathUtils.lerp(10.8, 7.2, introMove) + contentMove * 1.1;
    const desiredZ = THREE.MathUtils.lerp(11.5, 7.6, introMove) + contentMove * 2.8;
    targetCamera.position.x += (desiredX - targetCamera.position.x) * 0.045;
    targetCamera.position.y += (desiredY - targetCamera.position.y) * 0.045;
    targetCamera.position.z += (desiredZ - targetCamera.position.z) * 0.045;
    const lookAt = new THREE.Vector3(
      THREE.MathUtils.lerp(0, -1.7, contentMove),
      THREE.MathUtils.lerp(0, 0.2, contentMove),
      THREE.MathUtils.lerp(-2.4, 0.8, contentMove),
    );
    targetCamera.lookAt(lookAt);
  }

  renderFrame();

  cleanupScene = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', resize);
    motionQuery.removeEventListener('change', onMotionChange);
    targetCanvas.removeEventListener('pointermove', onPointerMove);
    targetCanvas.removeEventListener('pointerdown', onPointerDown);
    targetCanvas.removeEventListener('pointerup', onPointerUp);
    targetCanvas.removeEventListener('pointerleave', onPointerLeave);
    sceneActions.pulseLetter = null;
    sceneActions.pulseMascot = null;
    ripples.forEach((ripple) => {
      scene.remove(ripple.mesh);
      ripple.mesh.material.dispose();
    });
    tileTexture.dispose();
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    renderer.dispose();
  };
});

onBeforeUnmount(() => {
  cleanupScene?.();
  cleanupScene = null;
});
</script>

<style scoped>
.ff-page {
  --pool: #83d6e8;
  --pool-deep: #2e9fc8;
  --ink: #0c455e;
  --ink-soft: #35697d;
  --cream: #fff9e8;
  --coral: #f59aa6;
  position: relative;
  min-height: 600svh;
  background: var(--pool);
  color: var(--ink);
  font-family: 'Switzer', system-ui, -apple-system, sans-serif;
}

.ff-stage {
  position: sticky;
  top: 0;
  min-height: 100svh;
  overflow: hidden;
  background: linear-gradient(180deg, #b8edf5 0%, var(--pool) 100%);
}

.ff-canvas,
.ff-pool-pattern {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.ff-canvas {
  z-index: 2;
  display: block;
  outline: none;
  touch-action: none;
}

.ff-canvas:focus-visible {
  outline: 3px solid #fff;
  outline-offset: -5px;
}

.ff-pool-pattern {
  z-index: 1;
  background-color: #78bfe2;
  background-image:
    conic-gradient(from 90deg at 50% 50%, #fff8e7 0 25%, #3a8fc8 0 50%, #8bc8e8 0 75%, #50abd3 0),
    linear-gradient(rgba(255, 255, 255, 0.42) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.42) 1px, transparent 1px);
  background-size: 10rem 10rem, 5rem 5rem, 5rem 5rem;
  transition: opacity 180ms linear;
}

.ff-header {
  position: absolute;
  z-index: 7;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.05rem clamp(1rem, 3vw, 2.75rem);
  pointer-events: none;
}

.ff-brand {
  display: flex;
  align-items: baseline;
  gap: 0.55rem;
  color: rgba(255, 255, 255, 0.96);
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.26em;
  text-shadow: 0 2px 12px rgba(12, 69, 94, 0.42), 0 1px 0 rgba(12, 69, 94, 0.18);
}

.ff-brand small {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  opacity: 0.75;
}

.ff-brand-dot {
  width: 0.5rem;
  height: 0.5rem;
  border: 2px solid rgba(255, 255, 255, 0.85);
  border-radius: 50%;
}

.ff-skip {
  display: inline-flex;
  align-items: center;
  min-height: 2.65rem;
  gap: 0.55rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 999px;
  padding: 0.45rem 1rem;
  background: rgba(64, 157, 192, 0.32);
  color: #fff;
  font: inherit;
  font-size: 0.74rem;
  font-weight: 700;
  backdrop-filter: blur(10px);
  cursor: pointer;
  pointer-events: auto;
}

.ff-skip:hover,
.ff-skip:focus-visible { background: rgba(64, 157, 192, 0.55); outline: 3px solid rgba(255, 255, 255, 0.7); }

.ff-nav {
  position: absolute;
  z-index: 8;
  top: 1rem;
  left: 50%;
  display: flex;
  width: min(38rem, calc(100vw - 12rem));
  min-height: 3.45rem;
  align-items: center;
  justify-content: space-around;
  gap: 0.25rem;
  border: 1px solid rgba(12, 69, 94, 0.1);
  border-radius: 999px;
  padding: 0.35rem;
  background: rgba(255, 249, 232, 0.91);
  box-shadow: 0 1rem 3rem rgba(12, 69, 94, 0.14);
  opacity: 0;
  transform: translate(-50%, -1rem);
  backdrop-filter: blur(15px);
  pointer-events: none;
  transition: opacity 260ms ease, transform 260ms ease;
}

.ff-nav-visible {
  opacity: 1;
  transform: translate(-50%, 0);
  pointer-events: auto;
}

.ff-nav button {
  display: inline-flex;
  min-height: 2.65rem;
  align-items: center;
  gap: 0.4rem;
  border: 0;
  border-radius: 999px;
  padding: 0.55rem 1rem;
  background: transparent;
  color: var(--ink-soft);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.ff-nav button:hover,
.ff-nav button:focus-visible,
.ff-nav-active { background: var(--ink); color: #fff !important; outline: none; }

.ff-nav-active {
  background: #0c455e !important;
  color: #fff !important;
  box-shadow: 0 0.35rem 1rem rgba(12, 69, 94, 0.24);
}

.ff-hero {
  position: absolute;
  z-index: 5;
  top: clamp(6rem, 13vh, 8rem);
  left: 50%;
  text-align: center;
  transform: translateX(-50%);
  transition: opacity 120ms linear;
  pointer-events: none;
}

.ff-hero-kicker {
  margin: 0 0 0.7rem;
  color: rgba(255, 255, 255, 0.94);
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.21em;
}

.ff-hero h1 {
  margin: 0;
  color: rgba(255, 255, 255, 0.98);
  font-size: clamp(2rem, 4vw, 3.45rem);
  font-weight: 900;
  letter-spacing: 0.25em;
  line-height: 1;
  text-indent: 0.25em;
  text-shadow: 0 3px 22px rgba(12, 69, 94, 0.42), 0 1px 0 rgba(12, 69, 94, 0.2);
}

.ff-hero > p:last-child {
  margin: 0.5rem 0 0;
  color: rgba(255, 255, 255, 0.94);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
}

.ff-letter-controls {
  position: absolute;
  z-index: 7;
  right: clamp(1rem, 2.5vw, 2.2rem);
  top: 50%;
  display: grid;
  gap: 0.35rem;
  transform: translateY(-50%);
  pointer-events: auto;
}

.ff-letter-controls button {
  display: grid;
  place-items: center;
  width: 2.35rem;
  height: 2.35rem;
  border: 1px solid rgba(255, 255, 255, 0.46);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
  font: inherit;
  font-size: 0.72rem;
  font-weight: 900;
  cursor: pointer;
  backdrop-filter: blur(8px);
}

.ff-letter-controls button:hover,
.ff-letter-controls button:focus-visible { background: #fff; color: var(--ink); outline: 3px solid rgba(255, 255, 255, 0.5); }

.ff-scroll-cue {
  position: absolute;
  z-index: 5;
  left: 50%;
  bottom: 1.15rem;
  display: grid;
  gap: 0.2rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.94);
  font-size: 0.56rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-align: center;
  text-transform: uppercase;
  transform: translateX(-50%);
  pointer-events: none;
  text-shadow: 0 2px 10px rgba(12, 69, 94, 0.42);
}

.ff-scroll-cue span { font-size: 1rem; }

.ff-content-panel {
  position: absolute;
  z-index: 6;
  right: clamp(1rem, 5vw, 5.5rem);
  top: 50%;
  width: min(42rem, calc(100vw - 2rem));
  max-height: calc(100svh - 8.6rem);
  overflow: auto;
  border: 1px solid rgba(12, 69, 94, 0.12);
  border-radius: 0.2rem;
  padding: clamp(1.7rem, 3.6vw, 3.6rem);
  background: rgba(255, 249, 232, 0.94);
  box-shadow: 0 1.6rem 5rem rgba(12, 69, 94, 0.16);
  visibility: hidden;
  transform: translateY(-50%);
  backdrop-filter: blur(14px);
}

.ff-panel-active { visibility: visible; }

.ff-section-index {
  margin: 0 0 1.45rem;
  color: #1681ac;
  font-size: 0.74rem;
  font-weight: 900;
  letter-spacing: 0.3em;
}

.ff-content-panel h2 {
  margin: 0;
  color: var(--ink);
  font-size: clamp(2.3rem, 5.2vw, 4.8rem);
  font-weight: 650;
  letter-spacing: -0.055em;
  line-height: 0.96;
}

.ff-content-panel h2 em {
  color: #2591bb;
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 500;
}

.ff-content-panel > p:not(.ff-section-index) {
  max-width: 34rem;
  margin: 1.8rem 0 0;
  color: var(--ink-soft);
  font-size: 1rem;
  line-height: 1.78;
}

.ff-about-panel dl {
  display: grid;
  gap: 0.7rem;
  margin: 1.7rem 0 0;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(12, 69, 94, 0.11);
}

.ff-about-panel dl > div { display: grid; grid-template-columns: 7rem 1fr; gap: 1rem; }
.ff-about-panel dt { color: #1681ac; font-size: 0.68rem; font-weight: 900; letter-spacing: 0.12em; text-transform: uppercase; }
.ff-about-panel dd { margin: 0; color: var(--ink-soft); font-size: 0.83rem; }

.ff-project-grid {
  display: grid;
  gap: 0.65rem;
  margin-top: 1.7rem;
}

.ff-project-grid button {
  display: grid;
  grid-template-columns: 2rem 1fr auto auto;
  align-items: center;
  gap: 0.8rem;
  min-height: 3.8rem;
  border: 0;
  border-top: 1px solid rgba(12, 69, 94, 0.14);
  padding: 0.65rem 0;
  background: transparent;
  color: var(--ink);
  text-align: left;
  cursor: pointer;
}

.ff-project-grid button:hover,
.ff-project-grid button:focus-visible { color: #1681ac; outline: none; }
.ff-project-grid button > span { color: #1681ac; font-size: 0.65rem; font-weight: 900; }
.ff-project-grid strong { font-size: 1rem; }
.ff-project-grid small { color: var(--ink-soft); font-size: 0.68rem; }
.ff-project-grid i { font-style: normal; }

.ff-skill-list { display: grid; gap: 1.15rem; margin-top: 1.8rem; }
.ff-skill-list > div { display: grid; grid-template-columns: 8rem 1fr 9rem; gap: 0.9rem; align-items: center; }
.ff-skill-list span { font-size: 0.78rem; font-weight: 800; }
.ff-skill-list > div > div { height: 0.4rem; border-radius: 999px; background: rgba(12, 69, 94, 0.1); overflow: hidden; }
.ff-skill-list i { display: block; height: 100%; border-radius: inherit; background: #2a9fc7; }
.ff-skill-list small { color: var(--ink-soft); font-size: 0.68rem; }

.ff-contact-panel > button {
  display: inline-flex;
  align-items: center;
  min-height: 3.15rem;
  gap: 0.65rem;
  margin-top: 1.6rem;
  border: 0;
  border-radius: 999px;
  padding: 0.7rem 1.3rem;
  background: var(--ink);
  color: #fff;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
}

.ff-contact-panel > button:hover,
.ff-contact-panel > button:focus-visible { background: #1681ac; outline: 3px solid rgba(22, 129, 172, 0.32); }

.ff-progress {
  position: absolute;
  z-index: 9;
  right: 0.55rem;
  top: 25%;
  width: 2px;
  height: 50%;
  background: rgba(255, 255, 255, 0.28);
  pointer-events: none;
}

.ff-progress span { display: block; width: 100%; background: #fff; transition: height 80ms linear; }

.ff-corner-note {
  position: absolute;
  z-index: 7;
  left: 1rem;
  bottom: 0.9rem;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.54rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  pointer-events: none;
}

.ff-webgl-fallback .ff-canvas { display: none; }
.ff-webgl-fallback .ff-stage { background: repeating-conic-gradient(#83d6e8 0 25%, #fdf7e4 0 50%) 0/10rem 10rem; }
.ff-reduced-motion { scroll-behavior: auto; }
.ff-reduced-motion * { transition-duration: 0s !important; animation-duration: 0s !important; }

@media (max-width: 900px) {
  .ff-page { min-height: 520svh; }
  .ff-header { padding: 0.8rem 0.75rem; }
  .ff-brand small { display: none; }
  .ff-skip { min-height: 2.35rem; padding-inline: 0.8rem; }
  .ff-hero { top: 5.3rem; }
  .ff-nav {
    top: 0.65rem;
    width: calc(100vw - 8rem);
    min-height: 2.9rem;
    padding: 0.25rem;
    overflow-x: auto;
    justify-content: flex-start;
    scrollbar-width: none;
  }
  .ff-nav::-webkit-scrollbar { display: none; }
  .ff-nav button { flex: 0 0 auto; min-height: 2.35rem; padding: 0.45rem 0.75rem; }
  .ff-letter-controls {
    left: 50%;
    right: auto;
    top: auto;
    bottom: 3.1rem;
    display: flex;
    gap: 0.3rem;
    transform: translateX(-50%);
  }
  .ff-letter-controls button { width: 2rem; height: 2rem; }
  .ff-content-panel {
    left: 0.75rem;
    right: 0.75rem;
    top: auto;
    bottom: 1.3rem;
    width: auto;
    max-height: calc(100svh - 5rem);
    padding: clamp(1.25rem, 5vw, 2rem);
    transform: none !important;
  }
  .ff-content-panel h2 { font-size: clamp(2.3rem, 11vw, 3.8rem); }
  .ff-project-grid button { grid-template-columns: 2rem 1fr auto; }
  .ff-project-grid small { display: none; }
  .ff-skill-list > div { grid-template-columns: 6.4rem 1fr; }
  .ff-skill-list small { display: none; }
  .ff-corner-note { display: none; }
}

@media (max-width: 560px) {
  .ff-hero h1 { font-size: 1.85rem; }
  .ff-hero-kicker { font-size: 0.5rem; }
  .ff-hero > p:last-child { font-size: 0.62rem; }
  .ff-nav { left: 0.6rem; transform: translateY(-1rem); width: calc(100vw - 7.8rem); }
  .ff-nav-visible { transform: translateY(0); }
  .ff-nav button span:first-child { display: none; }
  .ff-scroll-cue { bottom: 0.55rem; }
  .ff-progress { right: 0.2rem; }
}

@media (prefers-reduced-motion: reduce) {
  .ff-nav,
  .ff-progress span { transition: none; }
}
</style>
