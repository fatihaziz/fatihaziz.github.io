# CLAUDE.md

Guidance for Claude Code when working in this repo.

## Project

**fatihaziz.com** — personal portfolio.

Active build: **Aetherveil — a 2D pixel-art town-square RPG**. Visitor arrives, Mayor Halden greets them in a Stardew/Pokemon/Harvest-Moon-style dialog box, then they wander five buildings (Atelier, Vaults of Whisperleaf, Embers' Forge, The Hearthlight Inn, Beacon of Distant Roads) each containing the craftsman's work — but the visitor never sees the craftsman's name. Fully in-world RPG language.

**Source of truth:** [docs/spec/town-square-rpg.md](./docs/spec/town-square-rpg.md). Read it before any implementation work.

## Quick start

```bash
cd "D:\__CODING\03-Personals\__FRONTEND\fatihaziz.github.io"
pnpm install         # sync deps
pnpm dev             # http://localhost:3000
pnpm build-github    # static build for gh-pages
pnpm gh-publish      # deploy to fatihaziz.com
```

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Nuxt 3.19.2 (SSR off, static SSG via github_pages preset) |
| Game engine | **Phaser 3** (to install in J.0 — `pnpm add phaser`) |
| Tilemap | Phaser built-in tilemap, JSON-defined |
| Styling | TailwindCSS 3.4 for Vue HUD overlays + scoped Vue styles |
| Pkg mgr | pnpm |
| Assets | Kenney CC0 pixel packs (Tiny Town, Tiny Dungeon, Roguelike RPG, UI Pack RPG, Particle Pack) → `public/atlases/` |
| Side projects (untouched) | `/i-love-you-dian` (love letter), `/laut` (novel reader) |

## Patterns

- Vue 3 Composition API with `<script setup lang="ts">` for Vue components
- Phaser game lives in `game/` folder (NOT `composables/`)
- `<ClientOnly>` wraps the canvas — Phaser is client-only
- Vue handles content modals via an EventBus shared with Phaser
- TypeScript everywhere
- Pixel-art: integer scaling, `pixelArt: true` in Phaser config
- Build artifacts: `.nuxt/`, `.output/`, `dist/` — all ignored

## Files NOT to touch

- `pages/i-love-you-dian.vue`, `components/love-letter/*` — love letter project
- `pages/laut.vue`, `components/novel-laut/*` — novel reader project
- `.env*` files — refuse, ask user
- Font sources under `assets/font/*`

## In-world naming rules (CRITICAL)

The visitor MUST NEVER see the website owner's name. In dialog, signs, modal copy, etc, use only in-world nouns:

| Don't write | Do write |
|------------|---------|
| "Fatih's projects" | "the crafter's works", "the Atelier" |
| "skills" | "weapons of trade", "the Forge" |
| "articles" | "scrolls of Whisperleaf" |
| "about me" | "the road's chapters", "the Inn's stories" |
| "contact" | "wake a signal-flame at the Beacon" |
| "portfolio" | "the town", "Aetherveil" |

See spec §B.3 for the full alias table.

## Current state

Prior iterations both scrapped:
1. **CSS/SVG parallax RPG village** — scrapped 2026-05-11 (visual quality too low).
2. **3D TresJS golden-hour village** — scrapped 2026-05-11 (compositionally empty, not game-like).

Aetherveil is the third and committed direction. Do not reference deleted files or prior approaches.

## When implementing

1. Re-read [docs/spec/town-square-rpg.md](./docs/spec/town-square-rpg.md) section-by-section
2. Verify the current phase's acceptance criteria in §H
3. Install Phaser if missing: `pnpm add phaser`
4. Download Kenney atlas packs to `public/atlases/` per spec §G
5. Build one scene at a time; verify `pnpm dev` renders before moving on
6. Build verification: `pnpm build-github` exits 0

For deploy + setup details, see [docs/technical/deployment.md](./docs/technical/deployment.md) and [docs/technical/project-setup.md](./docs/technical/project-setup.md).
