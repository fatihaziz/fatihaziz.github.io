<template>
  <div class="mt-page">
    <div class="mt-grid" aria-hidden="true"></div>
    <div class="mt-glow" aria-hidden="true"></div>

    <main class="mt-shell">
      <p class="mt-eyebrow">
        <span class="mt-dot" aria-hidden="true"></span>
        fatihaziz.com
      </p>

      <h1 class="mt-title">
        Site under<span class="mt-accent"> reconstruction</span>
      </h1>

      <p class="mt-copy">
        I am rebuilding this page from scratch. The work, the systems, and the
        write-ups are being reorganised into something worth your time.
      </p>

      <dl class="mt-meta">
        <div>
          <dt>Who</dt>
          <dd>Muhammad Fatih Al-Aziz</dd>
        </div>
        <div>
          <dt>What</dt>
          <dd>Fintech platform engineer &middot; brokerage &amp; trading infrastructure</dd>
        </div>
        <div>
          <dt>Where</dt>
          <dd>Yogyakarta, Indonesia &middot; GMT+7 &middot; remote-first</dd>
        </div>
      </dl>

      <div class="mt-actions">
        <a class="mt-btn mt-btn-primary" href="mailto:m.fatihalaziz@gmail.com">
          <span class="mt-btn-icon" aria-hidden="true">&#9993;</span>
          Email me
        </a>
        <a class="mt-btn mt-btn-ghost" href="https://github.com/fatihaziz" target="_blank" rel="noopener">
          <span class="mt-btn-icon" aria-hidden="true">&#9095;</span>
          GitHub
        </a>
        <a class="mt-btn mt-btn-ghost" href="https://www.linkedin.com/in/fatih-aziz" target="_blank" rel="noopener">
          <span class="mt-btn-icon" aria-hidden="true">in</span>
          LinkedIn
        </a>
      </div>

      <p class="mt-note">
        Client tracker moved to
        <a href="https://tracker.fatihaziz.com/clients/turnkey/lunar-project">tracker.fatihaziz.com</a>
        &mdash; same path, still live.
      </p>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'fatihaziz.com - under reconstruction',
  meta: [
    { name: 'robots', content: 'noindex' },
    {
      name: 'description',
      content:
        'fatihaziz.com is being rebuilt. Muhammad Fatih Al-Aziz - fintech platform engineer, brokerage and trading infrastructure.',
    },
  ],
});
</script>

<style scoped>
.mt-page {
  --bg: #0b0406;
  --line: rgba(255, 77, 94, 0.14);
  --red: #e5233b;
  --red-bright: #ff4d5e;
  --text: #f3e6e8;
  --muted: #b99ea4;
  position: relative;
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 3rem 1.5rem;
  background: var(--bg);
  color: var(--text);
  font-family: 'Switzer', system-ui, -apple-system, sans-serif;
  overflow: hidden;
}

/* faint perspective grid: depth without a 3D engine on a holding page */
.mt-grid {
  position: absolute;
  inset: -20% -10% -30%;
  background-image:
    linear-gradient(rgba(255, 77, 94, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 77, 94, 0.07) 1px, transparent 1px);
  background-size: 64px 64px;
  transform: perspective(680px) rotateX(58deg) translateY(12%);
  transform-origin: center top;
  mask-image: radial-gradient(ellipse 60% 55% at 50% 42%, #000 20%, transparent 78%);
}

.mt-glow {
  position: absolute;
  width: min(680px, 90vw);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(229, 35, 59, 0.22), transparent 62%);
  filter: blur(12px);
  animation: mt-breathe 7s ease-in-out infinite;
}

@keyframes mt-breathe {
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.08); opacity: 1; }
}

.mt-shell {
  position: relative;
  z-index: 1;
  width: min(46rem, 100%);
  text-align: left;
}

.mt-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0 0 1.6rem;
  padding: 0.4rem 0.95rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(26, 12, 16, 0.6);
  backdrop-filter: blur(6px);
  color: var(--muted);
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.mt-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--red-bright);
  box-shadow: 0 0 10px var(--red-bright);
}

.mt-title {
  margin: 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.1rem, 6vw, 3.6rem);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.01em;
}

.mt-accent {
  background: linear-gradient(100deg, var(--red-bright), #ff9aa4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.mt-copy {
  margin: 1.1rem 0 0;
  max-width: 34rem;
  color: var(--muted);
  font-size: 1.02rem;
  line-height: 1.75;
}

.mt-meta {
  display: grid;
  gap: 1px;
  margin: 2.2rem 0 0;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--line);
  overflow: hidden;
}

.mt-meta > div {
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  gap: 1rem;
  padding: 0.85rem 1.1rem;
  background: rgba(21, 10, 13, 0.86);
}

.mt-meta dt {
  color: var(--red-bright);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-top: 0.15rem;
}

.mt-meta dd {
  margin: 0;
  color: var(--text);
  font-size: 0.94rem;
  line-height: 1.5;
}

.mt-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 2rem;
}

.mt-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.4rem;
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.mt-btn-icon { font-size: 0.85em; }

.mt-btn-primary {
  color: #fff;
  background: linear-gradient(135deg, var(--red) 0%, #8a0f1e 100%);
  box-shadow: 0 8px 26px rgba(229, 35, 59, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.16);
}

.mt-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(229, 35, 59, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.mt-btn-ghost {
  color: var(--text);
  border: 1px solid rgba(255, 77, 94, 0.34);
  background: rgba(26, 12, 16, 0.45);
}

.mt-btn-ghost:hover {
  transform: translateY(-2px);
  border-color: var(--red-bright);
  background: rgba(229, 35, 59, 0.12);
}

.mt-note {
  margin: 2.4rem 0 0;
  padding-top: 1.3rem;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.85rem;
  line-height: 1.6;
}

.mt-note a {
  color: var(--red-bright);
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 77, 94, 0.35);
}

.mt-note a:hover { border-bottom-color: var(--red-bright); }

@media (prefers-reduced-motion: reduce) {
  .mt-glow { animation: none; }
  .mt-btn { transition: none; }
}

@media (max-width: 560px) {
  .mt-meta > div {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
}
</style>
