# Dream Village 3D — Implementation Spec

**Status:** approved 2026-05-11. Source of truth for implementation.
**Scope:** complete rebuild of fatihaziz.com as 3D interactive village. Replaces all prior RPG iterations.
**Stack:** Nuxt 3.19.2 + TresJS + Three.js + Quaternius CC0 assets, deployed static via GitHub Pages.

---

## §A Vision

**Single sentence:** A small low-poly village seen at golden hour, where the visitor glides on rails through five buildings — each opens into its own scene that tells one chapter of Fatih's craft.

**Mood references:**
- Studio Ghibli colour & atmosphere (Howl's Moving Castle skies, Spirited Away spirit-town quietness, Kiki's late-afternoon warmth)
- Low-poly geometry, *not* painterly textures
- Soft fog, warm rim lighting, long shadows
- No HUD chrome. Diegetic UI only.

**Anti-patterns (forbidden):**
- Generic "modern portfolio" gradients
- Emoji as art
- Hard-edged neon
- Default Three.js examples vibe (lab demo aesthetic)
- Loading spinners (use scene-load fade-in only)

**Visitor experience:** scroll on `/` → camera glides over village from hilltop → buildings sized in view show what they hold → click building → camera flies into that building's neighborhood → route changes → that building's scene resolves around the camera → scroll within = unfold that chapter.

---

## §B Architecture

### B.1 Tech stack

| Concern | Choice | Why |
|---------|--------|-----|
| Framework | Nuxt 3.19.2, `ssr: false`, static SSG via `--preset github_pages` | Existing. Works for static deploy. |
| 3D wrapper | TresJS (`@tresjs/nuxt` + `@tresjs/core`) | Declarative Vue3 components for Three.js. Active maintenance. SSR-safe in `ssr: false` mode. |
| Renderer | Three.js (transitively via TresJS) | Industry-standard WebGL. |
| Asset loader | `@tresjs/cientos` `useGLTF` composable | Lazy GLB load with Suspense. |
| Asset format | GLB (binary glTF) | Single-file, embedded textures, browser-native. |
| Asset source | Quaternius (quaternius.com) — CC0 | Stylized low-poly, consistent style across packs. |
| Camera control | Custom `useCameraRig` composable, no OrbitControls | Cinematic on-rails per spec. Free-orbit forbidden. |
| State | Composables + `provide/inject` per-scene; no Pinia for now | Local scene state is enough. |
| Styling | TailwindCSS 3.4 for 2D overlays + scoped Vue styles | Existing. |
| Type | TypeScript everywhere, `<script setup lang="ts">` | Existing convention. |

### B.2 Repo layout (target)

```
.
├── app.vue                       # mount NuxtPage + persistent UI
├── nuxt.config.ts                # add @tresjs/nuxt module
├── pages/
│   ├── index.vue                 # /  — hero panorama
│   ├── workbench.vue             # /workbench — projects
│   ├── armory.vue                # /armory — skills
│   ├── codex.vue                 # /codex — writings
│   ├── hearth.vue                # /hearth — about
│   └── beacon.vue                # /beacon — contact
├── components/
│   ├── 3d/
│   │   ├── VillageScene.vue      # hero panorama
│   │   ├── BuildingMarker.vue    # billboarded label + hit-target on hero
│   │   ├── WorkbenchScene.vue
│   │   ├── ArmoryScene.vue
│   │   ├── CodexScene.vue
│   │   ├── HearthScene.vue
│   │   ├── BeaconScene.vue
│   │   ├── env/
│   │   │   ├── SkyDome.vue       # gradient sky + sun disc
│   │   │   ├── GroundPlane.vue   # textured plane + fog
│   │   │   └── Lighting.vue      # directional + ambient + hemisphere
│   │   └── primitives/
│   │       ├── GlbModel.vue      # generic GLB loader wrapper
│   │       └── ScrollText3d.vue  # text-on-mesh for diegetic labels
│   └── ui/
│       ├── ScrollHint.vue        # subtle "scroll" indicator
│       ├── RouteCrumb.vue        # current building name (corner)
│       └── BackToVillage.vue     # button on building routes
├── composables/
│   ├── useCameraRig.ts           # cinematic on-rails camera (per spec §D)
│   ├── useScrollProgress.ts      # window scroll -> 0..1 progress
│   ├── useSceneRoutes.ts         # static array of building defs
│   └── useGoldenHour.ts          # shared lighting/colour constants
├── public/
│   ├── models/                   # GLB files, organized per scene
│   │   ├── village/              # hero scene
│   │   ├── workbench/
│   │   ├── armory/
│   │   ├── codex/
│   │   ├── hearth/
│   │   └── beacon/
│   ├── textures/                 # if separate textures needed
│   └── assets/rpg/CREDITS.md     # Quaternius attribution
└── docs/spec/dream-village-3d.md # this file
```

### B.3 Module install (next /grind, not this run)

```bash
pnpm add three @tresjs/core @tresjs/nuxt @tresjs/cientos
pnpm add -D @types/three
```

`nuxt.config.ts` additions:

```ts
modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@tresjs/nuxt'],
build: { transpile: ['three'] },
vite: {
  ...existing,
  optimizeDeps: { include: ['three'] },
},
```

### B.4 State boundaries

- `useCameraRig` — owns camera position/target, exposes `setRoutePath()`, `scrollTo(progress)`
- `useScrollProgress` — single source of scroll 0..1 per route, throttled to rAF
- `useSceneRoutes` — static config array, imported where needed
- Each scene component owns ONLY its local mesh refs, hover/click state, content data
- No global store. If shared state is ever needed: add Pinia in a later spec amendment.

---

## §C Routes

| Path | File | Purpose | Camera home |
|------|------|---------|-------------|
| `/` | `pages/index.vue` | Hero panorama: village from hilltop. 5 buildings visible at distance, labelled. | Eye-level on hilltop, 30m above ground, 80m back from village centre |
| `/workbench` | `pages/workbench.vue` | Projects scene: workshop interior + project banners | Outside workshop door, then dolly-in on scroll |
| `/armory` | `pages/armory.vue` | Skills scene: weapons-rack arrangement of tech | Centre of armory, slow yaw orbit |
| `/codex` | `pages/codex.vue` | Writings scene: lecturn with floating book + page-turn for each article | In front of lecturn |
| `/hearth` | `pages/hearth.vue` | About scene: fireplace nook + timeline-along-mantel | Across from hearth |
| `/beacon` | `pages/beacon.vue` | Contact scene: tower with lit beacon + signal-line to each socials icon | Base of tower looking up |

All routes share `app.vue` layout: persistent UI overlay (RouteCrumb top-left, BackToVillage top-right except `/`).

---

## §D Camera narrative

### D.1 Cinematic on-rails — definition

- User has **no** free camera control (no orbit, no pan).
- Two inputs drive camera: **scroll position** and **clicks**.
- Camera moves along pre-defined Catmull-Rom splines (paths in 3D space).
- Each spline = sequence of waypoints `{position, lookAt, fov, t}` where `t` is normalized 0..1 progress.

### D.2 useCameraRig API

```ts
interface CameraWaypoint {
  pos: [number, number, number]
  look: [number, number, number]
  fov?: number  // default 45
}

useCameraRig() returns {
  setPath(waypoints: CameraWaypoint[]): void   // installs new spline
  setProgress(t: number): void                  // 0..1, drives interpolation
  flyTo(waypoint: CameraWaypoint, ms: number): Promise<void>  // one-shot transition (click->route)
  cameraRef: Ref<PerspectiveCamera | null>
}
```

Catmull-Rom interpolation via `THREE.CatmullRomCurve3` for position; SLERP via `THREE.Quaternion.slerp` for look-at orientation.

### D.3 Scroll mapping

On every page:
- `useScrollProgress` returns `progress: Ref<number>` clamped to `[0, 1]` from `window.scrollY / (document.body.scrollHeight - window.innerHeight)`
- Each page declares `pageHeight` via a `min-height` on an empty `scroll-track` div so users have *something* to scroll against (the 3D canvas itself is fixed)
- Scroll progress → `cameraRig.setProgress(progress.value)` in a `watchEffect`

Per-page `pageHeight` (in viewport multiples):
- `/` 4× (4 viewport-heights of scroll = ~4s of swipe on trackpad)
- `/workbench` 5× (long, projects list)
- `/armory` 3×
- `/codex` 4× (one article per page-turn)
- `/hearth` 4× (timeline reveal)
- `/beacon` 2× (short)

### D.4 Click-to-enter transition

On `/`, clicking a building marker fires:

1. `cameraRig.flyTo(building.entryWaypoint, 1800)` — 1.8s ease-in-out
2. After flyTo resolves: `router.push(building.route)`
3. Target route's mounted hook installs its scroll spline from `progress=0`
4. Visually: camera position is preserved across route swap (same camera state survives) → seamless

The reverse (BackToVillage button on a route): flyTo hero entry waypoint, then `router.push('/')`.

### D.5 Per-route splines (high-level — full waypoints in implementation phase)

| Route | Spline shape | Why |
|-------|-------------|-----|
| `/` | Hilltop pan: start NE of village, sweep S → SW, ending facing village centre | Establishes geography, hints at all 5 buildings |
| `/workbench` | Approach + dolly-in through doorway, then slow truck-right past project banners | Linear narrative: enter → see → walk past |
| `/armory` | Slow circular orbit at fixed height around weapon-rack centre | Skills are categorical, not narrative — orbit reveals each |
| `/codex` | Static position, but camera *zooms* on book; scroll triggers page-turns | Reading is intimate — minimal camera movement |
| `/hearth` | Tracking shot along mantel left → right; each timeline node grows as camera passes | Time flowing left-to-right |
| `/beacon` | Tilt-up from base of tower to lit beacon at top | "Signal goes up and out" |

---

## §E Scene specs

### §E.0 Hero — `/`

**Camera home:** `pos: [40, 30, 50], look: [0, 5, 0], fov: 50`

**Geometry:**
- Hilltop platform (5×5m, slightly raised) — camera sits here
- Village ground plane (200×200m, textured ground)
- 5 buildings arranged in a loose pentagonal cluster, centre offset 30m from hilltop
- Path connecting buildings (low-poly cobblestone)
- Scattered nature: ~30 trees (Quaternius nature pack), ~20 bushes, 4 lamp posts

**Lighting:**
- Directional sun: pos `[100, 80, 60]`, intensity `1.2`, colour `#FFC78F` (golden hour amber)
- Ambient: intensity `0.4`, colour `#7A9BC0` (cool sky bounce)
- Hemisphere: sky `#FFE4B5`, ground `#5C6E4A`, intensity `0.3`
- Fog: exponential, density `0.008`, colour `#FFCFA0`

**Sky:**
- Gradient dome (top `#3F5E8C` → middle `#FFB37A` → horizon `#FFE5C5`)
- Sun disc (sprite at sun position)
- Optional: 2-3 distant cloud puffs (low-poly)

**Interactive elements:**
- 5 `BuildingMarker` instances, one per building. Each is:
  - Invisible hit-box mesh (raycast target)
  - Floating label (Text3D) showing building name
  - On hover: label brightens + soft glow ring under building
  - On click: triggers click-to-enter (§D.4)

**Content overlay (2D HTML):**
- Top-centre: `Fatih Al-Aziz` name, `Code & systems. AI · API · trade-bots. Go · Rust · Python · TS.` subtitle
- Bottom-centre: `Scroll to look. Click a building to enter.` (ScrollHint, fades out after 3s)

**Scroll narrative:** camera pans hilltop SE → SW, takes ~4s on trackpad. Sun sweeps slightly. Returns to start at scroll=1 (looped feel).

### §E.1 Workbench — `/workbench` (Projects)

**Building:** workshop with a forge-like extension. Quaternius "Medieval Buildings" workshop or castle-blacksmith model.

**Content (projects):**
1. **TurnkeyID** — platform CTO leads. Tagline: "Identity for Indonesia's digital backbone." Stack: Go, microservices, K8s, AWS.
2. **Trade-bots & EAs** — autonomous trading systems. Tagline: "Robots that don't sleep." Stack: Python, MT5/MT4 APIs, Rust hot-paths.
3. **AutoSSL tools & libs** — certificate automation. Tagline: "Renewing the web's locks." Stack: Go, Let's Encrypt ACME.
4. **Microservices stacks** — internal platforms. Tagline: "Small services, big traffic." Stack: Go, gRPC, NATS.
5. **AI / API integrations** — wrappers + agents. Tagline: "Models that ship." Stack: TS, OpenAI/Anthropic SDKs, vector DBs.

**Layout:**
- Workshop interior, ~20×10m floor
- 5 project banners hanging along right wall (one per project), each ~3m tall
- Workbench in centre with tool-models on it (visual decoration)
- Forge glow on left, smoke particle wisps

**Camera spline (5 waypoints):**
- `t=0.0` outside door, looking in
- `t=0.2` inside, near workbench
- `t=0.4` panning right, project 1 fills frame
- `t=0.6` project 3
- `t=0.8` project 5
- `t=1.0` looking back at door (exit cue)

**Banner content:** Each banner = mesh with name in 3D text + tagline in HTML overlay positioned via CSS2DRenderer or Tres `<Html>`-style portal. Click banner → modal with project detail (optional — can be Phase 2).

### §E.2 Armory — `/armory` (Skills)

**Building:** small stone armory. Quaternius castle-kit "armory" or generic stone-walled room.

**Content (skills, grouped):**
- **Languages:** TypeScript (5/5), Rust (4/5), Python (5/5), Go (5/5), JS (5/5)
- **Infra:** Docker (5/5), Kubernetes (4/5), AWS (4/5), Linux (5/5)
- **Web:** Vue/Nuxt (5/5), Node.js (5/5), React (3/5)
- **Data:** PostgreSQL (4/5), Redis (4/5), vector DBs (3/5)
- **Cross-cutting:** API design (5/5), system architecture (4/5), team lead (4/5)

**Layout:**
- Circular room ~12m diameter
- 5 weapon racks, one per skill group, arranged around centre
- Each rack holds 4-5 "weapons" (each = stylized 3D object representing one skill: sword=lang, hammer=infra, shield=defense/security, bow=web/ranged, tome=data)
- Skill level visualized as `mesh.scale.y` (taller = higher) and glow intensity
- Central pillar with rotating logo / heraldic emblem

**Camera spline:** orbit at radius `8m`, height `2m`, completing one full loop over scroll 0..1. `look` always at centre.

**Interaction:** Hover a weapon → tooltip via `<Html>` portal showing skill name + level + brief context. Click weapon → modal with detail and years of practice. (Phase 2.)

### §E.3 Codex — `/codex` (Writings)

**Building:** small chapel-library. Quaternius castle-kit chapel works, or library model.

**Content:** Medium articles from medium.com/@m.fatihalaziz.
Articles must be fetched at build-time (static-friendly): write a small build script `scripts/fetch_medium.ts` that pulls Medium RSS at build, caches to `assets/data/articles.json`. If RSS unreachable at build time, fall back to checked-in JSON.

Each article entry: `{ title, subtitle, dek, publishedAt, url, readingTimeMin, slug }`.

**Layout:**
- Lecturn in centre, floating open book on top
- Book pages turn on scroll (procedural Catmull-Rom bend on a Plane mesh)
- Each scroll-step = next article
- Side walls: shelves with quill+ink decor, candles

**Camera:** static position front-of-lecturn, FOV narrows slightly on scroll to amplify "zoom in to read"

**Page rendering:** Article title 3D text on the page mesh; subtitle + read-time + CTA-link rendered as `<Html>` overlay positioned on page surface. Click "Read on Medium" → opens article URL in new tab.

### §E.4 Hearth — `/hearth` (About)

**Building:** tavern interior with hearth. Quaternius medieval-pack tavern or inn.

**Content (timeline, Fatih's journey):**
- 2017 — National Web Dev Competition (origin story)
- 2018 — First developer role at Portofolio Indonesia
- 2020 — Backend lead
- 2022 — CTO at TurnkeyID (age 22)
- 2025 — Current: leading team, building platform

Each milestone has: year, headline, 1-2 sentence dek, optional artifact (small 3D prop on mantel — trophy, laptop, blueprint, gear, beacon).

**Layout:**
- Tavern interior, fireplace on far wall
- Long mantel above hearth, ~6m wide
- Timeline arranged left-to-right along mantel
- Each milestone = small 3D prop + floating year label
- Tables, chairs, ambient warmth, fire particle sprite

**Camera:** tracking dolly left → right along mantel. As camera passes each milestone, that prop scales up `0.3 → 1.0` and label fades in.

**Personal facts to include in dek:** Indonesia / Dubai based. Anime fan. Coffee. "Invest in yourself, then in others." (philosophy quote, used sparingly — once max).

### §E.5 Beacon — `/beacon` (Contact)

**Building:** lighthouse / signal tower. Quaternius lighthouse or tall tower model.

**Content:** four contact channels:
- GitHub — `github.com/fatihaziz`
- LinkedIn — `linkedin.com/in/fatih-aziz`
- Medium — `medium.com/@m.fatihalaziz`
- Email — `m.fatihalaziz@gmail.com`

**Layout:**
- Tower in centre, 20m tall
- Lit brazier at top (point light + emissive material + particle wisp)
- 4 signal-lines emanating from brazier outward (Line meshes) to floating icons in the air around the tower
- Each icon is a 3D-ish flat plane with the channel's logo (SVG textured)

**Camera spline:** tilt-up from base (look at door), to mid (look at first icons), to top (look at brazier). Single arc.

**Interaction:** Click icon → opens external URL in new tab. Hover → icon scales 1.2× + lights up its signal line.

**Final scroll position (t=1):** camera at top, brazier centre-frame, with a soft CTA HTML overlay "Send a signal." linking to mailto:.

---

## §F Assets

### F.1 Quaternius packs (all CC0, license includes attribution-not-required but include credit anyway)

| Pack | Used for | URL |
|------|---------|-----|
| Ultimate Buildings Pack | Workbench, Armory, Codex, Hearth shells | https://quaternius.com/packs/ultimatebuildings.html |
| Ultimate Modular Castle Kit | Armory walls, Codex chapel, Beacon tower | https://quaternius.com/packs/ultimatemodularcastle.html |
| Ultimate Nature Pack | Hero trees, bushes, ground details | https://quaternius.com/packs/ultimatenature.html |
| Ultimate Stylized Animals Pack (optional) | Hero scene cat/bird if desired (one cat near workshop, one bird flock overhead) | https://quaternius.com/packs/ultimatestylizedanimals.html |
| Ultimate Weapons Pack | Armory weapon-rack items | https://quaternius.com/packs/ultimateweapons.html |

### F.2 Storage convention

```
public/models/
├── village/
│   ├── ground.glb
│   ├── tree-pine.glb
│   ├── tree-oak.glb
│   ├── bush.glb
│   ├── lamp-post.glb
│   └── cobblestone-path.glb
├── workbench/
│   ├── workshop-shell.glb
│   ├── workbench.glb
│   ├── forge.glb
│   └── banner-plane.glb       # reusable, textured per project at runtime
├── armory/
│   ├── armory-shell.glb
│   ├── weapon-rack.glb
│   ├── sword.glb
│   ├── hammer.glb
│   ├── shield.glb
│   ├── bow.glb
│   └── tome.glb
├── codex/
│   ├── chapel-shell.glb
│   ├── lecturn.glb
│   ├── book-open.glb
│   └── candle.glb
├── hearth/
│   ├── tavern-shell.glb
│   ├── fireplace.glb
│   ├── mantel.glb
│   ├── trophy.glb
│   ├── laptop.glb
│   ├── blueprint.glb
│   └── gear.glb
└── beacon/
    ├── tower-shell.glb
    ├── brazier.glb
    └── icon-plane.glb         # reused, textured per channel
```

### F.3 Texture / icon plates

Channel icons (Beacon scene): use the channels' brand SVGs (GitHub octocat, LinkedIn "in", Medium "M", envelope) on a flat textured plane. SVGs converted to PNG at 512×512 at build time, served from `public/textures/icons/`.

### F.4 Attribution file

`public/assets/rpg/CREDITS.md`:

```markdown
# Asset Credits

## 3D Models
All models from Quaternius (quaternius.com), licensed CC0.
- Ultimate Buildings Pack
- Ultimate Modular Castle Kit
- Ultimate Nature Pack
- Ultimate Weapons Pack
- Ultimate Stylized Animals Pack

## Logos
- GitHub mark (MIT-ish, see github.com/logos)
- LinkedIn mark (LinkedIn Brand Guidelines)
- Medium mark (Medium Brand Guidelines)
- Envelope icon: hand-drawn / Heroicons (MIT)

## Fonts
Existing project fonts (Mangiola, Mondapick, etc) — see assets/font/*/License.txt per family.
```

---

## §G Performance plan

### G.1 Loading budget

- Hero scene total GLB: < 4 MB compressed
- Each building scene: < 3 MB
- Total site weight first-route (`/`): < 6 MB including JS bundle
- Largest mesh: < 500 kB; if larger, split or LOD

### G.2 Loading strategy

- Hero scene preloads on `/` mount
- Building scenes lazy-load on route entry. `useGLTF` with Suspense fallback = soft fade.
- Shared assets (ground, trees, lamp posts) cached via Three's cache (TresJS handles this automatically when same URL used twice)
- Preload hint: on `/` mount, after hero settles (idle callback), prefetch first building's shell GLB

### G.3 Render budget

- Target: 60 fps on mid-range desktop (integrated GPU), 30 fps on low mobile
- Triangle budget per scene: < 80k visible
- Drawcalls: < 50 per frame
- Use `frustumCulled: true` on all meshes
- Instanced meshes for repeated nature (trees, bushes): `THREE.InstancedMesh`

### G.4 Mobile fallback

- If `window.innerWidth < 640`: render at `devicePixelRatio = 1` (no retina), disable fog density tween, simplify lighting to ambient + directional only
- If WebGL2 unavailable or `navigator.hardwareConcurrency < 4`: fall back to static panorama PNGs in `<img>` tags with parallax-on-scroll only. Spec the fallback in implementation phase.

### G.5 Suspense + scene fade-in

- `<TresCanvas>` wrapped in `<Suspense>` — first paint shows sky+lighting only, then GLB-loaded meshes fade in `opacity 0 → 1` over 600ms via material.transparent toggle.

---

## §H Build & deploy

### H.1 nuxt.config.ts additions

```ts
modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@tresjs/nuxt'],
ssr: false,                                  // already in place
build: { transpile: ['three'] },
vite: {
  optimizeDeps: { include: ['three'] },
  // keep existing #app-manifest stub
  resolve: { alias: { '#app-manifest': 'unenv/dist/runtime/mock/empty.mjs' } },
},
```

### H.2 Static SSG considerations

- `ssr: false` means Nuxt builds an SPA + prerendered route HTMLs. The 3D canvas mounts client-side; the HTML shell has the title + meta tags.
- Each route gets its own `index.html` via Nuxt's crawler (already producing `/workbench/index.html` etc).
- 404 fallback: existing `/200.html` + `/404.html` setup works for SPA fallback on gh-pages.

### H.3 Asset routing

- GLBs in `public/models/` are served as static at `/models/...` — TresJS `useGLTF('/models/village/ground.glb')`.
- Vite does not process `public/` assets — they're copied as-is. No bundler hash on filenames; rely on long-cache + manual cache-bust on file rename.

### H.4 Deploy

Existing pipeline holds:

```bash
pnpm build-github   # generates .output/public
pnpm gh-publish     # gh-pages -d .output/public --cname fatihaziz.com
```

No change.

---

## §I Acceptance

### I.1 This run (spec + nuke)

- [x] All RPG-village artifacts deleted (14 files via git rm)
- [x] package.json reverted (no @playwright/test, no test:smoke scripts)
- [x] docs/README.md rewritten (no stale refs)
- [x] CLAUDE.md rewritten (points to this spec)
- [x] This spec exists and is complete (you are reading it)
- [ ] `pnpm install && pnpm build-github` exits 0 post-nuke

### I.2 Implementation phase (next /grind run, see §J)

- All 6 routes render their 3D scene without console errors
- Scroll on each route drives camera per spec
- Click building on `/` flies camera + routes correctly
- `BackToVillage` button on each building returns to `/`
- Build passes (`pnpm build-github` exits 0)
- All asset files in `public/models/` correctly attributed in CREDITS.md
- Mobile (≤640 px) loads without crash (perf fallback per §G.4)
- No prior RPG-village component or composable resurrected

---

## §J Implementation phases (parallel-friendly)

Designed so 5 building scenes can be built independently by different sessions/builders once the foundation is in place.

### J.0 Foundation (sequential, blocking)

Single session. Estimated ~1 /grind cycle. No parallelism possible.

1. Install deps (`@tresjs/nuxt`, `@tresjs/core`, `@tresjs/cientos`, `three`, `@types/three`)
2. Update `nuxt.config.ts` (module + transpile)
3. Build `composables/useCameraRig.ts` (camera spline interpolator)
4. Build `composables/useScrollProgress.ts`
5. Build `components/3d/env/SkyDome.vue`, `GroundPlane.vue`, `Lighting.vue`
6. Build `components/3d/primitives/GlbModel.vue` wrapper
7. Build empty `app.vue` shell + persistent `RouteCrumb` + `BackToVillage` UI
8. Verify: `pnpm dev` shows an empty TresCanvas with sky + ground, no errors
9. Download initial Quaternius pack (Buildings + Nature + Castle) to `public/models/`, organize per §F.2

### J.1 Hero scene `/` (sequential after J.0)

Single session. Estimated ~1 /grind cycle.

1. Implement `components/3d/VillageScene.vue` with ground + 5 building placeholder cubes (real GLBs in J.2-J.6 swap in)
2. Implement `BuildingMarker.vue` with hit-target + label
3. Wire scroll-to-camera-progress on `pages/index.vue`
4. Wire click-to-flyTo-then-route
5. Verify: scroll pans camera, click marker navigates to corresponding route

### J.2–J.6 Building scenes (PARALLEL)

Each scene is a self-contained `/grind` task that depends only on J.0 + J.1 foundation. Can be built concurrently in separate sessions.

| Phase | Scene | Scope | Spec ref |
|-------|-------|-------|---------|
| J.2 | Workbench `/workbench` | Workshop interior, 5 project banners, scroll dolly | §E.1 |
| J.3 | Armory `/armory` | Skills room with weapon-rack orbit | §E.2 |
| J.4 | Codex `/codex` | Lecturn + page-turn book, Medium articles fetch | §E.3 |
| J.5 | Hearth `/hearth` | Tavern + timeline mantel | §E.4 |
| J.6 | Beacon `/beacon` | Tower + signal lines + socials icons | §E.5 |

Per building, the /grind contract for that sub-task is:
- ACCEPTANCE: route renders, scroll drives camera per spec, content data loaded, no console errors, build passes
- SCOPE: `pages/<building>.vue`, `components/3d/<Building>Scene.vue`, `public/models/<building>/*`
- VERIFICATION: `pnpm build-github` + `pnpm dev` manual visit

### J.7 Polish + integration (sequential after J.6)

- Mobile fallback (§G.4)
- Article fetcher script (`scripts/fetch_medium.ts`)
- CREDITS.md finalization
- Performance pass: instanced meshes, draw-call audit
- Accessibility: keyboard fallback for click-only buildings (Tab + Enter), reduced-motion media query disables camera tweens
- Final deploy: `pnpm gh-publish`

### J.8 Open polish (post-launch)

Items deferred from initial launch, listed in this spec for future amendment:
- Audio: ambient wind on `/`, fire crackle on `/hearth`, tower-bell on `/beacon`. Volume control in corner. Off by default.
- Particle effects: forge sparks, fireflies on `/hearth`, beacon ember rise
- Loading screen: replace generic Suspense fallback with a Ghibli-style "iris in" wipe
- LOD on hero trees
- Picture-in-picture mini-map on `/` showing village from top-down (debug aid → maybe ship as easter egg)

---

## §K Open questions (must answer before implementation phase)

Decisions deferred to user before J.0 starts. Each unblocks a specific implementation step.

| ID | Question | Blocks | Default if no answer |
|----|---------|--------|---------------------|
| K.1 | Final TresJS version pin (latest minor at install time) | J.0 install | Latest stable on day of impl |
| K.2 | Asset compression: glTF Draco-compress GLBs? (-50% size, +CPU decompress time) | J.0 install | Yes if any GLB > 800 kB |
| K.3 | Project list final order in §E.1 — is TurnkeyID first correct? Any project to swap in/out? | J.2 | Order as written |
| K.4 | Skill levels in §E.2 — re-rate Rust/K8s/AWS? | J.3 | Use values as written |
| K.5 | Medium article cap — show all or top-N most recent? | J.4 | Latest 8 |
| K.6 | Timeline 2026 entry — anything to add for "current year"? | J.5 | "2025 — leading team, building platform" stays |
| K.7 | Email reveal — show plaintext or obfuscate against scrapers? | J.6 | Plaintext (already public on GitHub profile) |
| K.8 | Audio (§J.8) — ship in initial launch or post? | J.7 final | Post |
| K.9 | Domain at launch — fatihaziz.com straight away or staging on github.io subpath first? | J.7 deploy | Straight to fatihaziz.com |

---

## §L Change log

| Date | Change |
|------|-------|
| 2026-05-11 | Spec created. All prior RPG-village artifacts deleted in same session. Implementation begins next /grind run. |
