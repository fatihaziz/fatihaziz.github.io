<template>
  <div class="fa-landing" :class="{ 'reduced-motion': prefersReducedMotion }">
    <!-- ================= HERO ================= -->
    <section ref="heroSection" class="fa-hero" aria-label="Introduction">
      <canvas ref="heroCanvas" class="fa-hero-canvas" aria-hidden="true"></canvas>
      <div class="fa-hero-vignette" aria-hidden="true"></div>

      <div class="fa-hero-content">
        <p class="fa-eyebrow">
          <span class="fa-eyebrow-dot" aria-hidden="true"></span>
          Yogyakarta, Indonesia · UTC+7 · Remote-first
        </p>
        <h1 class="fa-hero-title">
          <span class="fa-hero-line">Muhammad Fatih Al-Aziz</span>
          <span class="fa-hero-role">Fintech Platform Engineer</span>
        </h1>
        <p class="fa-hero-sub">
          I build the systems a broker actually runs on — CRM, back office,
          trading integrations, and the reconciliation that keeps every
          figure honest. 8+ years shipping, 6+ of them where money moves.
        </p>
        <div class="fa-hero-actions">
          <a href="#work" class="fa-btn fa-btn-primary">
            <span class="fa-btn-icon" aria-hidden="true">◆</span>
            View work
          </a>
          <a href="#contact" class="fa-btn fa-btn-ghost">
            <span class="fa-btn-icon" aria-hidden="true">✉</span>
            Contact
          </a>
        </div>
        <dl class="fa-hero-stats" aria-label="Career statistics">
          <div class="fa-stat">
            <dt>Years shipping</dt>
            <dd>8+</dd>
          </div>
          <div class="fa-stat">
            <dt>Years in fintech</dt>
            <dd>6+</dd>
          </div>
          <div class="fa-stat">
            <dt>Live accounts served</dt>
            <dd>50–200</dd>
          </div>
          <div class="fa-stat">
            <dt>Commits authored</dt>
            <dd>9,200+</dd>
          </div>
        </dl>
      </div>

      <a class="fa-scroll-hint" href="#about" aria-label="Scroll to about section">
        <span class="fa-scroll-arrow" aria-hidden="true">↓</span>
      </a>
    </section>

    <!-- ================= ABOUT ================= -->
    <section id="about" class="fa-section fa-about" aria-label="About me">
      <div class="fa-container">
        <header class="fa-section-head">
          <span class="fa-section-index">01</span>
          <h2 class="fa-section-title">About</h2>
        </header>
        <div class="fa-about-grid">
          <div class="fa-about-copy">
            <p class="fa-lead">
              Former CTO of an international brokerage technology group —
              hands-on from architecture to production, not a title-only seat.
            </p>
            <p>
              I started shipping production web systems in 2018 and never
              stopped. Across two companies I grew from full-stack engineer to
              platform lead to chief technology officer, owning a live
              multi-brand retail brokerage platform: client area, CRM, back
              office, investment management, payments, KYC, and MetaTrader
              integration.
            </p>
            <p>
              My engineering values come from money: one writer per balance,
              deterministic recomputation over hand-patches, reconciliation as
              a first-class feature, and integrations that stop instead of
              guessing when upstream dies.
            </p>
            <p>
              Since 2026 I deliver the same class of work independently —
              fintech backends, brokerage integrations, and
              performance-critical Rust and Go services — while building my
              own trading infrastructure in the open.
            </p>
          </div>
          <aside class="fa-about-facts" aria-label="Quick facts">
            <div class="fa-fact-card">
              <h3>Based in</h3>
              <p>Yogyakarta, Indonesia<br />GMT+7 · remote-first</p>
            </div>
            <div class="fa-fact-card">
              <h3>Focus</h3>
              <p>Brokerage systems · Rust · Go · TypeScript · MetaTrader</p>
            </div>
            <div class="fa-fact-card">
              <h3>Currently</h3>
              <p>Independent engineer · open to senior/staff remote roles</p>
            </div>
            <div class="fa-fact-card">
              <h3>Languages</h3>
              <p>Indonesian (native) · English (professional)</p>
            </div>
          </aside>
        </div>

        <div class="fa-timeline" aria-label="Career timeline">
          <h3 class="fa-timeline-title">The road so far</h3>
          <ol class="fa-timeline-list">
            <li class="fa-timeline-item">
              <span class="fa-timeline-year">2018</span>
              <div class="fa-timeline-body">
                <h4>Full-Stack Engineer — Portofolio Indonesia</h4>
                <p>First professional role: copytrade platform, AWS operations, leading a small dev team.</p>
              </div>
            </li>
            <li class="fa-timeline-item">
              <span class="fa-timeline-year">2020</span>
              <div class="fa-timeline-body">
                <h4>Backend Engineer &amp; PM — international brokerage group</h4>
                <p>First Go services, the backend monolith, operator dashboards, payments and KYC integrations.</p>
              </div>
            </li>
            <li class="fa-timeline-item">
              <span class="fa-timeline-year">2021</span>
              <div class="fa-timeline-body">
                <h4>Chief of Product Officer</h4>
                <p>Identity, FIX API, payment management; microservices on Docker and Kubernetes.</p>
              </div>
            </li>
            <li class="fa-timeline-item">
              <span class="fa-timeline-year">2022</span>
              <div class="fa-timeline-body">
                <h4>Chief Technology Officer</h4>
                <p>Owned the live multi-brand platform end to end; led the Go→Rust migration on latency-critical paths; onsite client engagements in Malaysia, Türkiye, and the UAE.</p>
              </div>
            </li>
            <li class="fa-timeline-item">
              <span class="fa-timeline-year">2026</span>
              <div class="fa-timeline-body">
                <h4>Independent Software Engineer</h4>
                <p>Contract fintech delivery and my own trading stack — metatrader5-rs, tradether, Foyer.</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- ================= WORK ================= -->
    <section id="work" class="fa-section fa-work" aria-label="Selected work">
      <div class="fa-container">
        <header class="fa-section-head">
          <span class="fa-section-index">02</span>
          <h2 class="fa-section-title">Selected work</h2>
        </header>
        <p class="fa-work-intro">
          Production outcomes first. Employer systems are described by function
          under NDA; everything below marked <strong>open</strong> is mine and
          verifiable.
        </p>

        <div class="fa-work-featured">
          <article class="fa-feature-card">
            <div class="fa-feature-tag">Brokerage platform · confidential</div>
            <h3>Multi-brand retail brokerage, end to end</h3>
            <p>
              Owned architecture-to-production for a live platform spanning
              CRM, back office, investment management, payments, KYC, and
              MetaTrader integrations — operated continuously by a real
              broker across multiple brands.
            </p>
            <ul class="fa-feature-points">
              <li>Commission engine through 3 generations and 2 language migrations (Go → Rust), preserving deterministic recomputation.</li>
              <li>Real-time trade replication across 50–200 live accounts with fixed, proportional, multiplier, and reverse sizing.</li>
              <li>PAMM backend: investor allocation, performance fees, subscriptions, redemptions (TypeScript, Apollo GraphQL, MikroORM).</li>
            </ul>
          </article>
        </div>

        <div class="fa-work-grid">
          <article class="fa-project-card" v-for="p in projects" :key="p.name">
            <div class="fa-project-head">
              <span class="fa-project-glyph" aria-hidden="true">{{ p.glyph }}</span>
              <span class="fa-project-visibility" :class="p.open ? 'is-open' : 'is-internal'">
                {{ p.open ? 'open source' : 'internal' }}
              </span>
            </div>
            <h3 class="fa-project-name">{{ p.name }}</h3>
            <p class="fa-project-desc">{{ p.desc }}</p>
            <div class="fa-project-stack">
              <span v-for="t in p.stack" :key="t" class="fa-chip">{{ t }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ================= STACK ================= -->
    <section class="fa-section fa-stack-section" aria-label="Technology stack">
      <div class="fa-container">
        <header class="fa-section-head">
          <span class="fa-section-index">03</span>
          <h2 class="fa-section-title">Stack</h2>
        </header>
        <div class="fa-stack-grid">
          <div class="fa-stack-row" v-for="g in stackGroups" :key="g.label">
            <h3 class="fa-stack-label">{{ g.label }}</h3>
            <div class="fa-stack-items">
              <span v-for="s in g.items" :key="s" class="fa-chip">{{ s }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= CONTACT ================= -->
    <section id="contact" class="fa-section fa-contact" aria-label="Contact">
      <div class="fa-container">
        <header class="fa-section-head">
          <span class="fa-section-index">04</span>
          <h2 class="fa-section-title">Contact</h2>
        </header>
        <p class="fa-contact-lead">
          Open to senior/staff remote roles and contract work in fintech,
          trading infrastructure, and systems engineering. Fastest reply is
          email.
        </p>
        <div class="fa-contact-links">
          <a class="fa-contact-card" href="mailto:m.fatihalaziz@gmail.com">
            <span class="fa-contact-icon" aria-hidden="true">✉</span>
            <span class="fa-contact-label">Email</span>
            <span class="fa-contact-value">m.fatihalaziz@gmail.com</span>
          </a>
          <a class="fa-contact-card" href="https://github.com/fatihaziz" target="_blank" rel="noopener">
            <span class="fa-contact-icon" aria-hidden="true">⌥</span>
            <span class="fa-contact-label">GitHub</span>
            <span class="fa-contact-value">github.com/fatihaziz</span>
          </a>
          <a class="fa-contact-card" href="https://www.linkedin.com/in/fatih-aziz" target="_blank" rel="noopener">
            <span class="fa-contact-icon" aria-hidden="true">in</span>
            <span class="fa-contact-label">LinkedIn</span>
            <span class="fa-contact-value">linkedin.com/in/fatih-aziz</span>
          </a>
          <a class="fa-contact-card" href="https://fatihaziz.com" target="_blank" rel="noopener">
            <span class="fa-contact-icon" aria-hidden="true">◎</span>
            <span class="fa-contact-label">Site</span>
            <span class="fa-contact-value">fatihaziz.com</span>
          </a>
        </div>
      </div>
      <footer class="fa-footer">
        <p>© {{ year }} Muhammad Fatih Al-Aziz · Built with Nuxt + Three.js</p>
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import * as THREE from 'three';

const year = new Date().getFullYear();
const heroSection = ref<HTMLElement | null>(null);
const heroCanvas = ref<HTMLCanvasElement | null>(null);
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const projects = [
  {
    name: 'metatrader5-rs',
    glyph: '⬢',
    desc: 'Rust SDK over MetaTrader 5 Manager API — typed FFI, sandbox, capability gates, fleet client.',
    stack: ['Rust', 'FFI', 'SQLite'],
    open: true,
  },
  {
    name: 'tradether',
    glyph: '⇄',
    desc: 'Server-side MT5 copy trader: one manager session, SQLite replication state, sizing and risk controls.',
    stack: ['Rust', 'Axum', 'gRPC'],
    open: true,
  },
  {
    name: 'Foyer',
    glyph: '▣',
    desc: 'Windows-first desktop manager for AI coding agents — Wails, Go, ConPTY, xterm.js, 260+ tests.',
    stack: ['Go', 'Wails', 'TypeScript'],
    open: true,
  },
  {
    name: 'lifestyle-fatih',
    glyph: '♥',
    desc: 'Workout and diet tracker I run my own cutting program on — Go, SQLite, live on Fly.io.',
    stack: ['Go', 'SQLite', 'Fly.io'],
    open: true,
  },
  {
    name: 'cctv-livestream-manager',
    glyph: '◉',
    desc: 'Multi-tenant CCTV dashboard aggregating YouTube livestreams, with owner/admin/user roles.',
    stack: ['Go', 'Vanilla JS', 'Docker'],
    open: true,
  },
  {
    name: 'fatihaziz.com',
    glyph: '◎',
    desc: 'This site — Nuxt 3 with an interactive Three.js hero, built and operated solo.',
    stack: ['Nuxt', 'Three.js', 'Tailwind'],
    open: true,
  },
];

const stackGroups = [
  { label: 'Languages', items: ['Rust', 'Go', 'TypeScript', 'Python', 'MQL5', 'SQL'] },
  { label: 'Rust', items: ['tokio', 'actix-web', 'axum', 'sqlx', 'async-graphql', 'PyO3', 'ZeroMQ'] },
  { label: 'Go', items: ['Gin', 'gRPC', 'Clean Architecture', 'Ory Kratos', 'modernc SQLite'] },
  { label: 'TypeScript', items: ['Apollo GraphQL', 'MikroORM', 'Next.js', 'Vue 3', 'Cypress'] },
  { label: 'Data', items: ['PostgreSQL', 'MongoDB', 'Redis'] },
  { label: 'Infrastructure', items: ['Docker', 'Kubernetes', 'Helm', 'nginx', 'CI/CD', 'OpenTelemetry'] },
  { label: 'Trading', items: ['MetaTrader 5 Manager API', 'MT4/MT5 terminals', 'FIX API'] },
];

let cleanup: (() => void) | null = null;

onMounted(() => {
  const canvas = heroCanvas.value;
  const section = heroSection.value;
  if (!canvas || !section || prefersReducedMotion) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    section.clientWidth / section.clientHeight,
    0.1,
    100,
  );
  camera.position.set(0, 0.6, 7);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(section.clientWidth, section.clientHeight);

  // Central "core": icosahedron with wireframe overlay — the money engine.
  const coreGeometry = new THREE.IcosahedronGeometry(1.35, 1);
  const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0x8a0f1e,
    metalness: 0.75,
    roughness: 0.3,
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);

  const wireGeometry = new THREE.IcosahedronGeometry(1.42, 1);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xff4d5e,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });
  const wire = new THREE.Mesh(wireGeometry, wireMaterial);

  const coreGroup = new THREE.Group();
  coreGroup.add(core);
  coreGroup.add(wire);
  scene.add(coreGroup);

  // Orbiting "satellites": small emissive spheres on elliptical paths.
  const satellites: { mesh: THREE.Mesh; radius: number; speed: number; phase: number; tilt: number }[] = [];
  const satGeometry = new THREE.SphereGeometry(0.06, 16, 16);
  const satMaterial = new THREE.MeshBasicMaterial({ color: 0xff8896 });
  for (let i = 0; i < 7; i++) {
    const mesh = new THREE.Mesh(satGeometry, satMaterial);
    scene.add(mesh);
    satellites.push({
      mesh,
      radius: 2.1 + Math.random() * 1.4,
      speed: 0.25 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      tilt: (Math.random() - 0.5) * 0.9,
    });
  }

  // Background particle field — depth without weight.
  const particleCount = 900;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 24;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 4;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xc23b4a,
    size: 0.035,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Lighting: key + rim to give the core its metallic read.
  const keyLight = new THREE.PointLight(0xff4d5e, 40, 30);
  keyLight.position.set(4, 4, 5);
  const rimLight = new THREE.PointLight(0x5c7cfa, 18, 30);
  rimLight.position.set(-5, -2, -4);
  const ambient = new THREE.AmbientLight(0x1a0508, 1.4);
  scene.add(keyLight, rimLight, ambient);

  // Mouse parallax: the scene leans toward the cursor, never jumps.
  let targetX = 0;
  let targetY = 0;
  const onMouseMove = (event: MouseEvent) => {
    const rect = section.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  };
  section.addEventListener('mousemove', onMouseMove);

  let raf = 0;
  const clock = new THREE.Clock();
  const animate = () => {
    raf = requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    coreGroup.rotation.y = elapsed * 0.25;
    coreGroup.rotation.x = Math.sin(elapsed * 0.35) * 0.18;
    wire.rotation.y = -elapsed * 0.18;
    wire.rotation.z = elapsed * 0.1;

    for (const sat of satellites) {
      const angle = elapsed * sat.speed + sat.phase;
      sat.mesh.position.set(
        Math.cos(angle) * sat.radius,
        Math.sin(angle) * sat.radius * sat.tilt,
        Math.sin(angle) * sat.radius * 0.5,
      );
    }

    particles.rotation.y = elapsed * 0.015;

    camera.position.x += (targetX * 0.9 - camera.position.x) * 0.04;
    camera.position.y += (-targetY * 0.6 + 0.6 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };
  animate();

  const onResize = () => {
    const width = section.clientWidth;
    const height = section.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
  window.addEventListener('resize', onResize);

  cleanup = () => {
    cancelAnimationFrame(raf);
    section.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    coreGeometry.dispose();
    coreMaterial.dispose();
    wireGeometry.dispose();
    wireMaterial.dispose();
    satGeometry.dispose();
    satMaterial.dispose();
    particleGeometry.dispose();
    particleMaterial.dispose();
    renderer.dispose();
  };
});

onBeforeUnmount(() => {
  cleanup?.();
  cleanup = null;
});
</script>

<style scoped>
/* ============ tokens ============ */
.fa-landing {
  --bg: #0b0406;
  --bg-raised: #150a0d;
  --bg-card: #1a0c10;
  --line: rgba(255, 77, 94, 0.16);
  --line-strong: rgba(255, 77, 94, 0.4);
  --red: #e5233b;
  --red-bright: #ff4d5e;
  --red-deep: #8a0f1e;
  --text: #f3e6e8;
  --text-muted: #b99ea4;
  --font-body: 'Switzer', system-ui, -apple-system, sans-serif;
  --font-display: 'Playfair Display', Georgia, serif;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  overflow-x: clip;
}

.fa-container {
  width: min(1120px, calc(100% - 3rem));
  margin-inline: auto;
}

/* ============ hero ============ */
.fa-hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.fa-hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.fa-hero-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 80% 60% at 70% 40%, transparent 0%, rgba(11, 4, 6, 0.55) 100%),
    linear-gradient(to bottom, rgba(11, 4, 6, 0.35), transparent 30%, transparent 65%, var(--bg) 100%);
}

.fa-hero-content {
  position: relative;
  z-index: 1;
  width: min(1120px, calc(100% - 3rem));
  margin-inline: auto;
  padding-block: 6rem 4rem;
}

.fa-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0.45rem 1rem;
  background: rgba(26, 12, 16, 0.6);
  backdrop-filter: blur(6px);
}

.fa-eyebrow-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--red-bright);
  box-shadow: 0 0 10px var(--red-bright);
}

.fa-hero-title {
  margin: 1.6rem 0 0;
  font-family: var(--font-display);
  line-height: 1.04;
}

.fa-hero-line {
  display: block;
  font-size: clamp(2.2rem, 5.2vw, 4.3rem);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.fa-hero-role {
  display: block;
  margin-top: 0.35rem;
  font-size: clamp(1.5rem, 3.4vw, 2.7rem);
  font-weight: 500;
  background: linear-gradient(100deg, var(--red-bright) 10%, #ff8a94 55%, var(--red-deep) 95%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.fa-hero-sub {
  margin-top: 1.4rem;
  max-width: 34rem;
  font-size: 1.06rem;
  line-height: 1.75;
  color: var(--text-muted);
}

.fa-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin-top: 2.2rem;
}

.fa-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.85rem 1.7rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease;
}

.fa-btn-icon {
  font-size: 0.8em;
}

.fa-btn-primary {
  color: #fff;
  background: linear-gradient(135deg, var(--red) 0%, var(--red-deep) 100%);
  box-shadow: 0 8px 28px rgba(229, 35, 59, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.fa-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(229, 35, 59, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.fa-btn-ghost {
  color: var(--text);
  border: 1px solid var(--line-strong);
  background: rgba(26, 12, 16, 0.45);
  backdrop-filter: blur(6px);
}

.fa-btn-ghost:hover {
  transform: translateY(-2px);
  border-color: var(--red-bright);
  background: rgba(229, 35, 59, 0.12);
}

.fa-hero-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  margin: 3.2rem 0 0;
  max-width: 44rem;
  background: var(--line);
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
}

.fa-stat {
  background: rgba(21, 10, 13, 0.82);
  backdrop-filter: blur(8px);
  padding: 1rem 1.1rem;
}

.fa-stat dt {
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.fa-stat dd {
  margin: 0.3rem 0 0;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--red-bright);
}

.fa-scroll-hint {
  position: absolute;
  left: 50%;
  bottom: 1.6rem;
  transform: translateX(-50%);
  color: var(--text-muted);
  font-size: 1.2rem;
  text-decoration: none;
  animation: fa-bounce 2.2s ease-in-out infinite;
}

.fa-scroll-arrow {
  display: inline-block;
}

@keyframes fa-bounce {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, 8px); }
}

/* ============ sections ============ */
.fa-section {
  padding: 6.5rem 0;
}

.fa-section-head {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 2.8rem;
}

.fa-section-index {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--red-bright);
  letter-spacing: 0.2em;
}

.fa-section-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.4vw, 2.6rem);
  font-weight: 600;
}

.fa-section-title::after {
  content: '';
  display: inline-block;
  width: 4.5rem;
  height: 1px;
  margin-left: 1.2rem;
  vertical-align: middle;
  background: linear-gradient(to right, var(--red-bright), transparent);
}

/* ============ about ============ */
.fa-about-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 3rem;
  align-items: start;
}

.fa-lead {
  font-family: var(--font-display);
  font-size: 1.45rem;
  line-height: 1.45;
  color: var(--text);
  margin: 0 0 1.4rem;
}

.fa-about-copy p:not(.fa-lead) {
  color: var(--text-muted);
  line-height: 1.8;
  margin: 0 0 1.1rem;
}

.fa-about-facts {
  display: grid;
  gap: 0.9rem;
}

.fa-fact-card {
  background: var(--bg-card);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 1.1rem 1.25rem;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.fa-fact-card:hover {
  border-color: var(--line-strong);
  transform: translateY(-2px);
}

.fa-fact-card h3 {
  margin: 0;
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--red-bright);
}

.fa-fact-card p {
  margin: 0.45rem 0 0;
  line-height: 1.6;
  color: var(--text-muted);
  font-size: 0.95rem;
}

/* ============ timeline ============ */
.fa-timeline {
  margin-top: 4.5rem;
}

.fa-timeline-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  margin: 0 0 1.6rem;
}

.fa-timeline-list {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}

.fa-timeline-list::before {
  content: '';
  position: absolute;
  left: 5.4rem;
  top: 0.4rem;
  bottom: 0.4rem;
  width: 1px;
  background: linear-gradient(to bottom, var(--red-bright), var(--line));
}

.fa-timeline-item {
  display: grid;
  grid-template-columns: 4.6rem 1fr;
  gap: 2rem;
  padding-block: 0.9rem;
}

.fa-timeline-year {
  text-align: right;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--red-bright);
  padding-top: 0.15rem;
}

.fa-timeline-body {
  position: relative;
  padding-left: 1.6rem;
}

.fa-timeline-body::before {
  content: '';
  position: absolute;
  left: calc(-1.2rem - 6.5px);
  top: 0.55rem;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--bg);
  border: 2px solid var(--red-bright);
  box-shadow: 0 0 8px rgba(255, 77, 94, 0.5);
}

.fa-timeline-body h4 {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 650;
}

.fa-timeline-body p {
  margin: 0.35rem 0 0;
  color: var(--text-muted);
  line-height: 1.65;
  font-size: 0.93rem;
  max-width: 46rem;
}

/* ============ work ============ */
.fa-work {
  background: linear-gradient(to bottom, var(--bg) 0%, var(--bg-raised) 12%, var(--bg-raised) 88%, var(--bg) 100%);
}

.fa-work-intro {
  color: var(--text-muted);
  max-width: 40rem;
  line-height: 1.7;
  margin: -1.6rem 0 2.4rem;
}

.fa-work-featured {
  margin-bottom: 2rem;
}

.fa-feature-card {
  position: relative;
  background:
    radial-gradient(ellipse 90% 120% at 85% 0%, rgba(229, 35, 59, 0.14), transparent 55%),
    var(--bg-card);
  border: 1px solid var(--line-strong);
  border-radius: 18px;
  padding: 2.2rem 2.4rem;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.fa-feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right, var(--red), var(--red-deep), transparent);
}

.fa-feature-tag {
  display: inline-block;
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--red-bright);
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  padding: 0.3rem 0.85rem;
  margin-bottom: 1.1rem;
}

.fa-feature-card h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.7rem;
  font-weight: 600;
}

.fa-feature-card > p {
  color: var(--text-muted);
  line-height: 1.75;
  max-width: 52rem;
  margin: 0.9rem 0 1.2rem;
}

.fa-feature-points {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.6rem;
}

.fa-feature-points li {
  position: relative;
  padding-left: 1.4rem;
  color: var(--text-muted);
  line-height: 1.65;
  font-size: 0.95rem;
}

.fa-feature-points li::before {
  content: '◆';
  position: absolute;
  left: 0;
  color: var(--red-bright);
  font-size: 0.7rem;
  top: 0.35em;
}

.fa-work-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.2rem;
}

.fa-project-card {
  background: var(--bg-card);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 1.5rem 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
  transform-style: preserve-3d;
  will-change: transform;
}

.fa-project-card:hover {
  transform: translateY(-5px) rotateX(2deg);
  border-color: var(--line-strong);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 77, 94, 0.08);
}

.fa-project-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fa-project-glyph {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 10px;
  background: rgba(229, 35, 59, 0.12);
  border: 1px solid var(--line);
  color: var(--red-bright);
  font-size: 1.1rem;
}

.fa-project-visibility {
  font-size: 0.66rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
}

.fa-project-visibility.is-open {
  color: #7dd8a3;
  border: 1px solid rgba(125, 216, 163, 0.3);
  background: rgba(125, 216, 163, 0.08);
}

.fa-project-visibility.is-internal {
  color: var(--text-muted);
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.03);
}

.fa-project-name {
  margin: 0;
  font-size: 1.12rem;
  font-weight: 700;
  font-family: 'Cascadia Code', ui-monospace, monospace;
}

.fa-project-desc {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.65;
  font-size: 0.92rem;
  flex: 1;
}

.fa-project-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.fa-chip {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  background: rgba(255, 77, 94, 0.07);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 0.22rem 0.6rem;
}

/* ============ stack ============ */
.fa-stack-grid {
  display: grid;
  gap: 1.1rem;
}

.fa-stack-row {
  display: grid;
  grid-template-columns: 10rem 1fr;
  gap: 1.4rem;
  align-items: start;
  padding-bottom: 1.1rem;
  border-bottom: 1px solid rgba(255, 77, 94, 0.08);
}

.fa-stack-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.fa-stack-label {
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--red-bright);
  padding-top: 0.35rem;
}

.fa-stack-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

/* ============ contact ============ */
.fa-contact {
  background: radial-gradient(ellipse 70% 80% at 50% 120%, rgba(138, 15, 30, 0.25), transparent 60%);
}

.fa-contact-lead {
  color: var(--text-muted);
  max-width: 38rem;
  line-height: 1.75;
  margin: -1.6rem 0 2.4rem;
}

.fa-contact-links {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.fa-contact-card {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  background: var(--bg-card);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 1.3rem 1.4rem;
  text-decoration: none;
  color: var(--text);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.fa-contact-card:hover {
  transform: translateY(-4px);
  border-color: var(--red-bright);
  box-shadow: 0 14px 36px rgba(229, 35, 59, 0.18);
}

.fa-contact-icon {
  font-size: 1.15rem;
  color: var(--red-bright);
}

.fa-contact-label {
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.fa-contact-value {
  font-size: 0.9rem;
  word-break: break-all;
}

.fa-footer {
  margin-top: 5rem;
  padding: 1.6rem 0;
  border-top: 1px solid var(--line);
  text-align: center;
  color: var(--text-muted);
  font-size: 0.82rem;
}

/* ============ reduced motion ============ */
.reduced-motion .fa-scroll-hint {
  animation: none;
}

.reduced-motion .fa-btn,
.reduced-motion .fa-project-card,
.reduced-motion .fa-contact-card,
.reduced-motion .fa-fact-card {
  transition: none;
}

@media (prefers-reduced-motion: reduce) {
  .fa-scroll-hint { animation: none; }
}

/* ============ responsive ============ */
@media (max-width: 960px) {
  .fa-about-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .fa-work-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fa-contact-links {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fa-hero-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .fa-section {
    padding: 4.5rem 0;
  }

  .fa-work-grid {
    grid-template-columns: 1fr;
  }

  .fa-contact-links {
    grid-template-columns: 1fr;
  }

  .fa-timeline-list::before {
    left: 0.55rem;
  }

  .fa-timeline-item {
    grid-template-columns: 1fr;
    gap: 0.4rem;
  }

  .fa-timeline-year {
    text-align: left;
    padding-left: 1.6rem;
  }

  .fa-timeline-body {
    padding-left: 1.6rem;
  }

  .fa-timeline-body::before {
    left: calc(0.55rem - 6.5px);
  }

  .fa-feature-card {
    padding: 1.6rem 1.4rem;
  }

  .fa-stack-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>
