<template>
  <div class="fd-page">
    <a class="fd-skip" href="#fd-ledger">
      <span aria-hidden="true">↓</span>
      Skip to the production ledger
    </a>

    <div class="fd-sample-label" aria-hidden="true">
      SAMPLE D - editorial ledger
    </div>

    <header class="fd-masthead">
      <div class="fd-shell">
        <div class="fd-editionbar">
          <p class="fd-editionbar__line">
            <span>Engineering record</span>
            <span aria-hidden="true">/</span>
            {{ identity.discipline }}
          </p>

          <nav class="fd-nav" aria-label="Page sections">
            <a href="#fd-ledger">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 5h16M4 12h16M4 19h16M9 5v14" />
              </svg>
              Ledger
            </a>
            <a href="#fd-projects">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7.5h16v12H4zM8 7.5V5h8v2.5M4 12h16" />
              </svg>
              Projects
            </a>
            <a href="#fd-timeline">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7.5V12l3 2" />
              </svg>
              Timeline
            </a>
            <a href="#fd-contact">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3.5" y="5.5" width="17" height="13" rx="1" />
                <path d="m4 7 8 6 8-6" />
              </svg>
              Contact
            </a>
          </nav>
        </div>

        <div class="fd-masthead__grid">
          <p class="fd-kicker">
            {{ identity.location }}
            <span aria-hidden="true">·</span>
            {{ identity.timezone }}
          </p>

          <h1 class="fd-title">
            <span class="fd-title__name">{{ identity.name }}</span>
            <span class="fd-title__role">{{ identity.role }}</span>
          </h1>

          <section class="fd-standfirst" aria-label="About">
            <h2 class="fd-visually-hidden">About</h2>
            <p>{{ identity.summary }}</p>
          </section>

          <dl class="fd-byline">
            <div>
              <dt>Discipline</dt>
              <dd>{{ identity.discipline }}</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>{{ identity.availability }}</dd>
            </div>
          </dl>

          <aside ref="ornamentHost" class="fd-ornament" aria-hidden="true">
            <canvas ref="ornamentCanvas" class="fd-ornament__canvas" />
          </aside>
        </div>

        <dl class="fd-stats" aria-label="Profile statistics">
          <div v-for="stat in stats" :key="stat.label" class="fd-stat">
            <dt>{{ stat.label }}</dt>
            <dd>
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.note }}</span>
            </dd>
          </div>
        </dl>
      </div>
    </header>

    <main class="fd-main" aria-label="Professional record">
      <section id="fd-ledger" class="fd-shell fd-ledger-section" aria-label="Production outcomes ledger">
        <header class="fd-section-heading">
          <p class="fd-section-heading__index">01 / Production</p>
          <div>
            <p class="fd-eyebrow">Auditable outcomes</p>
            <h2>Systems ledger</h2>
          </div>
        </header>

        <div class="fd-table-frame">
          <table class="fd-ledger" aria-describedby="fd-ledger-provenance">
            <caption>
              <span>Table 01</span>
              Production systems and operating scale
            </caption>
            <colgroup>
              <col class="fd-ledger__system-col">
              <col class="fd-ledger__scale-col">
              <col class="fd-ledger__detail-col">
            </colgroup>
            <thead>
              <tr>
                <th scope="col">System</th>
                <th class="fd-ledger__scale-head" scope="col" :aria-sort="scaleSort">
                  <button type="button" :aria-label="sortButtonLabel" @click="toggleScaleSort">
                    <span><span class="fd-sort__mobile">Sort by </span>Scale</span>
                    <span class="fd-sort__glyph" aria-hidden="true">{{ sortGlyph }}</span>
                  </button>
                </th>
                <th scope="col">What it had to survive</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in ledgerRows" :key="row.proof.title" tabindex="0">
                <td data-label="System">
                  <strong>{{ row.proof.title }}</strong>
                </td>
                <td class="fd-ledger__scale" data-label="Scale">
                  <div class="fd-scale__copy">
                    <strong>{{ row.proof.metric }}</strong>
                    <span>{{ row.proof.metricLabel }}</span>
                  </div>
                  <span class="fd-scale__track" aria-hidden="true">
                    <span :style="{ width: `${row.weight}%` }" />
                  </span>
                </td>
                <td data-label="What it had to survive">{{ row.proof.detail }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p id="fd-ledger-provenance" class="fd-provenance">
          Provenance — Employer systems are described by function under NDA. Bars indicate emphasis from the original profile order, not an additional measured value.
        </p>
        <p class="fd-visually-hidden" aria-live="polite">{{ sortStatus }}</p>
      </section>

      <div class="fd-shell fd-record-grid">
        <section id="fd-timeline" class="fd-timeline" aria-label="Career timeline">
          <header class="fd-minor-heading">
            <p class="fd-section-heading__index">02 / Chronology</p>
            <h2>Career timeline</h2>
          </header>

          <ol class="fd-timeline__list">
            <li v-for="entry in timeline" :key="entry.year">
              <time :datetime="entry.year">{{ entry.year }}</time>
              <div>
                <h3>{{ entry.role }}</h3>
                <p>{{ entry.detail }}</p>
              </div>
            </li>
          </ol>
        </section>

        <section id="fd-projects" class="fd-projects" aria-label="Project register">
          <header class="fd-minor-heading fd-minor-heading--wide">
            <p class="fd-section-heading__index">03 / Register</p>
            <h2>Project ledger</h2>
          </header>

          <div class="fd-project-frame">
            <table class="fd-project-table">
              <caption>Selected systems and tools, recorded by function</caption>
              <thead>
                <tr>
                  <th scope="col">Project / function</th>
                  <th scope="col">Tag</th>
                  <th scope="col">Stack</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="project in projects" :key="project.name">
                  <td data-label="Project / function">
                    <div class="fd-project-name">
                      <span aria-hidden="true">{{ project.glyph }}</span>
                      <strong>{{ project.name }}</strong>
                    </div>
                    <p>{{ project.desc }}</p>
                  </td>
                  <td data-label="Tag">
                    <span class="fd-project-tag">{{ project.tag }}</span>
                  </td>
                  <td data-label="Stack">
                    <ul class="fd-project-stack" :aria-label="`${project.name} technology stack`">
                      <li v-for="item in project.stack" :key="item">{{ item }}</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div class="fd-shell fd-notes-grid">
        <section id="fd-principles" class="fd-principles" aria-label="Engineering principles">
          <header class="fd-minor-heading">
            <p class="fd-section-heading__index">04 / Notes</p>
            <h2>Operating principles</h2>
          </header>

          <ol class="fd-principles__list">
            <li v-for="(principle, index) in principles" :key="principle.title">
              <span class="fd-note-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
              <div>
                <h3>{{ principle.title }}</h3>
                <p>{{ principle.detail }}</p>
              </div>
            </li>
          </ol>
        </section>

        <section id="fd-stack" class="fd-stack" aria-label="Technology stack">
          <header class="fd-minor-heading">
            <p class="fd-section-heading__index">05 / Index</p>
            <h2>Technical index</h2>
          </header>

          <dl class="fd-stack__list">
            <div v-for="group in stackGroups" :key="group.label">
              <dt>{{ group.label }}</dt>
              <dd>
                <span v-for="item in group.items" :key="item">{{ item }}</span>
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </main>

    <footer id="fd-contact" class="fd-footer" aria-label="Contact">
      <div class="fd-shell fd-contact-box">
        <div class="fd-contact-copy">
          <p class="fd-eyebrow">Direct line</p>
          <h2>{{ identity.availability }}</h2>
          <p>{{ identity.location }} · {{ identity.timezone }}</p>
        </div>

        <nav class="fd-contact-links" aria-label="Contact links">
          <a :href="`mailto:${identity.email}`">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3.5" y="5.5" width="17" height="13" rx="1" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            <span>Email</span>
          </a>
          <a :href="identity.github" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.5 8 4.5 12l4 4M15.5 8l4 4-4 4M13.5 5l-3 14" />
            </svg>
            <span>GitHub</span>
          </a>
          <a :href="identity.linkedin" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 9v8M7 6.5v.1M11 17v-4.5a3.5 3.5 0 0 1 7 0V17M11 9v8" />
            </svg>
            <span>LinkedIn</span>
          </a>
        </nav>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import * as THREE from 'three';

const { identity, stats, proofs, principles, timeline, projects, stackGroups } = useProfile();

useHead({
  title: 'Sample D - editorial ledger',
  meta: [{ name: 'robots', content: 'noindex' }],
});

type ScaleSort = 'none' | 'ascending' | 'descending';

const scaleSort = ref<ScaleSort>('none');
const scaleCollator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

const ledgerRows = computed(() => {
  const rows = proofs.map((proof, index) => ({
    proof,
    index,
    weight: Math.max(44, 100 - index * 14),
  }));

  if (scaleSort.value === 'none') return rows;

  const direction = scaleSort.value === 'ascending' ? 1 : -1;
  return [...rows].sort((left, right) => {
    const comparison = scaleCollator.compare(left.proof.metric, right.proof.metric);
    return comparison === 0 ? left.index - right.index : comparison * direction;
  });
});

const sortGlyph = computed(() => {
  if (scaleSort.value === 'ascending') return '↑';
  if (scaleSort.value === 'descending') return '↓';
  return '↕';
});

const sortButtonLabel = computed(() =>
  scaleSort.value === 'ascending' ? 'Sort scale descending' : 'Sort scale ascending',
);

const sortStatus = computed(() => {
  if (scaleSort.value === 'none') return 'Ledger uses the original profile order.';
  return `Ledger sorted by scale ${scaleSort.value}.`;
});

function toggleScaleSort() {
  scaleSort.value = scaleSort.value === 'ascending' ? 'descending' : 'ascending';
}

const ornamentHost = ref<HTMLElement | null>(null);
const ornamentCanvas = ref<HTMLCanvasElement | null>(null);
let disposeOrnament: (() => void) | null = null;

onMounted(() => {
  const host = ornamentHost.value;
  const canvas = ornamentCanvas.value;
  if (!host || !canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 10);
  camera.position.z = 3.4;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const geometry = new THREE.IcosahedronGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xe5233b,
    transparent: true,
    opacity: 0.72,
    wireframe: true,
  });
  const polyhedron = new THREE.Mesh(geometry, material);
  polyhedron.rotation.set(0.38, -0.48, 0.08);
  scene.add(polyhedron);

  const animationGuard = window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 640px)');
  let frame = 0;

  const render = () => renderer.render(scene, camera);
  const resize = () => {
    const width = Math.max(host.clientWidth, 1);
    const height = Math.max(host.clientHeight, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    render();
  };
  const animate = () => {
    polyhedron.rotation.y += 0.0025;
    polyhedron.rotation.x += 0.0008;
    render();
    frame = window.requestAnimationFrame(animate);
  };
  const syncMotion = () => {
    window.cancelAnimationFrame(frame);
    frame = 0;
    if (animationGuard.matches) render();
    else animate();
  };

  resize();
  syncMotion();
  window.addEventListener('resize', resize);
  animationGuard.addEventListener('change', syncMotion);

  disposeOrnament = () => {
    window.cancelAnimationFrame(frame);
    window.removeEventListener('resize', resize);
    animationGuard.removeEventListener('change', syncMotion);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
});

onBeforeUnmount(() => {
  disposeOrnament?.();
  disposeOrnament = null;
});
</script>

<style scoped>
.fd-page {
  --fd-bg: #0b0406;
  --fd-paper: #12070a;
  --fd-paper-raised: #180a0e;
  --fd-paper-soft: #210b11;
  --fd-ink: #f3e6e8;
  --fd-muted: #b99ea4;
  --fd-accent: #e5233b;
  --fd-accent-bright: #ff4d5e;
  --fd-accent-deep: #8a0f1e;
  --fd-line: rgba(243, 230, 232, 0.16);
  --fd-line-strong: rgba(255, 77, 94, 0.48);
  --fd-serif: 'Playfair Display', Georgia, serif;
  --fd-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --fd-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;

  position: relative;
  min-height: 100vh;
  overflow-x: clip;
  color: var(--fd-ink);
  background:
    radial-gradient(circle at 88% 4%, rgba(138, 15, 30, 0.24), transparent 28rem),
    radial-gradient(circle at 10% 58%, rgba(229, 35, 59, 0.06), transparent 32rem),
    linear-gradient(145deg, #0b0406 0%, #0d0407 48%, #080204 100%);
  font-family: var(--fd-sans);
  line-height: 1.6;
  isolation: isolate;
}

.fd-page::before {
  position: fixed;
  z-index: -1;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.012) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.01) 1px, transparent 1px);
  background-size: 5rem 5rem;
  content: '';
  pointer-events: none;
}

.fd-page,
.fd-page *,
.fd-page *::before,
.fd-page *::after {
  box-sizing: border-box;
}

.fd-page a {
  color: inherit;
}

.fd-page :focus-visible {
  outline: 2px solid var(--fd-accent-bright);
  outline-offset: 4px;
}

.fd-shell {
  width: min(calc(100% - clamp(2rem, 8vw, 7rem)), 82rem);
  margin-inline: auto;
}

.fd-visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

.fd-skip {
  position: fixed;
  z-index: 40;
  top: 0.75rem;
  left: 0.75rem;
  display: inline-flex;
  gap: 0.55rem;
  align-items: center;
  min-height: 2.75rem;
  padding: 0.55rem 0.8rem;
  border: 1px solid var(--fd-accent-bright);
  background: var(--fd-paper-raised);
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
  transform: translateY(calc(-100% - 1rem));
  transition: transform 160ms ease;
}

.fd-skip:focus {
  transform: translateY(0);
}

.fd-sample-label {
  position: fixed;
  z-index: 30;
  right: 0.75rem;
  top: 0.75rem;
  max-width: calc(100vw - 1.5rem);
  padding: 0.5rem 0.7rem;
  border: 1px solid rgba(255, 77, 94, 0.45);
  background: rgba(11, 4, 6, 0.92);
  box-shadow: 0 0.8rem 2.5rem rgba(0, 0, 0, 0.38);
  color: var(--fd-ink);
  font-family: var(--fd-mono);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
  pointer-events: none;
}

.fd-masthead {
  position: relative;
  padding-top: 1.1rem;
  border-bottom: 1px solid var(--fd-line-strong);
}

.fd-editionbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1.5rem;
  align-items: center;
  min-height: 3.35rem;
  border-block: 1px solid var(--fd-line);
}

.fd-editionbar__line {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin: 0;
  color: var(--fd-muted);
  font-size: 0.72rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.fd-editionbar__line span:first-child {
  color: var(--fd-ink);
  font-weight: 800;
}

.fd-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.15rem;
}

.fd-nav a {
  display: inline-flex;
  gap: 0.42rem;
  align-items: center;
  min-height: 2.6rem;
  padding-inline: 0.65rem;
  color: var(--fd-muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 160ms ease, background-color 160ms ease;
}

.fd-nav a:hover,
.fd-nav a:focus-visible {
  color: var(--fd-ink);
  background: rgba(229, 35, 59, 0.1);
}

.fd-nav svg,
.fd-contact-links svg {
  width: 1.05rem;
  height: 1.05rem;
  flex: 0 0 auto;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.65;
}

.fd-masthead__grid {
  display: grid;
  grid-template-areas:
    'kicker kicker ornament'
    'title title ornament'
    'standfirst byline ornament';
  grid-template-columns: minmax(0, 1.35fr) minmax(14rem, 0.65fr) 10rem;
  column-gap: clamp(1.5rem, 4vw, 4.5rem);
  align-items: start;
  padding-block: clamp(3.5rem, 8vw, 7.5rem) clamp(3rem, 6vw, 5.5rem);
}

.fd-kicker {
  grid-area: kicker;
  display: flex;
  gap: 0.55rem;
  align-items: center;
  margin: 0 0 1.2rem;
  color: var(--fd-accent-bright);
  font-family: var(--fd-mono);
  font-size: 0.73rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.fd-title {
  grid-area: title;
  margin: 0;
  font-family: var(--fd-serif);
  font-weight: 600;
}

.fd-title__name {
  display: block;
  max-width: 13ch;
  font-size: clamp(4.8rem, 9vw, 8.2rem);
  letter-spacing: -0.065em;
  line-height: 0.82;
  text-wrap: balance;
}

.fd-title__role {
  display: block;
  max-width: 25ch;
  margin-top: 1.35rem;
  color: var(--fd-muted);
  font-size: clamp(1.65rem, 3vw, 2.8rem);
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.025em;
  line-height: 1.05;
}

.fd-standfirst {
  grid-area: standfirst;
  max-width: 46rem;
  margin-top: clamp(2.5rem, 5vw, 4.25rem);
  padding-left: clamp(1.15rem, 2vw, 1.75rem);
  border-left: 2px solid var(--fd-accent);
}

.fd-standfirst p {
  margin: 0;
  color: var(--fd-ink);
  font-family: var(--fd-serif);
  font-size: clamp(1.25rem, 2vw, 1.65rem);
  line-height: 1.55;
}

.fd-byline {
  grid-area: byline;
  align-self: end;
  margin: clamp(2.5rem, 5vw, 4.25rem) 0 0;
  border-top: 1px solid var(--fd-line);
}

.fd-byline div {
  display: grid;
  grid-template-columns: 5.5rem minmax(0, 1fr);
  gap: 0.8rem;
  padding-block: 0.85rem;
  border-bottom: 1px solid var(--fd-line);
}

.fd-byline dt {
  color: var(--fd-accent-bright);
  font-family: var(--fd-mono);
  font-size: 0.67rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.fd-byline dd {
  margin: 0;
  color: var(--fd-muted);
  font-size: 0.8rem;
  line-height: 1.45;
}

.fd-ornament {
  position: relative;
  grid-area: ornament;
  width: 10rem;
  height: 15rem;
  align-self: center;
  border-left: 1px solid var(--fd-line);
}

.fd-ornament::before,
.fd-ornament::after {
  position: absolute;
  left: 0;
  width: 2.1rem;
  height: 1px;
  background: var(--fd-line-strong);
  content: '';
}

.fd-ornament::before {
  top: 0;
}

.fd-ornament::after {
  bottom: 0;
}

.fd-ornament__canvas {
  display: block;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 1rem 2.2rem rgba(229, 35, 59, 0.22));
}

.fd-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 0;
  border-top: 1px solid var(--fd-line);
}

.fd-stat {
  min-width: 0;
  padding: 1.4rem clamp(0.8rem, 2vw, 1.6rem);
  border-left: 1px solid var(--fd-line);
}

.fd-stat:last-child {
  border-right: 1px solid var(--fd-line);
}

.fd-stat dt {
  margin-bottom: 0.65rem;
  color: var(--fd-muted);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.fd-stat dd {
  display: flex;
  gap: 0.7rem;
  align-items: baseline;
  margin: 0;
}

.fd-stat strong {
  color: var(--fd-ink);
  font-family: var(--fd-serif);
  font-size: clamp(1.6rem, 2.8vw, 2.45rem);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.fd-stat span {
  color: var(--fd-muted);
  font-size: 0.71rem;
}

.fd-main {
  display: block;
}

.fd-ledger-section {
  padding-block: clamp(5rem, 9vw, 8.5rem);
}

.fd-section-heading {
  display: grid;
  grid-template-columns: minmax(7rem, 0.25fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: end;
  margin-bottom: clamp(2rem, 4vw, 3.5rem);
}

.fd-section-heading__index,
.fd-eyebrow {
  margin: 0;
  color: var(--fd-accent-bright);
  font-family: var(--fd-mono);
  font-size: 0.68rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.fd-section-heading h2,
.fd-minor-heading h2,
.fd-contact-copy h2 {
  margin: 0;
  font-family: var(--fd-serif);
  font-weight: 500;
  letter-spacing: -0.035em;
}

.fd-section-heading h2 {
  margin-top: 0.3rem;
  font-size: clamp(2.8rem, 6vw, 5.4rem);
  line-height: 0.95;
}

.fd-table-frame {
  position: relative;
  border: 1px solid var(--fd-line);
  border-top: 2px solid var(--fd-accent);
  background:
    linear-gradient(110deg, rgba(229, 35, 59, 0.055), transparent 32%),
    rgba(18, 7, 10, 0.84);
  box-shadow:
    0 2.2rem 5rem rgba(0, 0, 0, 0.32),
    inset 0 1px rgba(255, 255, 255, 0.025);
}

.fd-ledger,
.fd-project-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.fd-ledger caption,
.fd-project-table caption {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--fd-line);
  color: var(--fd-muted);
  font-family: var(--fd-serif);
  font-size: 0.96rem;
  text-align: left;
}

.fd-ledger caption span {
  margin-right: 0.7rem;
  color: var(--fd-accent-bright);
  font-family: var(--fd-mono);
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.fd-ledger__system-col {
  width: 27%;
}

.fd-ledger__scale-col {
  width: 26%;
}

.fd-ledger__detail-col {
  width: 47%;
}

.fd-ledger th,
.fd-project-table th {
  padding: 0.9rem 1.25rem;
  border-right: 1px solid var(--fd-line);
  border-bottom: 1px solid var(--fd-line-strong);
  color: var(--fd-muted);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-align: left;
  text-transform: uppercase;
}

.fd-ledger th:last-child,
.fd-ledger td:last-child,
.fd-project-table th:last-child,
.fd-project-table td:last-child {
  border-right: 0;
}

.fd-ledger__scale-head {
  text-align: right !important;
}

.fd-ledger__scale-head button {
  display: inline-flex;
  gap: 0.65rem;
  align-items: center;
  justify-content: flex-end;
  min-width: 5.5rem;
  min-height: 2.75rem;
  margin: -0.6rem;
  padding: 0.6rem;
  border: 0;
  color: var(--fd-ink);
  background: transparent;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  cursor: pointer;
}

.fd-ledger__scale-head button:hover {
  color: var(--fd-accent-bright);
}

.fd-sort__mobile {
  display: none;
}

.fd-sort__glyph {
  display: grid;
  width: 1.6rem;
  height: 1.6rem;
  place-items: center;
  border: 1px solid var(--fd-line-strong);
  color: var(--fd-accent-bright);
  font-family: var(--fd-mono);
  font-size: 0.9rem;
  line-height: 1;
}

.fd-ledger td {
  position: relative;
  padding: 1.4rem 1.25rem;
  border-right: 1px solid var(--fd-line);
  border-bottom: 1px solid var(--fd-line);
  color: var(--fd-muted);
  font-size: 0.88rem;
  line-height: 1.65;
  vertical-align: top;
  overflow-wrap: anywhere;
  transition: background-color 150ms ease, color 150ms ease;
}

.fd-ledger tbody tr:last-child td {
  border-bottom: 0;
}

.fd-ledger td:first-child strong {
  color: var(--fd-ink);
  font-family: var(--fd-serif);
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.35;
}

.fd-ledger__scale {
  text-align: right;
}

.fd-scale__copy {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: var(--fd-mono);
  font-variant-numeric: tabular-nums;
}

.fd-scale__copy strong {
  color: var(--fd-ink);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
}

.fd-scale__copy span {
  max-width: 24ch;
  margin-top: 0.4rem;
  font-size: 0.7rem;
  line-height: 1.45;
}

.fd-scale__track {
  display: block;
  width: 100%;
  height: 3px;
  margin-top: 1rem;
  overflow: hidden;
  background: rgba(243, 230, 232, 0.07);
}

.fd-scale__track span {
  display: block;
  height: 100%;
  margin-left: auto;
  background: linear-gradient(90deg, var(--fd-accent-deep), var(--fd-accent-bright));
  box-shadow: 0 0 0.8rem rgba(229, 35, 59, 0.32);
}

.fd-ledger tbody tr:hover td,
.fd-ledger tbody tr:focus-visible td {
  color: var(--fd-ink);
  background: rgba(229, 35, 59, 0.075);
}

.fd-ledger tbody tr:focus-visible {
  outline: none;
}

.fd-ledger tbody tr:focus-visible td:first-child {
  box-shadow: inset 3px 0 var(--fd-accent-bright);
}

.fd-provenance {
  margin: 1rem 0 0;
  color: var(--fd-muted);
  font-family: var(--fd-mono);
  font-size: 0.66rem;
  line-height: 1.6;
}

.fd-record-grid {
  display: grid;
  grid-template-columns: minmax(18rem, 0.38fr) minmax(0, 0.62fr);
  gap: clamp(2.5rem, 6vw, 6rem);
  padding-bottom: clamp(5rem, 9vw, 8rem);
}

.fd-minor-heading {
  padding-top: 1.2rem;
  border-top: 2px solid var(--fd-accent);
}

.fd-minor-heading h2 {
  margin-top: 0.65rem;
  font-size: clamp(2rem, 3.3vw, 3rem);
  line-height: 1.05;
}

.fd-timeline__list {
  margin: 2rem 0 0;
  padding: 0;
  border-top: 1px solid var(--fd-line);
  list-style: none;
}

.fd-timeline__list li {
  display: grid;
  grid-template-columns: 4rem minmax(0, 1fr);
  gap: 1rem;
  padding-block: 1.5rem;
  border-bottom: 1px solid var(--fd-line);
}

.fd-timeline__list time {
  margin-left: -0.65rem;
  color: var(--fd-accent-bright);
  font-family: var(--fd-serif);
  font-size: 1.12rem;
  font-style: italic;
  font-variant-numeric: tabular-nums;
}

.fd-timeline__list h3 {
  margin: 0 0 0.4rem;
  color: var(--fd-ink);
  font-family: var(--fd-serif);
  font-size: 1.08rem;
  font-weight: 600;
  line-height: 1.25;
}

.fd-timeline__list p {
  margin: 0;
  color: var(--fd-muted);
  font-size: 0.81rem;
  line-height: 1.65;
}

.fd-project-frame {
  margin-top: 2rem;
  border-top: 1px solid var(--fd-line-strong);
  border-bottom: 1px solid var(--fd-line);
}

.fd-project-table caption {
  padding-inline: 0;
  font-size: 0.85rem;
}

.fd-project-table th {
  padding-inline: 0.85rem;
}

.fd-project-table td {
  padding: 1.05rem 0.85rem;
  border-right: 1px solid var(--fd-line);
  border-bottom: 1px solid var(--fd-line);
  color: var(--fd-muted);
  font-size: 0.76rem;
  line-height: 1.55;
  vertical-align: top;
  overflow-wrap: anywhere;
}

.fd-project-table tbody tr:last-child td {
  border-bottom: 0;
}

.fd-project-name {
  display: flex;
  gap: 0.65rem;
  align-items: center;
  color: var(--fd-ink);
}

.fd-project-name > span {
  color: var(--fd-accent-bright);
  font-size: 1rem;
}

.fd-project-name strong {
  font-family: var(--fd-mono);
  font-size: 0.82rem;
}

.fd-project-table td p {
  margin: 0.45rem 0 0 1.65rem;
}

.fd-project-tag {
  display: inline-block;
  padding-bottom: 0.15rem;
  border-bottom: 1px solid var(--fd-accent-deep);
  color: var(--fd-ink);
  font-family: var(--fd-mono);
  font-size: 0.65rem;
  line-height: 1.35;
  text-transform: uppercase;
}

.fd-project-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.fd-project-stack li::before {
  margin-right: 0.35rem;
  color: var(--fd-accent);
  content: '·';
}

.fd-notes-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(18rem, 0.75fr);
  gap: clamp(3rem, 7vw, 7rem);
  padding-block: clamp(1rem, 3vw, 2.5rem) clamp(6rem, 11vw, 10rem);
}

.fd-principles__list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 2rem;
  margin: 2rem 0 0;
  padding: 0;
  list-style: none;
}

.fd-principles__list li {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr);
  gap: 0.9rem;
  padding-block: 1.25rem;
  border-top: 1px solid var(--fd-line);
}

.fd-note-number {
  color: var(--fd-accent-bright);
  font-family: var(--fd-mono);
  font-size: 0.68rem;
  letter-spacing: 0.05em;
}

.fd-principles__list h3 {
  margin: 0 0 0.35rem;
  font-family: var(--fd-serif);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
}

.fd-principles__list p {
  margin: 0;
  color: var(--fd-muted);
  font-size: 0.77rem;
  line-height: 1.6;
}

.fd-stack__list {
  margin: 2rem 0 0;
}

.fd-stack__list > div {
  display: grid;
  grid-template-columns: 6.2rem minmax(0, 1fr);
  gap: 1rem;
  padding-block: 0.9rem;
  border-top: 1px solid var(--fd-line);
}

.fd-stack__list > div:last-child {
  border-bottom: 1px solid var(--fd-line);
}

.fd-stack__list dt {
  color: var(--fd-ink);
  font-family: var(--fd-mono);
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
}

.fd-stack__list dd {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem 0.65rem;
  margin: 0;
  color: var(--fd-muted);
  font-size: 0.72rem;
  line-height: 1.5;
}

.fd-stack__list dd span:not(:last-child)::after {
  margin-left: 0.65rem;
  color: var(--fd-accent-deep);
  content: '/';
}

.fd-footer {
  padding-bottom: 5rem;
}

.fd-contact-box {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: clamp(2rem, 5vw, 5rem);
  align-items: end;
  padding: clamp(2rem, 5vw, 4rem);
  border: 1px solid var(--fd-line);
  border-top: 3px solid var(--fd-accent);
  background:
    radial-gradient(circle at 94% 20%, rgba(229, 35, 59, 0.17), transparent 17rem),
    linear-gradient(120deg, rgba(33, 11, 17, 0.96), rgba(18, 7, 10, 0.94));
  box-shadow: 0 2.5rem 6rem rgba(0, 0, 0, 0.35);
}

.fd-contact-copy h2 {
  max-width: 24ch;
  margin-top: 0.5rem;
  font-size: clamp(2rem, 4.2vw, 3.8rem);
  line-height: 1.05;
}

.fd-contact-copy > p:last-child {
  margin: 1.2rem 0 0;
  color: var(--fd-muted);
  font-family: var(--fd-mono);
  font-size: 0.72rem;
}

.fd-contact-links {
  display: grid;
  grid-template-columns: repeat(3, minmax(7rem, 1fr));
  gap: 0.6rem;
}

.fd-contact-links a {
  display: inline-flex;
  gap: 0.55rem;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--fd-line-strong);
  color: var(--fd-ink);
  background: rgba(11, 4, 6, 0.45);
  font-size: 0.78rem;
  font-weight: 750;
  text-decoration: none;
  transition: border-color 150ms ease, background-color 150ms ease, transform 150ms ease;
}

.fd-contact-links a:hover,
.fd-contact-links a:focus-visible {
  border-color: var(--fd-accent-bright);
  background: rgba(229, 35, 59, 0.14);
  transform: translateY(-2px);
}

@media (max-width: 900px) {
  .fd-editionbar {
    grid-template-columns: 1fr;
    gap: 0;
    padding-top: 0.75rem;
  }

  .fd-nav {
    justify-content: flex-start;
    margin-top: 0.7rem;
    border-top: 1px solid var(--fd-line);
  }

  .fd-nav a:first-child {
    padding-left: 0;
  }

  .fd-masthead__grid {
    grid-template-areas:
      'kicker'
      'title'
      'standfirst'
      'byline'
      'ornament';
    grid-template-columns: minmax(0, 1fr);
    padding-block: 3.5rem 2.75rem;
  }

  .fd-title__name {
    max-width: 11ch;
    font-size: clamp(3.8rem, 13vw, 6.5rem);
  }

  .fd-standfirst,
  .fd-byline {
    margin-top: 2.4rem;
  }

  .fd-ornament {
    width: 7.5rem;
    height: 7.5rem;
    justify-self: end;
    margin-top: 2rem;
  }

  .fd-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fd-stat:nth-child(3) {
    border-top: 1px solid var(--fd-line);
  }

  .fd-stat:last-child {
    border-top: 1px solid var(--fd-line);
  }

  .fd-section-heading {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .fd-ledger {
    display: block;
  }

  .fd-ledger caption {
    display: block;
    width: 100%;
  }

  .fd-ledger colgroup {
    display: none;
  }

  .fd-ledger thead,
  .fd-ledger thead tr {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }

  .fd-ledger thead {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--fd-line);
  }

  .fd-ledger thead th:not(.fd-ledger__scale-head) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .fd-ledger .fd-ledger__scale-head {
    display: block;
    width: auto;
    padding: 0;
    border: 0;
  }

  .fd-ledger__scale-head button {
    margin: 0;
  }

  .fd-sort__mobile {
    display: inline;
  }

  .fd-ledger tbody {
    display: grid;
    gap: 1rem;
    width: 100%;
    padding: 1rem;
  }

  .fd-ledger tbody tr {
    display: block;
    min-width: 0;
    border: 1px solid var(--fd-line);
    background: rgba(11, 4, 6, 0.32);
  }

  .fd-ledger td {
    display: grid;
    grid-template-columns: minmax(7rem, 32%) minmax(0, 1fr);
    gap: 1rem;
    width: 100%;
    padding: 0.9rem 1rem;
    border-right: 0;
    text-align: left;
  }

  .fd-ledger td::before {
    color: var(--fd-muted);
    font-family: var(--fd-mono);
    font-size: 0.63rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    content: attr(data-label);
    text-transform: uppercase;
  }

  .fd-ledger__scale {
    text-align: left;
  }

  .fd-scale__copy {
    align-items: flex-start;
  }

  .fd-scale__track {
    grid-column: 2;
    margin-top: 0.2rem;
  }

  .fd-scale__track span {
    margin-left: 0;
  }

  .fd-record-grid,
  .fd-notes-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .fd-record-grid {
    gap: 5rem;
  }

  .fd-notes-grid {
    gap: 5rem;
  }

  .fd-contact-box {
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
  }

  .fd-contact-links {
    width: 100%;
  }
}

@media (max-width: 700px) {
  .fd-project-table,
  .fd-project-table tbody,
  .fd-project-table tr,
  .fd-project-table td {
    display: block;
    width: 100%;
  }

  .fd-project-table thead {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .fd-project-table tbody tr {
    padding: 0.4rem 0;
    border-bottom: 1px solid var(--fd-line-strong);
  }

  .fd-project-table td {
    display: grid;
    grid-template-columns: minmax(7rem, 34%) minmax(0, 1fr);
    gap: 0.8rem;
    padding: 0.7rem 0;
    border: 0;
  }

  .fd-project-table td::before {
    color: var(--fd-muted);
    font-family: var(--fd-mono);
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    content: attr(data-label);
    text-transform: uppercase;
  }

  .fd-project-table td > * {
    min-width: 0;
  }

  .fd-project-table td p {
    grid-column: 2;
    margin: 0.45rem 0 0;
  }

  .fd-principles__list {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .fd-shell {
    width: min(calc(100% - 2rem), 82rem);
  }

  .fd-nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fd-nav a {
    justify-content: flex-start;
    padding-inline: 0;
  }

  .fd-title__name {
    font-size: clamp(3.35rem, 16vw, 4.5rem);
    line-height: 0.88;
  }

  .fd-title__role {
    font-size: 1.55rem;
  }

  .fd-ornament {
    display: none;
  }

  .fd-stat {
    padding: 1.15rem 0.8rem;
  }

  .fd-stat dd {
    flex-direction: column;
    gap: 0.35rem;
    align-items: flex-start;
  }

  .fd-section-heading h2 {
    font-size: clamp(2.55rem, 13vw, 3.75rem);
  }

  .fd-ledger tbody {
    padding: 0.75rem;
  }

  .fd-ledger td,
  .fd-project-table td {
    grid-template-columns: minmax(6.25rem, 36%) minmax(0, 1fr);
    gap: 0.7rem;
  }

  .fd-timeline__list li {
    grid-template-columns: 3.4rem minmax(0, 1fr);
    gap: 0.75rem;
  }

  .fd-timeline__list time {
    margin-left: 0;
    font-size: 0.95rem;
  }

  .fd-stack__list > div {
    grid-template-columns: 5.4rem minmax(0, 1fr);
    gap: 0.75rem;
  }

  .fd-contact-links {
    grid-template-columns: minmax(0, 1fr);
  }

  .fd-contact-links a {
    justify-content: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fd-page *,
  .fd-page *::before,
  .fd-page *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
