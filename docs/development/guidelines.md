# Development Guidelines

## Vue 3 Development Patterns

### Composition API Standards
- All components use Composition API with `<script setup>`
- Strong TypeScript typing with interfaces for data structures
- Event-driven parent-child communication via custom events
- Reactive refs for local state management (no global state)

### Component Structure Example
```vue
<script setup lang="ts">
interface Props {
  title: string
  items: PortfolioItem[]
  category: CategoryType
}

interface Emits {
  (e: 'item-selected', item: PortfolioItem): void
  (e: 'category-changed', category: CategoryType): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Reactive state
const selectedItem = ref<PortfolioItem | null>(null)
const isLoading = ref(false)

// Computed properties
const filteredItems = computed(() => 
  props.items.filter(item => item.category === props.category)
)

// Methods
function selectItem(item: PortfolioItem) {
  selectedItem.value = item
  emit('item-selected', item)
}
</script>
```

## Styling Conventions

### TailwindCSS Best Practices
- **Primary styling**: Use TailwindCSS utilities first
- **Complex animations**: Custom CSS in scoped styles only
- **Color consistency**: Maintain RPG theme colors (sienna, beige, rpg-text)
- **Responsive design**: Test across different screen sizes

### Custom Color Scheme
```css
/* RPG-themed colors in TailwindCSS config */
colors: {
  'rpg-primary': '#8B4513',    // Sienna
  'rpg-secondary': '#F5F5DC',  // Beige
  'rpg-accent': '#CD853F',     // Peru
  'rpg-text': '#2F4F4F',       // Dark slate gray
}
```

### Font Usage Guidelines
- **Headers**: Medieval/Fantasy fonts for building names and titles
- **Body text**: Clean sans-serif for readability
- **Code snippets**: Monospace fonts
- **Personal notes**: Handwritten fonts for easter eggs

## TypeScript Integration

### Interface Definitions
```typescript
// Core data structures
interface PortfolioItem {
  id: string
  title: string
  description: string
  technologies: Technology[]
  category: CategoryType
  imageUrl?: string
  demoUrl?: string
  githubUrl?: string
}

interface Technology {
  name: string
  icon: string
  proficiency: number // 1-10 scale
}

interface DiscoveryFragment {
  id: string
  type: 'achievement' | 'memory' | 'music' | 'code'
  location: string
  content: string
  unlocked: boolean
}

// Component event types
interface ComponentEvents {
  'discovery-made': DiscoveryFragment
  'progress-updated': ProgressData
  'animation-complete': AnimationState
}
```

### Type Safety Standards
- Always define props and emits interfaces
- Use strict TypeScript configuration
- Avoid `any` type - use proper typing
- Leverage Vue 3's built-in type inference

## Font System Guidelines

### Working with Custom Fonts
- All font files are in `assets/font/` directory
- Font loading is automatic via the build system
- Check `tailwind.config.ts` for available font family names
- **Important**: Font changes require build restart

### Font Loading System
The project uses a custom dynamic font loading system via `build/import_fonts.ts`:
- Automatically imports font CSS files from `assets/font/` directory
- Converts absolute paths to Nuxt-compatible aliases
- Supports 9 font families (Mondapick, Mangiola, Supreme, etc.)

## Component Development Best Practices

### Component Organization
- Follow existing Composition API patterns
- Use TypeScript interfaces for prop definitions
- Maintain RPG theming consistency
- Test modal interactions and responsive behavior

### State Management
- **Local state**: Use Vue 3 reactivity (ref, reactive)
- **Cross-component**: Custom events and props
- **Persistence**: LocalStorage for discovery progress
- **No global state**: Keep state management simple and local

### Performance Guidelines
- **GPU acceleration**: Use transform, opacity, filter properties only
- **Animation optimization**: RequestAnimationFrame for smooth 60fps
- **Lazy loading**: Implement for heavy components and assets
- **Intersection Observer**: Use for scroll-triggered animations

## Animation Standards

### CSS Animation Principles
```css
/* GPU-accelerated properties only */
.animated-element {
  transform: translateX(0);
  opacity: 1;
  filter: brightness(1);
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Avoid animating these properties */
/* width, height, left, top, margin, padding */
```

### Animation Library Usage
- **Primary**: @vueuse/motion + Native CSS
- **Specialized**: particles.js for effects, lottie-web for complex animations
- **Audio**: howler.js for sound management (optional)

## Code Quality Standards

### Vue Component Structure
```vue
<!-- Template: Clean and semantic -->
<template>
  <div class="rpg-component">
    <header class="component-header">
      <!-- Component header content -->
    </header>
    <main class="component-content">
      <!-- Main component content -->
    </main>
  </div>
</template>

<!-- Script: TypeScript with proper typing -->
<script setup lang="ts">
// Imports
// Interfaces
// Props & Emits
// Reactive state
// Computed properties
// Methods
// Lifecycle hooks
</script>

<!-- Styles: Scoped and organized -->
<style scoped>
/* Component-specific styles */
/* Use TailwindCSS utilities in template */
/* Custom animations and complex styles here */
</style>
```

### Testing Guidelines
- Test modal interactions and responsive behavior
- Verify animations don't cause performance issues
- Check component behavior across different screen sizes
- Validate TypeScript types are properly enforced

## Deployment Considerations

### Build Optimization
- Use `pnpm build-github` for GitHub Pages deployment
- Verify all assets are properly resolved for static hosting
- Test production build locally before deployment
- Ensure custom domain (fatihaziz.com) configuration is preserved

### Asset Management
- Optimize images for web (WebP format preferred)
- Minimize animation file sizes
- Use appropriate compression for audio files
- Implement lazy loading for non-critical assets