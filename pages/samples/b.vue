<template>
  <div class="fb-shell" :class="{ 'fb-reduced-motion': prefersReducedMotion }">
    <aside class="fb-rail" aria-label="Identity and dossier controls">
      <div class="fb-rail-grid">
        <header class="fb-identity">
          <div class="fb-kicker">
            <span class="fb-signal" aria-hidden="true"></span>
            <span>PROFILE / SYSTEMS</span>
          </div>
          <h1>{{ identity.name }}</h1>
          <p class="fb-role">{{ identity.role }}</p>
          <p class="fb-discipline">{{ identity.discipline }}</p>
          <div class="fb-location">
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
              </svg>
              {{ identity.location }}
            </span>
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M12 7v5l3.5 2" />
              </svg>
              {{ identity.timezone }}
            </span>
          </div>
        </header>

        <div ref="sceneHost" class="fb-scene" aria-hidden="true">
          <canvas ref="sceneCanvas"></canvas>
          <div class="fb-scene-caption">
            <span class="fb-scene-mark"></span>
            system topology
          </div>
        </div>

        <dl class="fb-rail-stats" aria-label="Career metrics">
          <div v-for="stat in stats" :key="stat.label" class="fb-stat">
            <dd>{{ stat.value }}</dd>
            <dt>{{ stat.label }}</dt>
            <span>{{ stat.note }}</span>
          </div>
        </dl>

        <nav class="fb-nav" aria-label="Dossier sections">
          <span class="fb-nav-label">INDEX</span>
          <div class="fb-nav-list">
            <a
              v-for="item in navItems"
              :key="item.id"
              class="fb-nav-link"
              :class="{ 'is-active': activeSection === item.id }"
              :href="`#fb-${item.id}`"
              :aria-current="activeSection === item.id ? 'location' : undefined"
              @click.prevent="scrollToSection(item.id)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path :d="item.icon" />
              </svg>
              <span>{{ item.label }}</span>
              <span class="fb-nav-code" aria-hidden="true">{{ item.code }}</span>
            </a>
          </div>
        </nav>

        <nav class="fb-contacts" aria-label="Contact links">
          <a
            v-for="contact in contacts"
            :key="contact.label"
            :href="contact.href"
            :target="contact.external ? '_blank' : undefined"
            :rel="contact.external ? 'noreferrer' : undefined"
            :aria-label="`Contact via ${contact.label}`"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path :d="contact.icon" />
            </svg>
            <span>{{ contact.label }}</span>
          </a>
        </nav>
      </div>
    </aside>

    <main class="fb-main" aria-label="Terminal dossier content">
      <div class="fb-content">
        <section id="fb-summary" class="fb-pane" data-section="summary" aria-label="Summary">
          <header class="fb-pane-head">
            <span class="fb-pane-index" aria-hidden="true">01</span>
            <div>
              <span class="fb-pane-type">IDENTITY RECORD</span>
              <h2>Summary</h2>
            </div>
          </header>

          <div class="fb-summary-layout">
            <p class="fb-summary-copy">{{ identity.summary }}</p>
            <dl class="fb-summary-readout">
              <div>
                <dt>Discipline</dt>
                <dd>{{ identity.discipline }}</dd>
              </div>
              <div>
                <dt>Base</dt>
                <dd>{{ identity.location }}</dd>
              </div>
              <div>
                <dt>Working window</dt>
                <dd>{{ identity.timezone }}</dd>
              </div>
              <div>
                <dt>Availability</dt>
                <dd>{{ identity.availability }}</dd>
              </div>
            </dl>
          </div>

          <dl class="fb-summary-stats" aria-label="Career metrics">
            <div v-for="stat in stats" :key="stat.label">
              <dd>{{ stat.value }}</dd>
              <dt>{{ stat.label }}</dt>
              <span>{{ stat.note }}</span>
            </div>
          </dl>
        </section>

        <section id="fb-proofs" class="fb-pane" data-section="proofs" aria-label="Production outcomes">
          <header class="fb-pane-head">
            <span class="fb-pane-index" aria-hidden="true">02</span>
            <div>
              <span class="fb-pane-type">PRODUCTION OUTCOMES</span>
              <h2>Proofs</h2>
            </div>
            <span class="fb-pane-count">{{ proofs.length }} records</span>
          </header>

          <div class="fb-proof-table">
            <div class="fb-table-head" aria-hidden="true">
              <span>Outcome</span>
              <span>Operating detail</span>
              <span>Evidence</span>
            </div>
            <article v-for="(proof, index) in proofs" :key="proof.title" class="fb-proof-row">
              <div class="fb-proof-title">
                <span aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
                <h3>{{ proof.title }}</h3>
              </div>
              <p>{{ proof.detail }}</p>
              <div class="fb-proof-metric">
                <strong>{{ proof.metric }}</strong>
                <span>{{ proof.metricLabel }}</span>
              </div>
            </article>
          </div>
        </section>

        <section id="fb-principles" class="fb-pane" data-section="principles" aria-label="Engineering principles">
          <header class="fb-pane-head">
            <span class="fb-pane-index" aria-hidden="true">03</span>
            <div>
              <span class="fb-pane-type">OPERATING RULES</span>
              <h2>Principles</h2>
            </div>
            <span class="fb-pane-count">{{ principles.length }} controls</span>
          </header>

          <ol class="fb-principles-grid">
            <li v-for="(principle, index) in principles" :key="principle.title">
              <span class="fb-row-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
              <div>
                <h3>{{ principle.title }}</h3>
                <p>{{ principle.detail }}</p>
              </div>
            </li>
          </ol>
        </section>

        <section id="fb-timeline" class="fb-pane" data-section="timeline" aria-label="Career timeline">
          <header class="fb-pane-head">
            <span class="fb-pane-index" aria-hidden="true">04</span>
            <div>
              <span class="fb-pane-type">CAREER LEDGER</span>
              <h2>Timeline</h2>
            </div>
            <span class="fb-pane-count">{{ timeline.length }} entries</span>
          </header>

          <ol class="fb-timeline-list">
            <li v-for="entry in timeline" :key="`${entry.year}-${entry.role}`">
              <time :datetime="entry.year">{{ entry.year }}</time>
              <h3>{{ entry.role }}</h3>
              <p>{{ entry.detail }}</p>
            </li>
          </ol>
        </section>

        <section id="fb-projects" class="fb-pane" data-section="projects" aria-label="Selected projects">
          <header class="fb-pane-head">
            <span class="fb-pane-index" aria-hidden="true">05</span>
            <div>
              <span class="fb-pane-type">BUILD REGISTER</span>
              <h2>Projects</h2>
            </div>
            <span class="fb-pane-count">{{ projects.length }} systems</span>
          </header>

          <div class="fb-project-list">
            <article v-for="project in projects" :key="project.name" class="fb-project-row">
              <span class="fb-project-glyph" aria-hidden="true">{{ project.glyph }}</span>
              <div class="fb-project-identity">
                <h3>{{ project.name }}</h3>
                <span class="fb-tag">{{ project.tag }}</span>
              </div>
              <p>{{ project.desc }}</p>
              <ul :aria-label="`${project.name} stack`" class="fb-project-stack">
                <li v-for="item in project.stack" :key="item">{{ item }}</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="fb-stack" class="fb-pane" data-section="stack" aria-label="Technology stack">
          <header class="fb-pane-head">
            <span class="fb-pane-index" aria-hidden="true">06</span>
            <div>
              <span class="fb-pane-type">CAPABILITY MATRIX</span>
              <h2>Stack</h2>
            </div>
            <span class="fb-pane-count">{{ stackGroups.length }} groups</span>
          </header>

          <dl class="fb-stack-list">
            <div v-for="group in stackGroups" :key="group.label" class="fb-stack-row">
              <dt>{{ group.label }}</dt>
              <dd>
                <span v-for="item in group.items" :key="item">{{ item }}</span>
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </main>

    <div class="fb-sample-label" aria-hidden="true">SAMPLE B - terminal dossier</div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import * as THREE from 'three';

const { identity, stats, proofs, principles, timeline, projects, stackGroups } = useProfile();

useHead({
  title: 'Sample B - terminal dossier',
  meta: [{ name: 'robots', content: 'noindex' }],
});

const navItems = [
  {
    id: 'summary',
    code: '01',
    label: 'Summary',
    icon: 'M4 4h16v16H4z M8 9h8 M8 13h8 M8 17h5',
  },
  {
    id: 'proofs',
    code: '02',
    label: 'Proofs',
    icon: 'M4 18l5-5 4 3 7-9 M15 7h5v5',
  },
  {
    id: 'principles',
    code: '03',
    label: 'Principles',
    icon: 'M12 3l7 3v5c0 4.5-2.8 7.8-7 10-4.2-2.2-7-5.5-7-10V6l7-3z M9 12l2 2 4-5',
  },
  {
    id: 'timeline',
    code: '04',
    label: 'Timeline',
    icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M12 7v5l3.5 2',
  },
  {
    id: 'projects',
    code: '05',
    label: 'Projects',
    icon: 'M4 5h16v14H4z M8 9l3 3-3 3 M13 15h3',
  },
  {
    id: 'stack',
    code: '06',
    label: 'Stack',
    icon: 'M12 3l9 5-9 5-9-5 9-5z M3 12l9 5 9-5 M3 16l9 5 9-5',
  },
] as const;

type SectionId = (typeof navItems)[number]['id'];

const contacts = [
  {
    label: 'Email',
    href: `mailto:${identity.email}`,
    external: false,
    icon: 'M3 6h18v12H3z M4 7l8 6 8-6',
  },
  {
    label: 'GitHub',
    href: identity.github,
    external: true,
    icon: 'M8 4v10a3 3 0 0 0 3 3h5 M8 8h6a2 2 0 0 0 2-2V4 M16 4l-2 2 2 2 M16 17l-2-2 2-2',
  },
  {
    label: 'LinkedIn',
    href: identity.linkedin,
    external: true,
    icon: 'M9.5 14.5l-1 1a4 4 0 0 1-5.5-5.5l2-2a4 4 0 0 1 5.5 0 M14.5 9.5l1-1A4 4 0 0 1 21 14l-2 2a4 4 0 0 1-5.5 0 M8.5 15.5l7-7',
  },
] as const;

const activeSection = ref<SectionId>('summary');
const prefersReducedMotion = ref(false);
const sceneHost = ref<HTMLElement | null>(null);
const sceneCanvas = ref<HTMLCanvasElement | null>(null);

let sectionObserver: IntersectionObserver | null = null;
let sceneCleanup: (() => void) | null = null;
let motionCleanup: (() => void) | null = null;
let refreshSceneMotion: (() => void) | null = null;

function scrollToSection(id: SectionId) {
  document.getElementById(`fb-${id}`)?.scrollIntoView({
    behavior: prefersReducedMotion.value ? 'auto' : 'smooth',
    block: 'start',
  });
}

onMounted(() => {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  prefersReducedMotion.value = motionQuery.matches;

  const onMotionChange = (event: MediaQueryListEvent) => {
    prefersReducedMotion.value = event.matches;
    refreshSceneMotion?.();
  };
  motionQuery.addEventListener('change', onMotionChange);
  motionCleanup = () => motionQuery.removeEventListener('change', onMotionChange);

  const intersecting = new Set<SectionId>();
  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = entry.target.getAttribute('data-section') as SectionId;
        if (entry.isIntersecting) intersecting.add(id);
        else intersecting.delete(id);
      }

      const anchor = window.innerHeight * 0.22;
      const nearest = navItems
        .filter((item) => intersecting.has(item.id))
        .map((item) => ({
          id: item.id,
          distance: Math.abs(
            (document.getElementById(`fb-${item.id}`)?.getBoundingClientRect().top ?? Infinity) - anchor,
          ),
        }))
        .sort((a, b) => a.distance - b.distance)[0];

      if (nearest) activeSection.value = nearest.id;
    },
    {
      rootMargin: '-10% 0px -15% 0px',
      threshold: [0, 0.15, 0.4, 0.75],
    },
  );

  document.querySelectorAll<HTMLElement>('.fb-pane').forEach((section) => sectionObserver?.observe(section));

  const host = sceneHost.value;
  const canvas = sceneCanvas.value;
  if (!host || !canvas || host.clientWidth === 0 || host.clientHeight === 0) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 20);
  camera.position.set(0, 0, 4.2);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const geometry = new THREE.IcosahedronGeometry(1.12, 1);
  const wireMaterial = new THREE.MeshStandardMaterial({
    color: 0xe5233b,
    emissive: 0x5c0715,
    emissiveIntensity: 0.75,
    metalness: 0.45,
    roughness: 0.35,
    wireframe: true,
    transparent: true,
    opacity: 0.88,
  });
  const innerMaterial = new THREE.MeshBasicMaterial({
    color: 0x8a0f1e,
    transparent: true,
    opacity: 0.12,
  });
  const core = new THREE.Mesh(geometry, wireMaterial);
  const inner = new THREE.Mesh(geometry, innerMaterial);
  inner.scale.setScalar(0.92);

  const group = new THREE.Group();
  group.add(inner, core);
  group.rotation.set(0.35, -0.35, 0.08);
  scene.add(group);

  const keyLight = new THREE.PointLight(0xff4d5e, 18, 12);
  keyLight.position.set(2.5, 2.2, 3.5);
  scene.add(new THREE.AmbientLight(0x35070e, 2.2), keyLight);

  const resize = () => {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  };

  let animationFrame = 0;
  const animate = (time: number) => {
    animationFrame = 0;
    if (prefersReducedMotion.value) {
      renderer.render(scene, camera);
      return;
    }

    group.rotation.y = -0.35 + time * 0.00013;
    group.rotation.x = 0.35 + Math.sin(time * 0.00024) * 0.09;
    renderer.render(scene, camera);
    animationFrame = window.requestAnimationFrame(animate);
  };

  refreshSceneMotion = () => {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    if (prefersReducedMotion.value) renderer.render(scene, camera);
    else animationFrame = window.requestAnimationFrame(animate);
  };

  window.addEventListener('resize', resize, { passive: true });
  resize();
  refreshSceneMotion();

  sceneCleanup = () => {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    window.removeEventListener('resize', resize);
    refreshSceneMotion = null;
    geometry.dispose();
    wireMaterial.dispose();
    innerMaterial.dispose();
    renderer.dispose();
  };
});

onBeforeUnmount(() => {
  sectionObserver?.disconnect();
  sectionObserver = null;
  sceneCleanup?.();
  sceneCleanup = null;
  motionCleanup?.();
  motionCleanup = null;
});
</script>

<style scoped>
.fb-shell {
  --fb-bg: #0b0406;
  --fb-panel: #110609;
  --fb-panel-raised: #17080c;
  --fb-line: rgba(229, 35, 59, 0.2);
  --fb-line-strong: rgba(255, 77, 94, 0.4);
  --fb-text: #f3e6e8;
  --fb-muted: #b99ea4;
  --fb-accent: #ff4d5e;
  --fb-accent-deep: #8a0f1e;
  --fb-rail-width: 304px;
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
  color: var(--fb-text);
  background:
    radial-gradient(circle at 82% 8%, rgba(138, 15, 30, 0.16), transparent 30rem),
    linear-gradient(135deg, #0b0406 0%, #0d0508 48%, #080305 100%);
  font-family: Inter, Satoshi, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color-scheme: dark;
}

.fb-shell,
.fb-shell * {
  box-sizing: border-box;
}

.fb-shell ::selection {
  color: #fff7f8;
  background: #8a0f1e;
}

.fb-rail {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 20;
  width: var(--fb-rail-width);
  height: 100dvh;
  overflow: hidden;
  border-right: 1px solid var(--fb-line-strong);
  background:
    linear-gradient(rgba(255, 77, 94, 0.026) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 77, 94, 0.026) 1px, transparent 1px),
    radial-gradient(circle at 50% 28%, rgba(138, 15, 30, 0.24), transparent 15rem),
    rgba(11, 4, 6, 0.96);
  background-size: 22px 22px, 22px 22px, auto, auto;
  box-shadow: 18px 0 52px rgba(0, 0, 0, 0.38);
}

.fb-rail::after {
  position: absolute;
  inset: 0 0 auto;
  height: 2px;
  content: "";
  background: linear-gradient(90deg, transparent, var(--fb-accent), transparent);
  opacity: 0.8;
}

.fb-rail-grid {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 22px 18px 18px;
}

.fb-identity {
  min-width: 0;
}

.fb-kicker,
.fb-pane-type,
.fb-nav-label,
.fb-pane-count,
.fb-scene-caption {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.fb-kicker {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
  color: var(--fb-muted);
}

.fb-signal {
  width: 7px;
  height: 7px;
  border: 1px solid var(--fb-accent);
  background: var(--fb-accent-deep);
  box-shadow: 0 0 12px rgba(255, 77, 94, 0.72);
}

.fb-identity h1 {
  max-width: 12ch;
  margin: 0;
  font-size: clamp(27px, 2.2vw, 33px);
  font-weight: 650;
  line-height: 0.98;
  letter-spacing: -0.055em;
  text-wrap: balance;
}

.fb-role {
  margin: 12px 0 0;
  color: var(--fb-accent);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 13px;
  font-weight: 650;
  line-height: 1.35;
}

.fb-discipline {
  margin: 7px 0 0;
  color: #d2b8bd;
  font-size: 13px;
  line-height: 1.45;
}

.fb-location {
  display: grid;
  gap: 5px;
  margin-top: 10px;
  color: var(--fb-muted);
  font-size: 12px;
}

.fb-location span {
  display: flex;
  gap: 7px;
  align-items: center;
  min-width: 0;
}

.fb-location svg,
.fb-nav-link svg,
.fb-contacts svg {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.fb-location svg {
  width: 14px;
  height: 14px;
  color: #d25a69;
}

.fb-scene {
  position: relative;
  flex: 0 0 122px;
  width: 100%;
  height: 122px;
  margin: 14px 0 10px;
  overflow: hidden;
  border-block: 1px solid var(--fb-line);
  background:
    radial-gradient(circle at 50% 45%, rgba(229, 35, 59, 0.16), transparent 46%),
    linear-gradient(90deg, transparent 49.7%, rgba(255, 77, 94, 0.13) 50%, transparent 50.3%),
    linear-gradient(transparent 49.7%, rgba(255, 77, 94, 0.1) 50%, transparent 50.3%);
}

.fb-scene::before,
.fb-scene::after {
  position: absolute;
  z-index: 2;
  width: 10px;
  height: 10px;
  content: "";
  pointer-events: none;
}

.fb-scene::before {
  top: 8px;
  left: 0;
  border-top: 1px solid var(--fb-accent);
  border-left: 1px solid var(--fb-accent);
}

.fb-scene::after {
  right: 0;
  bottom: 8px;
  border-right: 1px solid var(--fb-accent);
  border-bottom: 1px solid var(--fb-accent);
}

.fb-scene canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.fb-scene-caption {
  position: absolute;
  right: 5px;
  bottom: 5px;
  display: flex;
  gap: 6px;
  align-items: center;
  color: #a98a90;
  letter-spacing: 0.07em;
}

.fb-scene-mark {
  width: 12px;
  height: 1px;
  background: var(--fb-accent);
  box-shadow: 0 0 8px rgba(255, 77, 94, 0.8);
}

.fb-rail-stats,
.fb-summary-stats {
  margin: 0;
}

.fb-rail-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-bottom: 1px solid var(--fb-line);
}

.fb-stat {
  min-width: 0;
  padding: 9px 8px 8px;
  border-top: 1px solid var(--fb-line);
}

.fb-stat:nth-child(odd) {
  border-right: 1px solid var(--fb-line);
}

.fb-stat dd,
.fb-summary-stats dd {
  margin: 0;
  color: var(--fb-text);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 19px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
}

.fb-stat dt,
.fb-summary-stats dt {
  margin-top: 6px;
  color: #d3bbc0;
  font-size: 12px;
  font-weight: 650;
  line-height: 1.2;
}

.fb-stat span,
.fb-summary-stats span {
  display: block;
  margin-top: 3px;
  color: var(--fb-muted);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 12px;
  line-height: 1.2;
}

.fb-nav {
  min-width: 0;
  margin-top: 13px;
}

.fb-nav-label {
  display: block;
  margin-bottom: 6px;
  color: #96777e;
}

.fb-nav-list {
  display: grid;
  gap: 2px;
}

.fb-nav-link {
  position: relative;
  display: grid;
  grid-template-columns: 18px 1fr auto;
  gap: 9px;
  align-items: center;
  min-width: 0;
  min-height: 35px;
  padding: 5px 9px;
  border: 1px solid transparent;
  color: #cbb1b6;
  font-size: 13px;
  text-decoration: none;
  transition: color 150ms ease, background-color 150ms ease, border-color 150ms ease;
}

.fb-nav-link::before {
  position: absolute;
  inset: 6px auto 6px -1px;
  width: 2px;
  content: "";
  background: transparent;
}

.fb-nav-link:hover {
  color: var(--fb-text);
  background: rgba(255, 77, 94, 0.055);
}

.fb-nav-link.is-active {
  color: #fff3f5;
  border-color: rgba(255, 77, 94, 0.18);
  background: linear-gradient(90deg, rgba(138, 15, 30, 0.28), rgba(138, 15, 30, 0.05));
}

.fb-nav-link.is-active::before {
  background: var(--fb-accent);
  box-shadow: 0 0 10px rgba(255, 77, 94, 0.8);
}

.fb-nav-link.is-active svg {
  color: var(--fb-accent);
}

.fb-nav-code {
  color: #8e6f76;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 12px;
}

.fb-nav-link:focus-visible,
.fb-contacts a:focus-visible {
  outline: 2px solid var(--fb-accent);
  outline-offset: 2px;
}

.fb-contacts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 5px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--fb-line);
}

.fb-contacts a {
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 36px;
  padding: 6px 4px;
  border: 1px solid var(--fb-line);
  color: #d9c2c6;
  background: rgba(26, 8, 13, 0.62);
  font-size: 12px;
  font-weight: 650;
  text-decoration: none;
  transition: color 150ms ease, border-color 150ms ease, background-color 150ms ease;
}

.fb-contacts a:hover {
  color: #fff5f6;
  border-color: var(--fb-line-strong);
  background: rgba(138, 15, 30, 0.22);
}

.fb-contacts svg {
  width: 14px;
  height: 14px;
}

.fb-main {
  position: relative;
  height: 100dvh;
  margin-left: var(--fb-rail-width);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scrollbar-color: #5d111d #100609;
  background:
    linear-gradient(90deg, rgba(255, 77, 94, 0.018) 1px, transparent 1px),
    linear-gradient(rgba(255, 77, 94, 0.014) 1px, transparent 1px);
  background-size: 48px 48px;
}

.fb-content {
  width: min(100%, 1180px);
  margin: 0 auto;
  padding: 22px clamp(26px, 4vw, 58px) 80px;
}

.fb-pane {
  min-width: 0;
  padding: clamp(28px, 4vw, 46px) 0;
  border-top: 1px solid var(--fb-line);
  scroll-margin-top: 18px;
}

.fb-pane:first-child {
  border-top-color: var(--fb-line-strong);
}

.fb-pane-head {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  gap: 13px;
  align-items: end;
  margin-bottom: 25px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--fb-line);
}

.fb-pane-index {
  color: var(--fb-accent);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 14px;
  line-height: 1;
}

.fb-pane-type,
.fb-pane-count {
  color: #a98990;
}

.fb-pane-head h2 {
  margin: 4px 0 0;
  font-size: clamp(27px, 3.2vw, 43px);
  font-weight: 620;
  line-height: 0.96;
  letter-spacing: -0.045em;
}

.fb-pane-count {
  padding-bottom: 2px;
  white-space: nowrap;
}

.fb-summary-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(250px, 0.75fr);
  gap: clamp(28px, 5vw, 74px);
  align-items: start;
}

.fb-summary-copy {
  max-width: 880px;
  margin: 0;
  color: #eedde0;
  font-size: clamp(21px, 2.35vw, 31px);
  line-height: 1.35;
  letter-spacing: -0.025em;
  text-wrap: pretty;
}

.fb-summary-readout {
  margin: 0;
  border-top: 1px solid var(--fb-line-strong);
}

.fb-summary-readout div {
  display: grid;
  grid-template-columns: 94px minmax(0, 1fr);
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--fb-line);
}

.fb-summary-readout dt {
  color: #a98990;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 12px;
  line-height: 1.45;
  text-transform: uppercase;
}

.fb-summary-readout dd {
  margin: 0;
  color: #dec9cd;
  font-size: 13px;
  line-height: 1.45;
}

.fb-summary-stats {
  display: none;
}

.fb-proof-table {
  border-bottom: 1px solid var(--fb-line);
}

.fb-table-head,
.fb-proof-row {
  display: grid;
  grid-template-columns: minmax(180px, 0.8fr) minmax(260px, 1.5fr) minmax(150px, 0.55fr);
  gap: clamp(18px, 3vw, 42px);
}

.fb-table-head {
  padding: 0 0 9px;
  color: #96777e;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 12px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.fb-table-head span:last-child {
  text-align: right;
}

.fb-proof-row {
  position: relative;
  align-items: center;
  padding: 17px 0;
  border-top: 1px solid var(--fb-line);
}

.fb-proof-row::before {
  position: absolute;
  inset: 0 auto 0 -12px;
  width: 1px;
  content: "";
  background: transparent;
}

.fb-proof-row:hover::before {
  background: var(--fb-accent);
}

.fb-proof-title {
  display: grid;
  grid-template-columns: 27px minmax(0, 1fr);
  gap: 7px;
  align-items: start;
  min-width: 0;
}

.fb-proof-title > span,
.fb-row-number {
  color: #8e6f76;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 12px;
}

.fb-proof-title h3,
.fb-principles-grid h3,
.fb-timeline-list h3,
.fb-project-identity h3 {
  margin: 0;
  color: #f1e3e5;
  font-size: 14px;
  font-weight: 680;
  line-height: 1.35;
}

.fb-proof-row > p,
.fb-principles-grid p,
.fb-timeline-list p,
.fb-project-row > p {
  margin: 0;
  color: var(--fb-muted);
  font-size: 13px;
  line-height: 1.55;
}

.fb-proof-metric {
  min-width: 0;
  text-align: right;
}

.fb-proof-metric strong {
  display: block;
  color: var(--fb-accent);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: clamp(25px, 3vw, 38px);
  font-weight: 720;
  line-height: 0.92;
  letter-spacing: -0.065em;
}

.fb-proof-metric span {
  display: block;
  margin-top: 7px;
  color: #c6aab0;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 12px;
  line-height: 1.3;
}

.fb-principles-grid,
.fb-timeline-list,
.fb-project-stack {
  padding: 0;
  margin: 0;
  list-style: none;
}

.fb-principles-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid var(--fb-line);
  border-left: 1px solid var(--fb-line);
}

.fb-principles-grid li {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 10px;
  min-width: 0;
  padding: 17px;
  border-right: 1px solid var(--fb-line);
  border-bottom: 1px solid var(--fb-line);
}

.fb-principles-grid h3 {
  margin-bottom: 7px;
}

.fb-timeline-list {
  border-top: 1px solid var(--fb-line-strong);
}

.fb-timeline-list li {
  display: grid;
  grid-template-columns: 84px minmax(180px, 0.65fr) minmax(260px, 1.35fr);
  gap: clamp(16px, 3vw, 42px);
  align-items: baseline;
  padding: 16px 0;
  border-bottom: 1px solid var(--fb-line);
}

.fb-timeline-list time {
  color: var(--fb-accent);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 17px;
  font-weight: 700;
}

.fb-project-list {
  border-top: 1px solid var(--fb-line-strong);
}

.fb-project-row {
  display: grid;
  grid-template-columns: 38px minmax(170px, 0.65fr) minmax(260px, 1.25fr) minmax(210px, 0.8fr);
  gap: clamp(14px, 2.2vw, 30px);
  align-items: start;
  min-width: 0;
  padding: 16px 0;
  border-bottom: 1px solid var(--fb-line);
}

.fb-project-glyph {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid rgba(255, 77, 94, 0.3);
  color: var(--fb-accent);
  background: rgba(138, 15, 30, 0.15);
  font-size: 17px;
}

.fb-project-identity {
  min-width: 0;
}

.fb-project-identity h3 {
  overflow-wrap: anywhere;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 14px;
}

.fb-tag {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  margin-top: 7px;
  padding: 3px 7px;
  border: 1px solid rgba(229, 35, 59, 0.26);
  color: #d7b6bc;
  background: rgba(138, 15, 30, 0.12);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 12px;
  line-height: 1.1;
}

.fb-project-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.fb-project-stack li,
.fb-stack-row dd span {
  display: inline-flex;
  align-items: center;
  min-height: 25px;
  padding: 3px 7px;
  border: 1px solid rgba(185, 158, 164, 0.17);
  color: #cdb5ba;
  background: rgba(243, 230, 232, 0.025);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 12px;
  line-height: 1.1;
}

.fb-stack-list {
  margin: 0;
  border-top: 1px solid var(--fb-line-strong);
}

.fb-stack-row {
  display: grid;
  grid-template-columns: minmax(125px, 0.28fr) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
  padding: 14px 0;
  border-bottom: 1px solid var(--fb-line);
}

.fb-stack-row dt {
  padding-top: 5px;
  color: #ead7da;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 13px;
  font-weight: 700;
}

.fb-stack-row dd {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
  margin: 0;
}

.fb-sample-label {
  position: fixed;
  right: 14px;
  top: 12px;
  z-index: 50;
  max-width: calc(100vw - 28px);
  padding: 7px 10px;
  border: 1px solid var(--fb-line-strong);
  color: #f7e6e9;
  background: rgba(11, 4, 6, 0.9);
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.42);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 12px;
  letter-spacing: 0.06em;
  line-height: 1.2;
  pointer-events: none;
  backdrop-filter: blur(10px);
}

@media (max-width: 1150px) and (min-width: 901px) {
  .fb-summary-layout {
    grid-template-columns: 1fr;
  }

  .fb-summary-readout {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fb-summary-readout div:nth-child(odd) {
    margin-right: 20px;
  }

  .fb-project-row {
    grid-template-columns: 38px minmax(170px, 0.7fr) minmax(0, 1.3fr);
  }

  .fb-project-stack {
    grid-column: 2 / -1;
  }
}

@media (max-height: 760px) and (min-width: 901px) {
  .fb-rail-grid {
    padding-block: 14px;
  }

  .fb-discipline {
    display: none;
  }

  .fb-scene {
    flex-basis: 78px;
    height: 78px;
    margin-block: 8px;
  }

  .fb-nav {
    margin-top: 8px;
  }

  .fb-nav-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fb-nav-code {
    display: none;
  }

  .fb-contacts {
    padding-top: 8px;
  }
}

@media (max-width: 900px) {
  .fb-shell {
    min-height: 100dvh;
    overflow: visible;
  }

  .fb-rail {
    position: sticky;
    inset: 0 0 auto;
    width: 100%;
    height: auto;
    overflow: hidden;
    border-right: 0;
    border-bottom: 1px solid var(--fb-line-strong);
    background:
      linear-gradient(90deg, rgba(255, 77, 94, 0.025) 1px, transparent 1px),
      rgba(11, 4, 6, 0.94);
    background-size: 24px 24px, auto;
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.34);
    backdrop-filter: blur(16px);
  }

  .fb-rail-grid {
    display: grid;
    grid-template-areas:
      "identity scene"
      "contacts contacts"
      "nav nav";
    grid-template-columns: minmax(0, 1fr) 92px;
    gap: 8px 12px;
    height: auto;
    padding: 11px 16px 9px;
  }

  .fb-identity {
    grid-area: identity;
    align-self: center;
  }

  .fb-kicker {
    margin-bottom: 4px;
  }

  .fb-identity h1 {
    max-width: none;
    font-size: 20px;
    line-height: 1.05;
    letter-spacing: -0.035em;
  }

  .fb-role {
    margin-top: 5px;
    font-size: 12px;
  }

  .fb-discipline,
  .fb-location {
    display: none;
  }

  .fb-scene {
    grid-area: scene;
    width: 92px;
    height: 62px;
    min-height: 62px;
    margin: 0;
    border: 1px solid var(--fb-line);
  }

  .fb-scene-caption {
    display: none;
  }

  .fb-rail-stats {
    display: none;
  }

  .fb-nav {
    grid-area: nav;
    margin: 0;
    overflow: hidden;
  }

  .fb-nav-label {
    display: none;
  }

  .fb-nav-list {
    display: flex;
    gap: 6px;
    max-width: 100%;
    padding-bottom: 2px;
    padding-right: 18px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: thin;
    scrollbar-color: #61111e transparent;
    /* fade the trailing edge so a half-visible chip reads as "scroll me",
       not as a clipped layout */
    mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 22px), transparent 100%);
  }

  .fb-nav-link {
    flex: 0 0 auto;
    grid-template-columns: 16px auto;
    gap: 7px;
    min-height: 36px;
    padding-inline: 10px;
    border-color: var(--fb-line);
    background: rgba(17, 6, 9, 0.82);
  }

  .fb-nav-code {
    display: none;
  }

  .fb-contacts {
    grid-area: contacts;
    margin: 0;
    padding: 0;
    border: 0;
  }

  .fb-contacts a {
    min-height: 34px;
  }

  .fb-main {
    height: auto;
    min-height: 100dvh;
    margin-left: 0;
    overflow: visible;
  }

  .fb-content {
    width: 100%;
    padding: 0 clamp(20px, 5vw, 40px) 72px;
  }

  .fb-pane {
    scroll-margin-top: 180px;
  }

  .fb-summary-layout {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .fb-summary-readout {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fb-summary-readout div:nth-child(odd) {
    margin-right: 18px;
  }

  .fb-summary-stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin-top: 25px;
    border-top: 1px solid var(--fb-line-strong);
    border-left: 1px solid var(--fb-line);
  }

  .fb-summary-stats > div {
    min-width: 0;
    padding: 11px;
    border-right: 1px solid var(--fb-line);
    border-bottom: 1px solid var(--fb-line);
  }

  .fb-principles-grid {
    grid-template-columns: 1fr;
  }

  .fb-project-row {
    grid-template-columns: 36px minmax(0, 1fr);
    gap: 10px 12px;
  }

  .fb-project-identity {
    grid-column: 2;
  }

  .fb-project-row > p,
  .fb-project-stack {
    grid-column: 2;
  }
}

@media (max-width: 640px) {
  .fb-rail-grid {
    grid-template-areas:
      "identity"
      "contacts"
      "nav";
    grid-template-columns: minmax(0, 1fr);
    padding-inline: 12px;
  }

  .fb-scene {
    display: none;
  }

  .fb-content {
    padding-inline: 18px;
  }

  .fb-pane {
    padding: 28px 0;
    scroll-margin-top: 180px;
  }

  .fb-pane-head {
    grid-template-columns: 34px minmax(0, 1fr);
    gap: 8px;
    margin-bottom: 20px;
  }

  .fb-pane-head h2 {
    font-size: 27px;
  }

  .fb-pane-count {
    display: none;
  }

  .fb-summary-copy {
    font-size: 20px;
    line-height: 1.4;
  }

  .fb-summary-readout {
    grid-template-columns: 1fr;
  }

  .fb-summary-readout div:nth-child(odd) {
    margin-right: 0;
  }

  .fb-summary-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fb-table-head {
    display: none;
  }

  .fb-proof-row {
    grid-template-columns: minmax(0, 1fr) minmax(112px, 0.45fr);
    gap: 12px 16px;
    align-items: start;
    padding-block: 18px;
  }

  .fb-proof-title {
    grid-column: 1;
  }

  .fb-proof-row > p {
    grid-column: 1 / -1;
  }

  .fb-proof-metric {
    grid-column: 2;
    grid-row: 1;
  }

  .fb-proof-metric strong {
    font-size: 29px;
  }

  .fb-timeline-list li {
    grid-template-columns: 66px minmax(0, 1fr);
    gap: 8px 14px;
    align-items: start;
  }

  .fb-timeline-list p {
    grid-column: 2;
  }

  .fb-stack-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .fb-project-row > p,
  .fb-principles-grid p,
  .fb-timeline-list p,
  .fb-proof-row > p {
    font-size: 13px;
  }
}

@media (max-width: 520px) {
  .fb-proof-row {
    grid-template-columns: 1fr;
  }

  .fb-proof-title {
    grid-column: 1;
    grid-row: 2;
  }

  .fb-proof-metric {
    grid-column: 1;
    grid-row: 1;
    justify-self: end;
    max-width: 190px;
  }

  .fb-proof-row > p {
    grid-column: 1;
    grid-row: 3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fb-nav-link,
  .fb-contacts a {
    transition: none;
  }
}

.fb-reduced-motion .fb-nav-link,
.fb-reduced-motion .fb-contacts a {
  transition: none;
}
</style>
