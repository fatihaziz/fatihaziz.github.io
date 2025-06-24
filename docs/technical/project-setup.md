# Project Setup & Configuration

## Project Overview

This is a Nuxt 3 personal portfolio website for Fatih Al-Aziz with an RPG (Role-Playing Game) theme inspired by Studio Ghibli aesthetics. The site is deployed as a static site to GitHub Pages at `fatihaziz.com`.

## Prerequisites

Always run commands from the project root directory:
```bash
cd "D:\__CODING\03-Personals\__FRONTEND\fatihaziz.github.io"
```

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

## Technology Stack

### Core Framework
- **Framework**: Nuxt 3.13.2 (Vue 3 Composition API)
- **Styling**: TailwindCSS 3.4.10 with custom utilities
- **Type Safety**: TypeScript
- **Deployment**: GitHub Pages with custom domain (fatihaziz.com)
- **Build**: Vite (via Nuxt 3), configured for SSG with `ssr: false`

### Key Configuration Features
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

## Font System

### Font Configuration
- Custom dynamic font loading via `build/import_fonts.ts`
- 9 font families configured (Mondapick, Mangiola, Supreme, etc.)
- Font CSS files automatically imported from `assets/font/` directory
- Path conversion from absolute to Nuxt-compatible aliases

### Working with Fonts
- All font files are in `assets/font/` directory
- Font loading is automatic via the build system
- Check `tailwind.config.ts` for available font family names
- Font changes require build restart

## Development Environment Setup

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Start Development Server**:
   ```bash
   pnpm dev
   ```

3. **Build for Production**:
   ```bash
   pnpm build-github
   ```

## Current Development Context

### Active Branch
- Currently on `feat/rpg-portofolios` branch
- Recent work focused on RPG theme implementation and UI improvements

### Development Plan
- RPG-themed development plan available in `/docs/plan.md`
- Structured as quest chapters (Chapter I: Banishing Time Anomaly, Chapter II: Hero Attunement, Chapter III: RPG Realm Forging)
- Plan includes specific objectives for loading screen, hero section, and portfolio system