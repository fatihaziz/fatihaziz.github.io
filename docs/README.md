# Documentation Index

Personal portfolio at **fatihaziz.com** — **Aetherveil**, a 2D pixel-art town-square RPG built with Nuxt 3 + Phaser 3. Mayor Halden greets every visitor; five themed buildings hold the craftsman's work in fully in-world RPG language.

## Structure

| Path | Purpose |
|------|---------|
| [spec/town-square-rpg.md](./spec/town-square-rpg.md) | **Source of truth.** Full design + implementation spec: vision, town map, NPC dialog, building aliases, sprite atlas list, asset sources, phase plan. Read this before any work. |
| [technical/project-setup.md](./technical/project-setup.md) | Local dev commands, dependencies, configuration |
| [technical/deployment.md](./technical/deployment.md) | GitHub Pages deploy pipeline |
| [development/guidelines.md](./development/guidelines.md) | Vue 3 / TypeScript / styling conventions |

## Active build

**Aetherveil** — top-down pixel-art town. Visitor enters, Mayor Halden delivers a 5-beat welcome dialog tour, then visitor freely explores:

- **The Atelier** — workshop of ongoing crafts
- **Vaults of Whisperleaf** — library of bound scrolls
- **Embers' Forge** — weapon rack of practiced arts
- **The Hearthlight Inn** — mantel of chapter trophies
- **Beacon of Distant Roads** — four signal-flames to wake

All in-world. The owner's name never appears.

See [spec/town-square-rpg.md](./spec/town-square-rpg.md) §I for the implementation phase plan (J.0 → J.7).

## History

Two prior iterations scrapped before Aetherveil committed:
1. CSS/SVG parallax village (visual quality low)
2. 3D TresJS golden-hour village (compositionally empty, not game-like)

See git history before commit `7a38020` for prior 3D direction. Do not reference deleted spec or 3D components.
