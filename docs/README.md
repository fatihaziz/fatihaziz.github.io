# Documentation Index

Personal portfolio at **fatihaziz.com** — a 3D interactive village built with Nuxt 3 + TresJS + Quaternius low-poly assets. Cinematic on-rails camera, Studio-Ghibli-adjacent mood.

## Structure

| Path | Purpose |
|------|---------|
| [spec/dream-village-3d.md](./spec/dream-village-3d.md) | **Source of truth.** Complete design + implementation spec for the 3D village. Read this first. |
| [technical/project-setup.md](./technical/project-setup.md) | Local dev commands, dependencies, configuration |
| [technical/deployment.md](./technical/deployment.md) | GitHub Pages deploy pipeline |
| [development/guidelines.md](./development/guidelines.md) | Vue 3 / TypeScript / styling conventions |

## Active deliverable

3D village at `/` with 5 routable building scenes:

- `/` Hero panorama (village from elevated path, golden-hour mood)
- `/workbench` Projects
- `/armory` Skills
- `/codex` Writings
- `/hearth` About / journey
- `/beacon` Contact

All scenes built with TresJS declarative components. Asset source: Quaternius CC0 low-poly packs.

See [spec/dream-village-3d.md](./spec/dream-village-3d.md) for full architecture, scene specs, camera narrative, asset list, perf plan, and implementation phases.

## History

Prior RPG-village iteration (parallax SVG / emoji approach) was scrapped — see git history before commit `26b74f7` if needed. Spec is the new ground truth; do not reference deleted docs.
