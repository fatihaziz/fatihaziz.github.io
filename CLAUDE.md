# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚀 Quick Start

**Project Directory**: Always run commands from:
```bash
cd "D:\__CODING\03-Personals\__FRONTEND\fatihaziz.github.io"
```

**Essential Commands**:
- `pnpm dev` - Start development server
- `pnpm build-github` - Build for GitHub Pages
- `pnpm gh-publish` - Deploy to fatihaziz.com

## 📁 Documentation Structure

The complete project documentation is organized in `/docs/` for better maintainability:

### 🏗️ Architecture & Technical
- [**Project Setup**](./docs/technical/project-setup.md) - Commands, dependencies, configuration
- [**Component Architecture**](./docs/architecture/components.md) - Vue component structure and patterns
- [**Animation Strategy**](./docs/technical/animation-strategy.md) - Performance-optimized animations
- [**Deployment Guide**](./docs/technical/deployment.md) - GitHub Pages deployment

### 🎨 Design & Concept
- [**RPG Theme System**](./docs/design/rpg-theme.md) - Core design philosophy and village concept
- [**Interactive Mechanics**](./docs/design/interactive-mechanics.md) - Detailed interaction designs
- [**Storytelling System**](./docs/design/storytelling-system.md) - Discovery and narrative mechanics

### 👨‍💻 Development
- [**Development Guidelines**](./docs/development/guidelines.md) - Vue 3, TypeScript, and styling standards
- [**Current Progress**](./docs/development/current-progress.md) - Active development status

### 📚 Complete Documentation Index
See [**docs/README.md**](./docs/README.md) for full navigation and structure overview.

## 🎯 Project Overview

**RPG Village Portfolio** - A Nuxt 3 personal portfolio with Studio Ghibli-inspired RPG theme:
- **Framework**: Nuxt 3.13.2 (Vue 3 Composition API)
- **Styling**: TailwindCSS with custom RPG color scheme
- **Deployment**: GitHub Pages → fatihaziz.com
- **Theme**: "Welcome home adventurer! Let's go explore my city!"

## 🔄 Current Development Focus

**Chapter I: Hero Section Interactive Elements**
- Town Square discovery tutorial with parallax effects
- Interactive elements: Village well, street lamp, flying birds, village cat
- Atmospheric controls: Day/night cycle, weather system
- See [current progress](./docs/development/current-progress.md) for detailed status

## 📐 Development Patterns

### Vue 3 Standards
- Composition API with `<script setup>`
- TypeScript interfaces for all props and data
- Event-driven parent-child communication
- Local reactive state management

### Performance Guidelines
- GPU-accelerated animations only (transform, opacity, filter)
- TailwindCSS utilities first, scoped styles for complex animations
- Custom font system via `build/import_fonts.ts`
- Optimized for static site generation

## 🏗️ Component Architecture Quick Reference

```
App.vue
├── loading_screen.vue (Cloud formation system - ✅ Complete)
├── TownSquare.vue (Hero section - 🚧 In Progress)
│   ├── ParallaxLayers.vue
│   ├── InteractiveElements.vue
│   └── DiscoverySystem.vue
└── rpg_portfolio_section.vue (Portfolio system)
    ├── RPGPortfolioCategory.vue
    ├── RPGPortfolioItem.vue
    └── PortfolioDetailModal.vue
```

## 🎨 Theme Translation

| Portfolio Section | RPG Building | Purpose |
|------------------|--------------|---------|
| Hero/Welcome | Town Square | Discovery tutorial area |
| Development Projects | Workshop | Technical achievements showcase |
| Skills & Technologies | Forge | RPG-style skill trees and stats |
| Articles & Knowledge | Library | Interactive bookshelf system |
| About Me | Tavern | Personal storytelling via fireplace |
| Contact/Collaboration | Guild Hall | Professional networking hub |



## 📚 How to Use the New Structure

- For quick reference: Check CLAUDE.md
- For detailed info: Navigate to specific files in /docs/
- For historical context: Browse /concept/ archive
- For navigation: Use /docs/README.md as your index

---

*For detailed information on any aspect of the project, see the organized documentation in `/docs/` or the concept archive in `/concept/`.*