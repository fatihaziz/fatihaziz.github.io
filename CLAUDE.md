# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 3 personal portfolio website for Fatih Al-Aziz with an RPG (Role-Playing Game) theme inspired by Studio Ghibli aesthetics. The site is deployed as a static site to GitHub Pages at `fatihaziz.com`.

## Development Commands

### Essential Commands
- `pnpm dev` - Start development server
- `pnpm build-github` - Build optimized for GitHub Pages deployment
- `pnpm gh-publish` - Build and deploy to GitHub Pages with custom domain
- `pnpm generate` - Generate static files
- `pnpm preview` - Preview built application

### Utility Commands
- `pnpm install-clean` - Clean install dependencies
- `pnpm nuxt-serve` - Build, generate, and serve locally with browser-sync
- `pnpm prebuild` - Clean build directories (.nuxt, dist, .output)

## Architecture Overview

### Technology Stack
- **Framework**: Nuxt 3.13.2 (Vue 3 Composition API)
- **Styling**: TailwindCSS 3.4.10 with custom utilities
- **Type Safety**: TypeScript
- **Deployment**: GitHub Pages with custom domain (fatihaziz.com)
- **Build**: Vite (via Nuxt 3), configured for SSG with `ssr: false`

### Key Configuration
- **Custom Font Loading**: Dynamic font import system via `build/import_fonts.ts`
- **Static Generation**: Configured for GitHub Pages deployment
- **Auto-components**: Enabled for automatic component registration
- **PostCSS**: Configured with TailwindCSS and Autoprefixer

## Project Structure

### Core Files
- `app.vue` - Root component with loading screen and layout
- `nuxt.config.ts` - Main Nuxt configuration with custom font loading
- `tailwind.config.ts` - TailwindCSS with custom fonts and RPG color scheme

### Key Directories
- `components/` - Vue components using Composition API with `<script setup>`
- `pages/` - File-based routing (index.vue for homepage, portfolio.vue for portfolio)
- `assets/` - Static assets including extensive custom font collection (9 font families)
- `build/` - Build utilities including custom font loading system
- `docs/` - Documentation and RPG-themed development plan

### Component Architecture
- **RPG Portfolio System**: Modular components (Category → Item → Modal pattern)
- **loading_screen.vue** - Initial loading animation
- **rpg_portfolio_section.vue** - Main portfolio section with category system
- **RPGPortfolioCategory.vue** - Category container for portfolio items
- **RPGPortfolioItem.vue** - Individual portfolio item display
- **PortfolioDetailModal.vue** - Modal for detailed portfolio item view

## Development Patterns

### Vue 3 Patterns
- All components use Composition API with `<script setup>`
- Strong TypeScript typing with interfaces for data structures
- Event-driven parent-child communication via custom events
- Reactive refs for local state management (no global state)

### Styling Conventions
- TailwindCSS utility classes for primary styling
- Scoped styles for complex animations and effects
- Custom color scheme: RPG-themed colors (sienna, beige, rpg-text)
- Custom font families mapped to semantic names in Tailwind config

### Font System
- Custom dynamic font loading via `build/import_fonts.ts`
- 9 font families configured (Mondapick, Mangiola, Supreme, etc.)
- Font CSS files automatically imported from `assets/font/` directory
- Path conversion from absolute to Nuxt-compatible aliases

## RPG Theme Context

### Design Philosophy
- Studio Ghibli aesthetic with RPG game mechanics
- Hero section with parallax background and custom wallpaper
- Interactive elements with custom button animations
- Portfolio sections themed as RPG categories (Workshop, Skills Forge, etc.)

### Component Relationships
- Hero section leads to RPG portfolio section
- Portfolio categories contain clickable items
- Items open detailed modal views
- Modal system for "treasure inspection" (portfolio details)

## Development Guidelines

### When Working with Fonts
- All font files are in `assets/font/` directory
- Font loading is automatic via the build system
- Check `tailwind.config.ts` for available font family names
- Font changes require build restart

### When Working with Components
- Follow existing Composition API patterns
- Use TypeScript interfaces for prop definitions
- Maintain RPG theming consistency
- Test modal interactions and responsive behavior

### When Working with Styling
- Use TailwindCSS utilities first
- Custom CSS for complex animations only
- Maintain color consistency with RPG theme
- Test across different screen sizes

## GitHub Pages Deployment

### Process
1. Use `pnpm build-github` for GitHub Pages optimized build
2. `pnpm gh-publish` handles build and deployment with custom domain
3. CNAME file in `/docs/` directory configures custom domain
4. Site deploys to `fatihaziz.com`

### Important Notes
- Build output goes to `.output/public/`
- Custom domain is configured via CNAME: `fatihaziz.com`
- GitHub Pages preset is used for proper static asset handling
- Deployment includes dotfiles via `--dotfiles` flag

## Current Development Context

### Active Branch
- Currently on `feat/rpg-portofolios` branch
- Recent work focused on RPG theme implementation and UI improvements

### Development Plan
- RPG-themed development plan available in `/docs/plan.md`
- Structured as quest chapters (Chapter I: Banishing Time Anomaly, Chapter II: Hero Attunement, Chapter III: RPG Realm Forging)
- Plan includes specific objectives for loading screen, hero section, and portfolio system

### Key References
- Design inspiration: Studio Ghibli Spirited Away Website UI (Dribbble)
- Font resources: DaFont, Fontshare, Untitled UI
- RPG concept: Workshop, Swordmaster, Guild Hall translated to portfolio categories