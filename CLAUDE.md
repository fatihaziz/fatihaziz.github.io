# CLAUDE.md

Guidance for Claude Code when working in this repo.

## Project

**fatihaziz.com** — personal portfolio for Fatih Al-Aziz (CTO at TurnkeyID).

Active build: **3D interactive village** using Nuxt 3 + TresJS + Quaternius CC0 low-poly assets. Cinematic on-rails camera. Studio-Ghibli-adjacent mood. Five routable building scenes (`/workbench`, `/armory`, `/codex`, `/hearth`, `/beacon`) + hero panorama at `/`.

**Source of truth:** [docs/spec/dream-village-3d.md](./docs/spec/dream-village-3d.md). Read it before implementation work.

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
| 3D | TresJS (`@tresjs/nuxt`, `@tresjs/core`) wrapping Three.js |
| Styling | TailwindCSS 3.4 + scoped Vue styles |
| Pkg mgr | pnpm |
| Assets | Quaternius CC0 low-poly GLB models; stored under `public/models/` and `public/textures/` |
| Side projects (untouched) | `/i-love-you-dian` (love letter), `/laut` (novel reader) |

## Patterns

- Vue 3 Composition API with `<script setup lang="ts">`
- TypeScript interfaces for props + reactive state
- Composables under `composables/` (camera, scroll-progress, scene-state)
- TresJS components under `components/3d/`; 2D UI overlays under `components/ui/`
- Performance: GLB lazy-load per route, LOD on hero scene, throttled scroll handlers, GPU-only animations
- Build artifacts: `.nuxt/`, `.output/`, `dist/` — all ignored

## Files NOT to touch

- `pages/i-love-you-dian.vue`, `components/love-letter/*` — love letter project
- `pages/laut.vue`, `components/novel-laut/*` — novel reader project
- `.env*` files — refuse, ask user
- Asset font sources under `assets/font/*`

## Current state

Prior RPG-village iteration (CSS/SVG parallax) was scrapped on 2026-05-11. All RPG-village components, composables, and design docs were deleted. Do not reference deleted files or prior approach. Spec drives everything from this point.

## When implementing

1. Re-read [docs/spec/dream-village-3d.md](./docs/spec/dream-village-3d.md) section-by-section
2. Verify deps installed (`@tresjs/nuxt`, `@tresjs/core`, `three`, `@types/three`)
3. Download Quaternius assets per spec asset list, place in `public/models/`
4. Implement one scene at a time, verify `pnpm dev` renders before moving on
5. Build verification: `pnpm build-github` exits 0 + manual visit each route

For deploy + setup details, see [docs/technical/deployment.md](./docs/technical/deployment.md) and [docs/technical/project-setup.md](./docs/technical/project-setup.md).
