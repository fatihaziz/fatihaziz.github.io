# Component Architecture

## RPG Portfolio System Architecture

### Component Hierarchy
The application follows a modular component architecture with clear separation of concerns:

```
App.vue (Root)
├── loading_screen.vue - Initial loading animation
├── CloudFormation.vue - Background cloud effects
└── rpg_portfolio_section.vue - Main portfolio section
    ├── RPGPortfolioCategory.vue - Category containers
    │   └── RPGPortfolioItem.vue - Individual portfolio items
    └── PortfolioDetailModal.vue - Detailed item view
```

### Core Components

#### Loading Screen System
- **loading_screen.vue** - Initial loading animation with cloud parting effect
- **CloudFormation.vue** - Massive cloud formations with Studio Ghibli aesthetic
- Integrated background clouds with smooth animations
- Optimized for 1920x1200 resolution with proper scaling

#### RPG Portfolio Components
- **rpg_portfolio_section.vue** - Main portfolio section with category system
- **RPGPortfolioCategory.vue** - Category container for portfolio items
- **RPGPortfolioItem.vue** - Individual portfolio item display
- **PortfolioDetailModal.vue** - Modal for detailed portfolio item view

### Component Design Patterns

#### Pattern: Category → Item → Modal
```
Portfolio Section
├── Category (Workshop, Forge, Library, etc.)
│   ├── Item (Individual projects/skills)
│   └── Modal (Detailed view - "treasure inspection")
```

#### Vue 3 Composition API Patterns
- All components use Composition API with `<script setup>`
- Strong TypeScript typing with interfaces for data structures
- Event-driven parent-child communication via custom events
- Reactive refs for local state management (no global state)

## Planned Component Architecture

### Town Square Interactive Elements

```
TownSquare.vue (Main Hero Section)
├── ParallaxLayers.vue
│   ├── BackgroundLayer.vue (mountains, far clouds)
│   ├── MidgroundLayer.vue (buildings, main elements)
│   └── ForegroundLayer.vue (trees, lamp posts, cat)
├── InteractiveElements.vue
│   ├── VillageWell.vue
│   ├── StreetLamp.vue (day/night toggle)
│   ├── FlyingBirds.vue
│   ├── VillageCat.vue
│   ├── WeatherVane.vue
│   └── FlowerPots.vue
├── DiscoverySystem.vue
└── HintSystem.vue
```

### Village Buildings (Future Implementation)

#### The Workshop (Development Projects)
```
Workshop.vue
├── ProjectWorkbench.vue (drag & drop interface)
├── TechnologyRack.vue (draggable tech tools)
├── CodePreview.vue (live code display)
└── CraftingAnimation.vue (project creation effects)
```

#### The Forge (Skills Display)
```
Forge.vue
├── SkillCauldron.vue (skill mixing interface)
├── BattleStats.vue (RPG character sheet)
├── SkillTree.vue (technology proficiency display)
└── ProgressBars.vue (XP and leveling system)
```

#### The Library (Articles/Knowledge)
```
Library.vue
├── InteractiveBookshelf.vue
├── MagicReadingGlass.vue (content filtering)
├── SecretPassages.vue (hidden content)
└── ScrollUnfurl.vue (article reveal animation)
```

#### The Tavern (About Section)
```
Tavern.vue
├── StoryFireplace.vue (timeline interaction)
├── MusicJukebox.vue (personal music integration)
├── PhotoAlbum.vue (career photos)
└── AnimeCorner.vue (easter egg area)
```

#### The Guild Hall (Contact)
```
GuildHall.vue
├── MessageRaven.vue (contact form animation)
├── GuildBoard.vue (collaboration requests)
├── ReputationDisplay.vue (professional stats)
└── DirectContact.vue (earned contact form)
```

## Component Relationships

### Data Flow
1. **Hero section** leads to RPG portfolio section
2. **Portfolio categories** contain clickable items
3. **Items** open detailed modal views
4. **Modal system** for "treasure inspection" (portfolio details)

### State Management
- **Local component state** using Vue 3 reactivity
- **Discovery tracking** for visited areas and found elements
- **Progress persistence** across sessions
- **Inter-component communication** via custom events

### Event System
```typescript
// Example event communication pattern
interface PortfolioEvents {
  'item-selected': PortfolioItem
  'category-changed': CategoryType
  'modal-opened': PortfolioItem
  'discovery-made': DiscoveryFragment
}
```

## Component Best Practices

### TypeScript Integration
```typescript
// Component prop definitions
interface ComponentProps {
  title: string
  items: PortfolioItem[]
  category: CategoryType
}

// Component data structures
interface PortfolioItem {
  id: string
  title: string
  description: string
  technologies: Technology[]
  category: CategoryType
}
```

### Styling Conventions
- **TailwindCSS utilities** for primary styling
- **Scoped styles** for complex animations and effects
- **Custom color scheme**: RPG-themed colors (sienna, beige, rpg-text)
- **Custom font families** mapped to semantic names in Tailwind config

### Performance Considerations
- **GPU-accelerated CSS transforms** only (transform, opacity, filter)
- **Intersection Observer** for scroll-triggered animations
- **Scene-based lazy loading** of animation assets
- **RequestAnimationFrame** for smooth 60fps animations