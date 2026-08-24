<template>
  <div class="fc-page" :class="{ 'fc-reduced-motion': prefersReducedMotion }">
    <div ref="sceneHost" class="fc-scene" aria-hidden="true">
      <canvas ref="sceneCanvas" class="fc-scene-canvas" />
    </div>

    <div class="fc-sample-label">SAMPLE C - proof deck</div>

    <main ref="deck" class="fc-deck" aria-label="Production proof deck">
      <section class="fc-panel fc-hero-panel" aria-label="Identity and profile summary">
        <div class="fc-panel-shell">
          <div class="fc-panel-marker">
            <span>{{ formatIndex(0) }} / {{ totalLabel }}</span>
            <span class="fc-panel-marker-line" aria-hidden="true" />
            <span>Profile</span>
          </div>

          <div class="fc-hero-grid">
            <header class="fc-hero-copy">
              <p class="fc-eyebrow">{{ identity.location }} · {{ identity.timezone }}</p>
              <h1 class="fc-hero-title">
                <span class="fc-hero-name">{{ identity.name }}</span>
                <span class="fc-hero-role">{{ identity.role }}</span>
              </h1>
              <p class="fc-discipline">{{ identity.discipline }}</p>
              <p class="fc-summary">{{ identity.summary }}</p>
              <div class="fc-availability">
                <span class="fc-status-pulse" aria-hidden="true" />
                <span>{{ identity.availability }}</span>
              </div>
            </header>

            <aside class="fc-hero-stats" aria-label="Profile at a glance">
              <dl class="fc-stat-grid">
                <div v-for="stat in stats" :key="stat.label" class="fc-stat-card">
                  <dt>{{ stat.label }}</dt>
                  <dd>{{ stat.value }}</dd>
                  <span>{{ stat.note }}</span>
                </div>
              </dl>
              <p class="fc-deck-cue">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M14 7l5 5-5 5" />
                </svg>
                <span>Move through the production outcomes</span>
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section
        v-for="(proof, proofIndex) in proofs"
        :key="proof.title"
        class="fc-panel fc-proof-panel"
        :aria-label="`Production proof ${proofIndex + 1}: ${proof.title}`"
      >
        <div class="fc-panel-shell">
          <div class="fc-panel-marker">
            <span>{{ formatIndex(proofIndex + 1) }} / {{ totalLabel }}</span>
            <span class="fc-panel-marker-line" aria-hidden="true" />
            <span>Proof {{ formatIndex(proofIndex + 1) }}</span>
          </div>

          <div class="fc-proof-layout">
            <div class="fc-metric-stage" aria-hidden="true">
              <span class="fc-metric-ghost">{{ formatIndex(proofIndex + 1) }}</span>
              <strong
                class="fc-metric"
                :class="{ 'fc-metric-long': proof.metric.length > 4 }"
              >
                {{ proof.metric }}
              </strong>
            </div>

            <article class="fc-proof-copy">
              <p class="fc-proof-label">{{ proof.metricLabel }}</p>
              <h2>{{ proof.title }}</h2>
              <p class="fc-proof-detail">{{ proof.detail }}</p>
              <div class="fc-proof-rule" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="fc-panel fc-timeline-panel" aria-label="Career timeline and engineering principles">
        <div class="fc-panel-shell">
          <div class="fc-panel-marker">
            <span>{{ formatIndex(proofs.length + 1) }} / {{ totalLabel }}</span>
            <span class="fc-panel-marker-line" aria-hidden="true" />
            <span>Timeline</span>
          </div>

          <div class="fc-section-heading">
            <div>
              <p class="fc-eyebrow">Operating history</p>
              <h2>Career timeline</h2>
            </div>
            <p class="fc-section-note">{{ timeline[0]?.year }} — {{ timeline[timeline.length - 1]?.year }}</p>
          </div>

          <ol class="fc-timeline-list">
            <li v-for="entry in timeline" :key="`${entry.year}-${entry.role}`" class="fc-timeline-entry">
              <time>{{ entry.year }}</time>
              <h3>{{ entry.role }}</h3>
              <p>{{ entry.detail }}</p>
            </li>
          </ol>

          <div class="fc-principles-heading">
            <p class="fc-eyebrow">System rules</p>
            <span>Principles that keep financial operations recoverable</span>
          </div>
          <ul class="fc-principle-list">
            <li v-for="principle in principles" :key="principle.title" class="fc-principle-card">
              <span class="fc-principle-glyph" aria-hidden="true">◇</span>
              <div>
                <h3>{{ principle.title }}</h3>
                <p>{{ principle.detail }}</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section class="fc-panel fc-project-panel" aria-label="Selected projects">
        <div class="fc-panel-shell">
          <div class="fc-panel-marker">
            <span>{{ formatIndex(proofs.length + 2) }} / {{ totalLabel }}</span>
            <span class="fc-panel-marker-line" aria-hidden="true" />
            <span>Projects</span>
          </div>

          <div class="fc-section-heading">
            <div>
              <p class="fc-eyebrow">Selected systems</p>
              <h2>Projects in motion</h2>
            </div>
            <p class="fc-section-note">Scroll the row to inspect the build stack</p>
          </div>

          <ul class="fc-project-row" aria-label="Project cards">
            <li v-for="project in projects" :key="project.name" class="fc-project-card">
              <div class="fc-project-card-top">
                <span class="fc-project-glyph" aria-hidden="true">{{ project.glyph }}</span>
                <span class="fc-project-tag">{{ project.tag }}</span>
              </div>
              <h3>{{ project.name }}</h3>
              <p>{{ project.desc }}</p>
              <ul class="fc-chip-list" :aria-label="`${project.name} stack`">
                <li v-for="item in project.stack" :key="item">{{ item }}</li>
              </ul>
            </li>
          </ul>
        </div>
      </section>

      <section class="fc-panel fc-stack-panel" aria-label="Technology stack and contact links">
        <div class="fc-panel-shell">
          <div class="fc-panel-marker">
            <span>{{ formatIndex(proofs.length + 3) }} / {{ totalLabel }}</span>
            <span class="fc-panel-marker-line" aria-hidden="true" />
            <span>Stack + contact</span>
          </div>

          <div class="fc-section-heading">
            <div>
              <p class="fc-eyebrow">Working set</p>
              <h2>Stack &amp; contact</h2>
            </div>
            <p class="fc-section-note">{{ identity.discipline }}</p>
          </div>

          <div class="fc-stack-layout">
            <div class="fc-stack-groups" aria-label="Technology stack groups">
              <section v-for="group in stackGroups" :key="group.label" class="fc-stack-group" :aria-label="group.label">
                <h3>{{ group.label }}</h3>
                <ul class="fc-stack-items">
                  <li v-for="item in group.items" :key="item">{{ item }}</li>
                </ul>
              </section>
            </div>

            <footer class="fc-contact-card" aria-label="Contact">
              <span class="fc-contact-glyph" aria-hidden="true">↗</span>
              <p class="fc-eyebrow">Contact</p>
              <h2>{{ identity.availability }}</h2>
              <p>{{ identity.location }} · {{ identity.timezone }}</p>
              <nav class="fc-contact-links" aria-label="Contact links">
                <a class="fc-contact-link" :href="`mailto:${identity.email}`">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 6.5h18v11H3zM4 7l8 6 8-6" />
                  </svg>
                  <span>{{ identity.email }}</span>
                </a>
                <a class="fc-contact-link" :href="identity.github" target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="6" cy="6" r="2" />
                    <circle cx="18" cy="8" r="2" />
                    <circle cx="8" cy="18" r="2" />
                    <path d="M7.8 7.1l8.4.8M7 7.8l.8 8.3M17 9.8l-7.6 6.6" />
                  </svg>
                  <span>GitHub</span>
                </a>
                <a class="fc-contact-link" :href="identity.linkedin" target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <path d="M8 10v7M8 7.5v.1M12 17v-4a3 3 0 0 1 6 0v4M12 10v7" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </nav>
            </footer>
          </div>
        </div>
      </section>
    </main>

    <nav class="fc-navigation" aria-label="Proof deck navigation">
      <button
        type="button"
        class="fc-nav-button"
        :disabled="activeIndex === 0"
        aria-label="Go to previous panel"
        @click="navigateBy(-1)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 12H5M10 7l-5 5 5 5" />
        </svg>
        <span>Previous</span>
      </button>

      <ol class="fc-dot-rail" aria-label="Panel progress">
        <li v-for="(item, index) in navItems" :key="item.label">
          <button
            type="button"
            class="fc-dot"
            :class="{ 'fc-dot-active': activeIndex === index }"
            :aria-current="activeIndex === index ? 'step' : undefined"
            :aria-label="`Go to panel ${index + 1}: ${item.label}`"
            @click="scrollToPanel(index)"
          >
            <span class="fc-dot-mark" aria-hidden="true" />
            <span class="fc-dot-text">{{ item.short }}</span>
          </button>
        </li>
      </ol>

      <button
        type="button"
        class="fc-nav-button"
        :disabled="activeIndex === totalPanels - 1"
        aria-label="Go to next panel"
        @click="navigateBy(1)"
      >
        <span>Next</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M14 7l5 5-5 5" />
        </svg>
      </button>
    </nav>

    <div class="fc-mobile-counter" aria-hidden="true">
      <span>{{ formatIndex(activeIndex) }} / {{ totalLabel }}</span>
      <span class="fc-mobile-counter-line" />
      <span>{{ navItems[activeIndex]?.short }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import * as THREE from 'three';

const { identity, stats, proofs, principles, timeline, projects, stackGroups } = useProfile();

useHead({
  title: 'Sample C - proof deck',
  meta: [{ name: 'robots', content: 'noindex' }],
});

const navItems = [
  { short: 'Profile', label: 'Identity and profile summary' },
  ...proofs.map((proof, index) => ({
    short: `Proof ${String(index + 1).padStart(2, '0')}`,
    label: proof.title,
  })),
  { short: 'Timeline', label: 'Career timeline and engineering principles' },
  { short: 'Projects', label: 'Selected projects' },
  { short: 'Stack', label: 'Technology stack and contact' },
];

const totalPanels = navItems.length;
const totalLabel = String(totalPanels).padStart(2, '0');
const deck = ref<HTMLElement | null>(null);
const sceneHost = ref<HTMLElement | null>(null);
const sceneCanvas = ref<HTMLCanvasElement | null>(null);
const activeIndex = ref(0);
const prefersReducedMotion = ref(false);

let sceneScrollProgress = 0;
let cleanup: (() => void) | null = null;

const formatIndex = (index: number) => String(index + 1).padStart(2, '0');

const scrollToPanel = (requestedIndex: number) => {
  const deckElement = deck.value;
  if (!deckElement) return;

  const panels = Array.from(deckElement.querySelectorAll<HTMLElement>('.fc-panel'));
  const index = Math.min(Math.max(requestedIndex, 0), panels.length - 1);
  const panel = panels[index];
  if (!panel) return;

  activeIndex.value = index;
  deckElement.scrollTo({
    left: panel.offsetLeft,
    top: panel.offsetTop,
    behavior: prefersReducedMotion.value ? 'auto' : 'smooth',
  });
};

const navigateBy = (direction: number) => {
  scrollToPanel(activeIndex.value + direction);
};

onMounted(() => {
  const deckElement = deck.value;
  if (!deckElement) return;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopQuery = window.matchMedia('(min-width: 901px)');
  prefersReducedMotion.value = motionQuery.matches;

  let scrollRaf = 0;
  let disposeScene = () => {};
  let startSceneAnimation = () => {};
  let stopSceneAnimation = () => {};
  let renderScene = () => {};

  const syncDeckState = () => {
    const panels = Array.from(deckElement.querySelectorAll<HTMLElement>('.fc-panel'));
    if (!panels.length) return;

    const horizontal = desktopQuery.matches;
    const position = horizontal ? deckElement.scrollLeft : deckElement.scrollTop;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    panels.forEach((panel, index) => {
      const offset = horizontal ? panel.offsetLeft : panel.offsetTop;
      const distance = Math.abs(offset - position);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    activeIndex.value = nearestIndex;
    const maximum = horizontal
      ? deckElement.scrollWidth - deckElement.clientWidth
      : deckElement.scrollHeight - deckElement.clientHeight;
    sceneScrollProgress = maximum > 0 ? Math.min(Math.max(position / maximum, 0), 1) : 0;
  };

  const queueDeckSync = () => {
    if (scrollRaf) return;
    scrollRaf = window.requestAnimationFrame(() => {
      scrollRaf = 0;
      syncDeckState();
    });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navigateBy(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      navigateBy(1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      scrollToPanel(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      scrollToPanel(totalPanels - 1);
    }
  };

  const onWheel = (event: WheelEvent) => {
    if (!desktopQuery.matches || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    const target = event.target instanceof Element ? event.target : null;
    const projectScroller = target?.closest<HTMLElement>('.fc-project-row');
    if (projectScroller) {
      const maximum = projectScroller.scrollWidth - projectScroller.clientWidth;
      const canMoveBack = event.deltaY < 0 && projectScroller.scrollLeft > 0;
      const canMoveForward = event.deltaY > 0 && projectScroller.scrollLeft < maximum;
      if (canMoveBack || canMoveForward) {
        event.preventDefault();
        projectScroller.scrollLeft += event.deltaY;
        return;
      }
    }

    event.preventDefault();
    deckElement.scrollLeft += event.deltaY;
  };

  deckElement.addEventListener('scroll', queueDeckSync, { passive: true });
  deckElement.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', queueDeckSync);
  syncDeckState();

  const host = sceneHost.value;
  const canvas = sceneCanvas.value;
  if (host && canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const knotGeometry = new THREE.TorusKnotGeometry(1.45, 0.34, 112, 12, 2, 3);
    const knotMaterial = new THREE.MeshBasicMaterial({
      color: 0xe5233b,
      wireframe: true,
      transparent: true,
      opacity: 0.58,
    });
    const knot = new THREE.Mesh(knotGeometry, knotMaterial);

    const cageGeometry = new THREE.IcosahedronGeometry(2.45, 1);
    const cageMaterial = new THREE.MeshBasicMaterial({
      color: 0x8a0f1e,
      wireframe: true,
      transparent: true,
      opacity: 0.24,
    });
    const cage = new THREE.Mesh(cageGeometry, cageMaterial);

    const objectGroup = new THREE.Group();
    objectGroup.rotation.set(0.25, -0.35, 0.08);
    objectGroup.add(knot, cage);
    scene.add(objectGroup);

    const particleCount = 260;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      particlePositions[index * 3] = (Math.random() - 0.5) * 20;
      particlePositions[index * 3 + 1] = (Math.random() - 0.5) * 12;
      particlePositions[index * 3 + 2] = (Math.random() - 0.5) * 14 - 3;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff4d5e,
      size: 0.035,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.48,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    let sceneRaf = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let easedScrollProgress = sceneScrollProgress;

    const onPointerMove = (event: PointerEvent) => {
      if (prefersReducedMotion.value) return;
      targetPointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetPointerY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const onSceneResize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      const aspect = width / height;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      objectGroup.position.x = aspect > 1.2 ? 1.35 : 0;
      objectGroup.scale.setScalar(aspect > 1.2 ? 1 : 0.78);
      renderer.render(scene, camera);
    };

    const animate = (time: number) => {
      if (prefersReducedMotion.value) {
        sceneRaf = 0;
        return;
      }

      pointerX += (targetPointerX - pointerX) * 0.035;
      pointerY += (targetPointerY - pointerY) * 0.035;
      easedScrollProgress += (sceneScrollProgress - easedScrollProgress) * 0.045;

      objectGroup.rotation.y = time * 0.00008 + easedScrollProgress * Math.PI * 1.35 + pointerX * 0.12;
      objectGroup.rotation.x = 0.25 + Math.sin(time * 0.00016) * 0.055 - pointerY * 0.08;
      cage.rotation.z = -time * 0.000035 + easedScrollProgress * 0.65;
      knot.rotation.z = time * 0.000025 - easedScrollProgress * 0.35;
      particles.rotation.y = time * 0.000006 + easedScrollProgress * 0.24;
      particles.rotation.x = pointerY * 0.025;

      renderer.render(scene, camera);
      sceneRaf = window.requestAnimationFrame(animate);
    };

    startSceneAnimation = () => {
      if (!sceneRaf && !prefersReducedMotion.value) {
        sceneRaf = window.requestAnimationFrame(animate);
      }
    };

    stopSceneAnimation = () => {
      if (sceneRaf) {
        window.cancelAnimationFrame(sceneRaf);
        sceneRaf = 0;
      }
    };

    renderScene = () => renderer.render(scene, camera);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onSceneResize);
    onSceneResize();
    startSceneAnimation();

    disposeScene = () => {
      stopSceneAnimation();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onSceneResize);
      knotGeometry.dispose();
      knotMaterial.dispose();
      cageGeometry.dispose();
      cageMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }

  const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
    prefersReducedMotion.value = event.matches;
    if (event.matches) {
      stopSceneAnimation();
      renderScene();
    } else {
      startSceneAnimation();
    }
  };

  motionQuery.addEventListener('change', onMotionPreferenceChange);

  cleanup = () => {
    if (scrollRaf) window.cancelAnimationFrame(scrollRaf);
    deckElement.removeEventListener('scroll', queueDeckSync);
    deckElement.removeEventListener('wheel', onWheel);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('resize', queueDeckSync);
    motionQuery.removeEventListener('change', onMotionPreferenceChange);
    disposeScene();
  };
});

onBeforeUnmount(() => {
  cleanup?.();
  cleanup = null;
});
</script>

<style scoped>
.fc-page {
  --fc-bg: #0b0406;
  --fc-bg-raised: rgba(25, 8, 12, 0.78);
  --fc-line: rgba(255, 77, 94, 0.25);
  --fc-line-strong: rgba(255, 77, 94, 0.48);
  --fc-red: #e5233b;
  --fc-red-bright: #ff4d5e;
  --fc-red-deep: #8a0f1e;
  --fc-text: #f3e6e8;
  --fc-muted: #c7abb1;
  --fc-shadow: 0 28px 90px rgba(0, 0, 0, 0.42);
  position: relative;
  isolation: isolate;
  width: 100%;
  height: 100svh;
  overflow: hidden;
  background:
    radial-gradient(circle at 82% 42%, rgba(138, 15, 30, 0.2), transparent 34rem),
    linear-gradient(145deg, #0b0406 0%, #100508 52%, #080305 100%);
  color: var(--fc-text);
  color-scheme: dark;
  font-family: Inter, "Segoe UI", Helvetica, Arial, sans-serif;
}

.fc-page,
.fc-page * {
  box-sizing: border-box;
}

.fc-page::before {
  position: fixed;
  z-index: 0;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 77, 94, 0.032) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 77, 94, 0.032) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent);
  content: "";
  pointer-events: none;
}

.fc-scene {
  position: fixed;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.fc-scene::after {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(11, 4, 6, 0.72), rgba(11, 4, 6, 0.08) 55%, rgba(11, 4, 6, 0.42)),
    radial-gradient(circle at center, transparent 24%, rgba(11, 4, 6, 0.34) 78%);
  content: "";
}

.fc-scene-canvas {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0.34;
  filter: saturate(1.08);
}

.fc-sample-label {
  position: fixed;
  z-index: 5;
  top: max(1rem, env(safe-area-inset-top));
  right: clamp(1rem, 2.8vw, 2.75rem);
  border: 1px solid var(--fc-line);
  border-radius: 999px;
  padding: 0.55rem 0.8rem;
  background: rgba(11, 4, 6, 0.76);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.28);
  color: #f5d8dd;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 0.69rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  backdrop-filter: blur(14px);
}

.fc-deck {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  height: 100svh;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  overscroll-behavior-inline: contain;
}

.fc-deck::-webkit-scrollbar {
  display: none;
}

.fc-panel {
  position: relative;
  flex: 0 0 100%;
  width: 100%;
  min-width: 0;
  height: 100svh;
  overflow: hidden;
  padding: clamp(4.75rem, 7vh, 6.5rem) clamp(2rem, 6vw, 7rem) clamp(6.75rem, 11vh, 8rem);
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.fc-panel::after {
  position: absolute;
  right: 0;
  bottom: 13%;
  width: min(28vw, 30rem);
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--fc-line-strong));
  content: "";
  pointer-events: none;
}

.fc-panel-shell {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(100%, 82rem);
  height: 100%;
  min-width: 0;
  margin: 0 auto;
}

.fc-panel-marker {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  width: min(100%, 34rem);
  gap: 0.75rem;
  color: #dfc4c9;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.fc-panel-marker-line {
  width: clamp(2.5rem, 8vw, 7rem);
  height: 1px;
  background: linear-gradient(90deg, var(--fc-red-bright), rgba(255, 77, 94, 0.1));
}

.fc-eyebrow {
  margin: 0;
  color: #ff8792;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 0.73rem;
  font-weight: 700;
  letter-spacing: 0.13em;
  line-height: 1.5;
  text-transform: uppercase;
}

.fc-hero-grid {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(0, 1.25fr) minmax(18rem, 0.75fr);
  align-items: center;
  gap: clamp(2.5rem, 7vw, 8rem);
  min-height: 0;
}

.fc-hero-copy {
  max-width: 52rem;
}

.fc-hero-title {
  margin: 1rem 0 0;
  line-height: 0.95;
}

.fc-hero-name,
.fc-hero-role {
  display: block;
}

.fc-hero-name {
  max-width: 12ch;
  color: var(--fc-text);
  font-size: clamp(3.6rem, 7.2vw, 7.5rem);
  font-weight: 750;
  letter-spacing: -0.075em;
  text-wrap: balance;
}

.fc-hero-role {
  margin-top: 1.1rem;
  color: var(--fc-red-bright);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: clamp(0.9rem, 1.25vw, 1.2rem);
  font-weight: 650;
  letter-spacing: 0.04em;
}

.fc-discipline {
  max-width: 48rem;
  margin: 1.25rem 0 0;
  color: #e8cfd3;
  font-size: clamp(1rem, 1.5vw, 1.35rem);
  font-weight: 580;
  line-height: 1.45;
}

.fc-summary {
  max-width: 48rem;
  margin: 1.1rem 0 0;
  color: var(--fc-muted);
  font-size: clamp(0.93rem, 1.15vw, 1.06rem);
  line-height: 1.72;
}

.fc-availability {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  margin-top: 1.4rem;
  border: 1px solid rgba(255, 77, 94, 0.2);
  border-radius: 999px;
  padding: 0.55rem 0.8rem;
  background: rgba(11, 4, 6, 0.58);
  color: #ead3d7;
  font-size: 0.8rem;
  line-height: 1.35;
  backdrop-filter: blur(12px);
}

.fc-status-pulse {
  width: 0.48rem;
  height: 0.48rem;
  border-radius: 50%;
  background: var(--fc-red-bright);
  box-shadow: 0 0 0 5px rgba(255, 77, 94, 0.11), 0 0 18px rgba(255, 77, 94, 0.72);
}

.fc-hero-stats {
  min-width: 0;
}

.fc-stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0;
  border: 1px solid var(--fc-line);
  border-radius: 1.25rem;
  overflow: hidden;
  background: rgba(18, 6, 9, 0.66);
  box-shadow: var(--fc-shadow);
  backdrop-filter: blur(18px);
}

.fc-stat-card {
  min-width: 0;
  min-height: 8.9rem;
  padding: 1.25rem;
  border-right: 1px solid var(--fc-line);
  border-bottom: 1px solid var(--fc-line);
}

.fc-stat-card:nth-child(2n) {
  border-right: 0;
}

.fc-stat-card:nth-last-child(-n + 2) {
  border-bottom: 0;
}

.fc-stat-card dt {
  color: var(--fc-muted);
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  line-height: 1.35;
  text-transform: uppercase;
}

.fc-stat-card dd {
  margin: 0.5rem 0 0;
  color: var(--fc-text);
  font-size: clamp(2rem, 3.3vw, 3.5rem);
  font-weight: 750;
  letter-spacing: -0.06em;
  line-height: 1;
}

.fc-stat-card span {
  display: block;
  margin-top: 0.45rem;
  color: #caadb3;
  font-size: 0.75rem;
}

.fc-deck-cue {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin: 1rem 0 0;
  color: #d5b9be;
  font-size: 0.8rem;
}

.fc-deck-cue svg,
.fc-nav-button svg,
.fc-contact-link svg {
  width: 1.15rem;
  height: 1.15rem;
  flex: 0 0 auto;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.fc-proof-layout {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(0, 1.18fr) minmax(22rem, 0.82fr);
  align-items: center;
  gap: clamp(2rem, 7vw, 8rem);
  min-height: 0;
}

.fc-metric-stage {
  position: relative;
  display: grid;
  min-width: 0;
  min-height: 18rem;
  place-items: center start;
}

.fc-metric-ghost {
  position: absolute;
  top: 50%;
  left: clamp(-1rem, -2vw, -2.5rem);
  color: rgba(255, 77, 94, 0.08);
  font-size: clamp(16rem, 34vw, 36rem);
  font-weight: 800;
  letter-spacing: -0.1em;
  line-height: 0.7;
  transform: translateY(-50%);
}

.fc-metric {
  position: relative;
  z-index: 1;
  max-width: 100%;
  background: linear-gradient(135deg, #fff1f3 5%, #ff6978 46%, #9f1325 100%);
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 20px 55px rgba(138, 15, 30, 0.32));
  font-size: clamp(9rem, 18vw, 18rem);
  font-weight: 800;
  letter-spacing: -0.09em;
  line-height: 0.74;
  white-space: nowrap;
}

.fc-metric-long {
  font-size: clamp(6rem, 10.5vw, 11rem);
  letter-spacing: -0.085em;
}

.fc-proof-copy {
  position: relative;
  max-width: 32rem;
  border-left: 1px solid var(--fc-line-strong);
  padding: clamp(1.35rem, 3vw, 2.5rem) 0 clamp(1.35rem, 3vw, 2.5rem) clamp(1.5rem, 3vw, 3rem);
}

.fc-proof-label {
  margin: 0;
  color: #ff8792;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: clamp(0.78rem, 1.1vw, 0.95rem);
  font-weight: 700;
  letter-spacing: 0.09em;
  line-height: 1.45;
  text-transform: uppercase;
}

.fc-proof-copy h2 {
  margin: 1rem 0 0;
  color: var(--fc-text);
  font-size: clamp(2.1rem, 4vw, 4.7rem);
  font-weight: 720;
  letter-spacing: -0.055em;
  line-height: 1.02;
  text-wrap: balance;
}

.fc-proof-detail {
  max-width: 42rem;
  margin: 1.35rem 0 0;
  color: var(--fc-muted);
  font-size: clamp(0.98rem, 1.3vw, 1.16rem);
  line-height: 1.72;
}

.fc-proof-rule {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 1.75rem;
}

.fc-proof-rule span {
  display: block;
  height: 0.25rem;
  border-radius: 999px;
  background: var(--fc-red-bright);
}

.fc-proof-rule span:first-child {
  width: 3.5rem;
}

.fc-proof-rule span:nth-child(2) {
  width: 1.1rem;
  opacity: 0.55;
}

.fc-proof-rule span:last-child {
  width: 0.35rem;
  opacity: 0.3;
}

.fc-section-heading {
  display: flex;
  flex: 0 0 auto;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
  margin-top: clamp(1.5rem, 3vh, 2.5rem);
}

.fc-section-heading h2 {
  margin: 0.45rem 0 0;
  color: var(--fc-text);
  font-size: clamp(2.5rem, 5vw, 5.5rem);
  font-weight: 750;
  letter-spacing: -0.065em;
  line-height: 0.95;
}

.fc-section-note {
  max-width: 28rem;
  margin: 0;
  color: #d5b9be;
  font-size: 0.83rem;
  line-height: 1.55;
  text-align: right;
}

.fc-timeline-list {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin: clamp(1.5rem, 3vh, 2.25rem) 0 0;
  padding: 0;
  border: 1px solid var(--fc-line);
  border-radius: 1.1rem;
  overflow: hidden;
  background: rgba(21, 7, 10, 0.62);
  box-shadow: var(--fc-shadow);
  list-style: none;
  backdrop-filter: blur(16px);
}

.fc-timeline-entry {
  position: relative;
  min-width: 0;
  padding: clamp(1rem, 1.7vw, 1.5rem);
  border-right: 1px solid var(--fc-line);
}

.fc-timeline-entry:last-child {
  border-right: 0;
}

.fc-timeline-entry::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 38%;
  height: 2px;
  background: var(--fc-red-bright);
  content: "";
}

.fc-timeline-entry time {
  color: #ff7b88;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 0.78rem;
  font-weight: 750;
  letter-spacing: 0.09em;
}

.fc-timeline-entry h3 {
  margin: 0.75rem 0 0;
  color: #f5e8ea;
  font-size: clamp(0.9rem, 1.25vw, 1.08rem);
  line-height: 1.25;
}

.fc-timeline-entry p {
  margin: 0.65rem 0 0;
  color: var(--fc-muted);
  font-size: clamp(0.74rem, 0.95vw, 0.84rem);
  line-height: 1.55;
}

.fc-principles-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: clamp(1.4rem, 2.6vh, 2rem);
}

.fc-principles-heading > span {
  color: #cdb0b6;
  font-size: 0.76rem;
}

.fc-principle-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
  margin: 0.8rem 0 0;
  padding: 0;
  list-style: none;
}

.fc-principle-card {
  display: flex;
  min-width: 0;
  gap: 0.75rem;
  border: 1px solid rgba(255, 77, 94, 0.16);
  border-radius: 0.85rem;
  padding: 0.85rem;
  background: rgba(14, 5, 7, 0.62);
}

.fc-principle-glyph {
  flex: 0 0 auto;
  color: var(--fc-red-bright);
  font-size: 0.9rem;
}

.fc-principle-card h3 {
  margin: 0;
  color: #f0dde0;
  font-size: 0.77rem;
  line-height: 1.35;
}

.fc-principle-card p {
  margin: 0.35rem 0 0;
  color: #bea1a7;
  font-size: 0.7rem;
  line-height: 1.45;
}

.fc-project-row {
  display: flex;
  flex: 1;
  align-items: stretch;
  gap: 1rem;
  min-width: 0;
  min-height: 0;
  margin: clamp(1.75rem, 4vh, 3rem) 0 0;
  padding: 0 0 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x proximity;
  scrollbar-color: var(--fc-red-deep) rgba(255, 255, 255, 0.04);
  scrollbar-width: thin;
  overscroll-behavior-inline: contain;
  list-style: none;
}

.fc-project-card {
  position: relative;
  display: flex;
  flex: 0 0 clamp(17rem, 25vw, 22rem);
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--fc-line);
  border-radius: 1.25rem;
  padding: clamp(1.25rem, 2vw, 1.75rem);
  overflow: hidden;
  background:
    linear-gradient(145deg, rgba(36, 11, 16, 0.84), rgba(13, 5, 7, 0.8)),
    rgba(18, 6, 9, 0.74);
  box-shadow: var(--fc-shadow);
  scroll-snap-align: start;
  backdrop-filter: blur(17px);
}

.fc-project-card::after {
  position: absolute;
  right: -4rem;
  bottom: -5rem;
  width: 11rem;
  height: 11rem;
  border: 1px solid rgba(255, 77, 94, 0.14);
  border-radius: 50%;
  box-shadow: 0 0 0 1.7rem rgba(255, 77, 94, 0.025), 0 0 0 3.4rem rgba(255, 77, 94, 0.018);
  content: "";
  pointer-events: none;
}

.fc-project-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.fc-project-glyph {
  display: grid;
  width: 3rem;
  height: 3rem;
  border: 1px solid rgba(255, 77, 94, 0.38);
  border-radius: 0.8rem;
  background: rgba(138, 15, 30, 0.2);
  color: #ff8792;
  font-size: 1.35rem;
  place-items: center;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 10px 28px rgba(138, 15, 30, 0.18);
}

.fc-project-tag {
  border: 1px solid rgba(255, 77, 94, 0.22);
  border-radius: 999px;
  padding: 0.4rem 0.62rem;
  color: #e4c4c9;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 0.65rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.fc-project-card h3 {
  position: relative;
  z-index: 1;
  margin: clamp(1.5rem, 3vh, 2.4rem) 0 0;
  color: var(--fc-text);
  font-size: clamp(1.45rem, 2.2vw, 2rem);
  letter-spacing: -0.04em;
  line-height: 1.05;
  overflow-wrap: anywhere;
}

.fc-project-card > p {
  position: relative;
  z-index: 1;
  margin: 1rem 0 0;
  color: var(--fc-muted);
  font-size: 0.88rem;
  line-height: 1.65;
}

.fc-chip-list,
.fc-stack-items {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin: auto 0 0;
  padding: 1.5rem 0 0;
  list-style: none;
}

.fc-chip-list li,
.fc-stack-items li {
  border: 1px solid rgba(255, 77, 94, 0.17);
  border-radius: 999px;
  padding: 0.35rem 0.55rem;
  background: rgba(10, 3, 5, 0.52);
  color: #ddc2c7;
  font-size: 0.69rem;
  line-height: 1.2;
}

.fc-stack-layout {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(0, 1.55fr) minmax(18rem, 0.45fr);
  align-items: stretch;
  gap: clamp(1.25rem, 3vw, 2.5rem);
  min-height: 0;
  margin-top: clamp(1.5rem, 3vh, 2.5rem);
}

.fc-stack-groups {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
  min-width: 0;
  min-height: 0;
}

.fc-stack-group {
  min-width: 0;
  border: 1px solid rgba(255, 77, 94, 0.17);
  border-radius: 0.85rem;
  padding: 0.85rem 0.95rem;
  background: rgba(18, 6, 9, 0.63);
  backdrop-filter: blur(14px);
}

.fc-stack-group h3 {
  margin: 0;
  color: #ff8792;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 0.69rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.fc-stack-items {
  margin-top: 0.7rem;
  padding: 0;
}

.fc-contact-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--fc-line-strong);
  border-radius: 1.15rem;
  padding: clamp(1.25rem, 2.4vw, 2rem);
  overflow: hidden;
  background:
    radial-gradient(circle at 100% 0, rgba(229, 35, 59, 0.22), transparent 48%),
    rgba(22, 7, 10, 0.8);
  box-shadow: var(--fc-shadow);
  backdrop-filter: blur(18px);
}

.fc-contact-glyph {
  position: absolute;
  top: 1.25rem;
  right: 1.4rem;
  color: rgba(255, 77, 94, 0.52);
  font-size: 2rem;
}

.fc-contact-card h2 {
  max-width: 17ch;
  margin: 1.2rem 0 0;
  color: var(--fc-text);
  font-size: clamp(1.45rem, 2.3vw, 2.2rem);
  letter-spacing: -0.045em;
  line-height: 1.15;
}

.fc-contact-card > p:not(.fc-eyebrow) {
  margin: 0.85rem 0 0;
  color: var(--fc-muted);
  font-size: 0.82rem;
  line-height: 1.55;
}

.fc-contact-links {
  display: grid;
  gap: 0.65rem;
  margin-top: auto;
  padding-top: 1.5rem;
}

.fc-contact-link {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 2.8rem;
  gap: 0.7rem;
  border: 1px solid rgba(255, 77, 94, 0.2);
  border-radius: 0.75rem;
  padding: 0.65rem 0.75rem;
  background: rgba(9, 3, 5, 0.58);
  color: #f0dfe2;
  font-size: 0.78rem;
  line-height: 1.25;
  text-decoration: none;
  transition: border-color 160ms ease, background-color 160ms ease, transform 160ms ease;
}

.fc-contact-link span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.fc-contact-link:hover {
  border-color: rgba(255, 77, 94, 0.55);
  background: rgba(138, 15, 30, 0.2);
  transform: translateY(-1px);
}

.fc-navigation {
  position: fixed;
  z-index: 6;
  bottom: max(1.2rem, env(safe-area-inset-bottom));
  left: 50%;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  max-width: calc(100vw - 2rem);
  border: 1px solid rgba(255, 77, 94, 0.25);
  border-radius: 999px;
  padding: 0.45rem;
  background: rgba(12, 4, 6, 0.82);
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transform: translateX(-50%);
  backdrop-filter: blur(20px);
}

.fc-nav-button {
  display: inline-flex;
  align-items: center;
  min-height: 2.55rem;
  gap: 0.45rem;
  border: 1px solid rgba(255, 77, 94, 0.18);
  border-radius: 999px;
  padding: 0.55rem 0.75rem;
  background: rgba(255, 255, 255, 0.035);
  color: #f0dadd;
  font: inherit;
  font-size: 0.71rem;
  font-weight: 680;
  cursor: pointer;
  transition: border-color 160ms ease, background-color 160ms ease, color 160ms ease;
}

.fc-nav-button:hover:not(:disabled) {
  border-color: rgba(255, 77, 94, 0.5);
  background: rgba(138, 15, 30, 0.24);
  color: #fff4f5;
}

.fc-nav-button:disabled {
  color: #81696e;
  cursor: not-allowed;
  opacity: 0.72;
}

.fc-dot-rail {
  display: flex;
  align-items: center;
  gap: 0.22rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.fc-dot-rail li {
  display: flex;
}

.fc-dot {
  display: inline-flex;
  align-items: center;
  min-width: 1.9rem;
  min-height: 2.55rem;
  gap: 0;
  border: 0;
  border-radius: 999px;
  padding: 0 0.68rem;
  background: transparent;
  color: #d5b8bd;
  font: inherit;
  cursor: pointer;
  transition: background-color 180ms ease, gap 180ms ease;
}

.fc-dot:hover,
.fc-dot-active {
  gap: 0.48rem;
  background: rgba(255, 77, 94, 0.1);
}

.fc-dot-mark {
  width: 0.42rem;
  height: 0.42rem;
  flex: 0 0 auto;
  border: 1px solid #ba7a84;
  border-radius: 50%;
  background: transparent;
  transition: background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.fc-dot-active .fc-dot-mark {
  border-color: var(--fc-red-bright);
  background: var(--fc-red-bright);
  box-shadow: 0 0 0 4px rgba(255, 77, 94, 0.12), 0 0 14px rgba(255, 77, 94, 0.62);
  transform: scale(1.08);
}

.fc-dot-text {
  width: 0;
  overflow: hidden;
  color: #f2dfe2;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  opacity: 0;
  white-space: nowrap;
  transition: width 180ms ease, opacity 150ms ease;
}

.fc-dot:hover .fc-dot-text,
.fc-dot:focus-visible .fc-dot-text,
.fc-dot-active .fc-dot-text {
  width: 4.8rem;
  opacity: 1;
}

.fc-nav-button:focus-visible,
.fc-dot:focus-visible,
.fc-contact-link:focus-visible {
  outline: 3px solid #ff8792;
  outline-offset: 3px;
}

.fc-mobile-counter {
  display: none;
}

@media (max-width: 1180px) and (min-width: 901px) {
  .fc-panel {
    padding-inline: 3rem;
  }

  .fc-hero-grid {
    grid-template-columns: minmax(0, 1.12fr) minmax(18rem, 0.88fr);
    gap: 3rem;
  }

  .fc-timeline-entry p,
  .fc-principle-card p {
    font-size: 0.68rem;
  }

  .fc-navigation {
    gap: 0.35rem;
  }

}

@media (max-width: 900px) {
  .fc-page::before {
    background-size: 48px 48px;
    opacity: 0.72;
  }

  .fc-scene-canvas {
    opacity: 0.2;
  }

  .fc-scene::after {
    background: linear-gradient(to bottom, rgba(11, 4, 6, 0.52), rgba(11, 4, 6, 0.22), rgba(11, 4, 6, 0.62));
  }

  .fc-sample-label {
    top: max(0.75rem, env(safe-area-inset-top));
    right: 0.8rem;
    max-width: calc(100vw - 1.6rem);
    padding: 0.48rem 0.65rem;
    font-size: 0.61rem;
  }

  .fc-deck {
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    overscroll-behavior-block: contain;
  }

  .fc-panel {
    flex: 0 0 auto;
    width: 100%;
    height: auto;
    min-height: 100svh;
    padding: 4.25rem 1.2rem 5.25rem;
  }

  .fc-panel::after {
    right: -20%;
    bottom: 7%;
    width: 70%;
  }

  .fc-panel-shell {
    height: auto;
    min-height: calc(100svh - 9.5rem);
  }

  .fc-panel-marker {
    gap: 0.55rem;
    font-size: 0.64rem;
  }

  .fc-panel-marker-line {
    width: 2.3rem;
  }

  .fc-hero-grid {
    flex: 1;
    grid-template-columns: minmax(0, 1fr);
    align-content: center;
    gap: 1.8rem;
    padding-block: 1.5rem 0.5rem;
  }

  .fc-hero-name {
    max-width: 10ch;
    font-size: clamp(3rem, 14vw, 4.2rem);
  }

  .fc-hero-role {
    margin-top: 0.85rem;
    font-size: 0.82rem;
  }

  .fc-discipline {
    margin-top: 1rem;
    font-size: 0.98rem;
  }

  .fc-summary {
    margin-top: 0.85rem;
    font-size: 0.86rem;
    line-height: 1.58;
  }

  .fc-availability {
    margin-top: 1rem;
    font-size: 0.72rem;
  }

  .fc-stat-card {
    min-height: 6.4rem;
    padding: 0.9rem;
  }

  .fc-stat-card dt {
    font-size: 0.64rem;
  }

  .fc-stat-card dd {
    font-size: clamp(1.65rem, 8vw, 2.25rem);
  }

  .fc-stat-card span {
    font-size: 0.66rem;
  }

  .fc-deck-cue {
    display: none;
  }

  .fc-proof-panel {
    height: 100svh;
    min-height: 100svh;
  }

  .fc-proof-panel .fc-panel-shell {
    height: 100%;
  }

  .fc-proof-layout {
    grid-template-columns: minmax(0, 1fr);
    align-content: center;
    gap: 1.6rem;
    padding-block: 1rem;
  }

  .fc-metric-stage {
    min-height: 10rem;
    place-items: end center;
  }

  .fc-metric-ghost {
    top: 55%;
    left: 50%;
    font-size: min(58vw, 16rem);
    transform: translate(-50%, -50%);
  }

  .fc-metric {
    font-size: clamp(7rem, 38vw, 10rem);
    line-height: 0.78;
  }

  .fc-metric-long {
    font-size: clamp(4.2rem, 20vw, 6.4rem);
  }

  .fc-proof-copy {
    max-width: none;
    border-top: 1px solid var(--fc-line-strong);
    border-left: 0;
    padding: 1.35rem 0 0;
    text-align: left;
  }

  .fc-proof-label {
    font-size: 0.7rem;
  }

  .fc-proof-copy h2 {
    margin-top: 0.7rem;
    font-size: clamp(1.8rem, 8.5vw, 2.5rem);
  }

  .fc-proof-detail {
    margin-top: 0.9rem;
    font-size: 0.9rem;
    line-height: 1.58;
  }

  .fc-proof-rule {
    margin-top: 1.2rem;
  }

  .fc-section-heading {
    display: block;
    margin-top: 1.6rem;
  }

  .fc-section-heading h2 {
    font-size: clamp(2.55rem, 12vw, 3.8rem);
  }

  .fc-section-note {
    margin-top: 0.75rem;
    font-size: 0.72rem;
    text-align: left;
  }

  .fc-timeline-list {
    grid-template-columns: minmax(0, 1fr);
    margin-top: 1.25rem;
  }

  .fc-timeline-entry {
    padding: 0.9rem 1rem 0.9rem 1.35rem;
    border-right: 0;
    border-bottom: 1px solid var(--fc-line);
  }

  .fc-timeline-entry:last-child {
    border-bottom: 0;
  }

  .fc-timeline-entry::before {
    width: 2px;
    height: 100%;
  }

  .fc-timeline-entry h3 {
    margin-top: 0.4rem;
    font-size: 0.9rem;
  }

  .fc-timeline-entry p {
    margin-top: 0.35rem;
    font-size: 0.74rem;
  }

  .fc-principles-heading {
    display: block;
    margin-top: 1.4rem;
  }

  .fc-principles-heading > span {
    display: block;
    margin-top: 0.35rem;
    font-size: 0.68rem;
  }

  .fc-principle-list {
    display: flex;
    gap: 0.7rem;
    margin-right: -1.2rem;
    padding-right: 1.2rem;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    scrollbar-width: thin;
  }

  .fc-principle-card {
    flex: 0 0 min(76vw, 18rem);
    scroll-snap-align: start;
  }

  .fc-principle-card h3 {
    font-size: 0.78rem;
  }

  .fc-principle-card p {
    font-size: 0.7rem;
  }

  .fc-project-row {
    flex: 0 0 auto;
    min-height: 25rem;
    margin-top: 1.5rem;
    margin-right: -1.2rem;
    padding-right: 1.2rem;
  }

  .fc-project-card {
    flex-basis: min(83vw, 20rem);
    min-height: 24rem;
  }

  .fc-stack-layout {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-top: 1.25rem;
  }

  .fc-stack-groups {
    display: flex;
    flex: 0 0 auto;
    gap: 0.7rem;
    margin-right: -1.2rem;
    padding-right: 1.2rem;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    scrollbar-width: thin;
  }

  .fc-stack-group {
    flex: 0 0 min(76vw, 17rem);
    min-height: 8.5rem;
    scroll-snap-align: start;
  }

  .fc-contact-card {
    flex: 1;
    min-height: 18rem;
  }

  .fc-navigation {
    display: none;
  }

  .fc-mobile-counter {
    position: fixed;
    z-index: 6;
    bottom: max(0.8rem, env(safe-area-inset-bottom));
    left: 50%;
    display: flex;
    align-items: center;
    max-width: calc(100vw - 2rem);
    gap: 0.55rem;
    border: 1px solid var(--fc-line);
    border-radius: 999px;
    padding: 0.55rem 0.78rem;
    overflow: hidden;
    background: rgba(12, 4, 6, 0.84);
    box-shadow: 0 12px 38px rgba(0, 0, 0, 0.38);
    color: #eed8dc;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    transform: translateX(-50%);
    white-space: nowrap;
    backdrop-filter: blur(18px);
  }

  .fc-mobile-counter-line {
    width: 1.8rem;
    height: 1px;
    background: var(--fc-red-bright);
  }
}

@media (max-width: 520px) {
  .fc-panel {
    padding-inline: 1rem;
  }

  .fc-hero-grid {
    gap: 1.25rem;
  }

  .fc-hero-name {
    font-size: clamp(2.75rem, 13.5vw, 3.6rem);
  }

  .fc-summary {
    font-size: 0.82rem;
  }

  .fc-stat-card {
    min-height: 5.9rem;
    padding: 0.78rem;
  }

  .fc-stat-card dd {
    margin-top: 0.35rem;
  }

  .fc-proof-detail {
    font-size: 0.84rem;
  }

  .fc-project-row,
  .fc-principle-list,
  .fc-stack-groups {
    margin-right: -1rem;
    padding-right: 1rem;
  }

  .fc-contact-card {
    padding: 1.15rem;
  }
}

@media (max-height: 760px) and (min-width: 901px) {
  .fc-panel {
    padding-top: 3.75rem;
    padding-bottom: 5.6rem;
  }

  .fc-hero-name {
    font-size: clamp(3.2rem, 6vw, 5.8rem);
  }

  .fc-summary {
    line-height: 1.55;
  }

  .fc-stat-card {
    min-height: 7rem;
    padding: 1rem;
  }

  .fc-section-heading {
    margin-top: 1.25rem;
  }

  .fc-section-heading h2 {
    font-size: clamp(2.3rem, 4.3vw, 4.2rem);
  }

  .fc-timeline-list {
    margin-top: 1.25rem;
  }

  .fc-timeline-entry {
    padding: 0.9rem;
  }

  .fc-principles-heading {
    margin-top: 1rem;
  }

  .fc-principle-card {
    padding: 0.65rem;
  }

  .fc-principle-card p {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fc-page *,
  .fc-page *::before,
  .fc-page *::after {
    scroll-behavior: auto !important;
    transition-duration: 0s !important;
  }

  .fc-scene-canvas {
    opacity: 0.2;
  }
}
</style>
