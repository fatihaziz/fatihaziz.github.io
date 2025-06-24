# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 3 personal portfolio website for Fatih Al-Aziz with an RPG (Role-Playing Game) theme inspired by Studio Ghibli aesthetics. The site is deployed as a static site to GitHub Pages at `fatihaziz.com`.

## Pre requirement:
always do "cd "D:\__CODING\03-Personals\__FRONTEND\fatihaziz.github.io" &&" before any command to run

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
- Studio Ghibli aesthetic with RPG game mechanics inspired by Zelda and Harvest Moon
- **Personal Portfolio as RPG Village**: Transform portfolio into an explorable town/village
- Hero section with parallax background and custom wallpaper
- Interactive elements with custom button animations
- Portfolio sections themed as RPG categories (Workshop, Skills Forge, etc.)

### New Vision: RPG Village Portfolio
**Core Concept**: "Welcome home adventurer! Let's go explore my city!"

#### Theme Translation
- **Skills/Projects** = Different districts/buildings in the town
- **Navigation** = Walking/exploring through different areas
- **Portfolio Items** = Treasures/quests to discover
- **About Section** = Tavern/inn where visitors learn your story
- **Contact** = Guild hall for collaborations

#### Visual & Interaction Concepts
1. **Parallax Scrolling Town** - Different layers move at different speeds for depth
2. **Clickable Buildings** - Each represents a skill category or project type
3. **Character Progression** - Visitor "levels up" as they explore more content
4. **Quest-Style Navigation** - "Discover the Frontend Workshop", "Visit the Design Studio"

#### Content Mapping Strategy
- **Town Square** → Hero/Welcome section
- **Workshop** → Development projects
- **Art Studio** → Design work
- **Library** → Blog/writings
- **Tavern** → About me story
- **Guild Board** → Contact/collaboration

### User Journey Flow: The Adventurer's Path

#### Act I: Arrival at the Village (Landing)
**Scene: Town Square - Hero Section**
- **Welcome Message**: "Welcome home adventurer! Let's go explore my city!"
- **Character Introduction**: Brief intro as "Fatih the Code Wizard" (young CTO at 22)
- **Village Overview**: Animated parallax showing all explorable buildings
- **Call to Adventure**: "Choose your quest!" with directional indicators

#### Act II: Village Exploration (Portfolio Discovery)
**Scene: Interactive Village Map**

1. **The Workshop** (Main Development Hub)
   - **What**: Core programming projects and technical achievements
   - **Content**:
     - TurnkeyID platform (Forex trading systems)
     - Microservices architecture
     - Trading bots & Expert Advisors
     - AutoSSL tools & libraries
   - **Interaction**: "Enter the Workshop" → Portfolio grid with project cards
   - **RPG Element**: "Crafting Level: Expert" with skill progression bars

2. **The Forge** (Skills & Technologies)
   - **What**: Technical skills showcase with RPG-style skill trees
   - **Content**:
     - **Languages Mastery**: TypeScript, Rust, Python, Go (with XP bars)
     - **Combat Skills**: Docker, Kubernetes, AWS (represented as battle stats)
     - **Magic Schools**: Frontend (Vue.js), Backend (Node.js), DevOps
   - **Interaction**: Hoverable skill trees with proficiency levels
   - **RPG Element**: "Multi-Language Rainbow User" achievement system

3. **The Library** (Knowledge & Articles)
   - **What**: Medium articles, blog posts, technical writings
   - **Content**: AI, API development, trade-bots knowledge base
   - **Interaction**: "Browse the Ancient Texts" → Article cards with reading time
   - **RPG Element**: "Scholar's Collection" with knowledge categories

4. **The Tavern** (About & Story)
   - **What**: Personal story, journey from competition to CTO
   - **Content**:
     - Origin story: 2017 National Competition for Web Development
     - Career progression: Portofolio Indonesia → TurnkeyID CTO
     - Personal interests: Anime lover, music (Linkin Park, Imagine Dragons)
     - Philosophy: "Invest in myself, then invest in other people"
   - **Interaction**: "Sit by the fire and hear the tale"
   - **RPG Element**: Timeline as "Hero's Journey" with milestones

5. **The Guild Hall** (Contact & Collaboration)
   - **What**: Professional networking and collaboration opportunities
   - **Content**:
     - GitHub (5,572 contributions), LinkedIn (334 followers)
     - TurnkeyID leadership role
     - Open source contributions
   - **Interaction**: "Join the Guild" → Contact forms and social links
   - **RPG Element**: "Reputation Level: Trusted Leader"

#### Act III: Character Progression (Engagement System)
**Visitor Achievement System**
- **Explorer Badge**: Visited all 5 main areas
- **Scholar Achievement**: Read 3+ articles in Library
- **Collaborator Status**: Contacted through Guild Hall
- **Master Discoverer**: Found all hidden easter eggs (anime references, music quotes)

#### Navigation Flow
1. **Entry Point**: Town Square with animated welcome
2. **Free Exploration**: Click any building to enter
3. **Guided Tour Option**: "New to town? Let me show you around!"
4. **Progress Tracking**: Visual indicators showing visited areas
5. **Quick Travel**: Mini-map for fast navigation between areas
6. **Return Home**: Always accessible Town Square button

#### Technical Implementation Notes
- **Parallax Layers**: Background mountains, middle buildings, foreground character
- **State Management**: Track visitor progress and visited areas
- **Smooth Transitions**: Scene changes between areas
- **Mobile Consideration**: Simplified tap-based navigation (future consideration)
- **Performance**: Lazy load area content, optimize animations

### Interactive Mechanics Design

#### Core Interaction Principles
- **Natural Discovery**: Interactions feel intuitive, not forced
- **Dual Purpose**: Each interaction both entertains AND informs
- **Performance First**: Smooth animations that don't lag
- **Memorable Experience**: Unique mechanics people will want to share

#### Town Square - Hero Section
**Day/Night Cycle Toggle**
- Click sun/moon icon to change village atmosphere
- Day: Bright, bustling village with birds and workshop smoke
- Night: Lanterns light up, fireflies appear, cozy atmosphere
- Smooth CSS filter transitions between states
- Building lights toggle automatically

**Weather System**
- Click clouds for weather changes
- Sunny → Shows "hot" technologies (trending skills)
- Rainy → Reveals "problem-solving" projects
- Snowy → Shows "cool" experimental projects

#### The Workshop - Development Projects
**Project Workbench (Drag & Drop)**
- Drag technology "tools" from rack onto workbench
- Combine techs to see what projects were built
- Example: TypeScript + Docker = TurnkeyID microservices
- Crafting animation with glow effects
- Live code preview on hover

**Implementation Concept**:
```vue
<!-- Draggable tech tools -->
<div v-for="tech in technologies"
     draggable="true"
     @dragstart="startDrag($event, tech)"
     class="tech-tool">
  {{ tech.name }}
</div>

<!-- Drop zone workbench -->
<div class="workbench" @drop="onDrop" @dragover.prevent>
  <button v-if="canCraft" @click="craftProject">
    ⚒️ Forge Project
  </button>
</div>
```

#### The Forge - Skills Display
**Skill Mixing Cauldron**
- Drag two skills into cauldron
- See outcomes from skill combinations
- Particle effects reveal results
- Example: Rust + Trading = High-performance trading bots

**Battle Stats Toggle**
- RPG character sheet style display
- Switch between modes:
  - Combat Mode: AWS (Defense), Docker (Attack)
  - Magic Mode: TypeScript (Spell Power), Python (Mana)
  - Crafting Mode: Years XP, Projects completed

#### The Library - Articles/Knowledge
**Interactive Bookshelf**
- Books slightly protrude on hover
- Pull book = Article slides out like scroll
- Secret passages for hidden content
- Categorized by visual indicators

**Magic Reading Glass**
- Drag magnifying glass over shelves
- Different lenses reveal different content:
  - Red lens → Technical deep dives
  - Blue lens → Beginner friendly
  - Green lens → Code snippets

**Implementation Concept**:
```vue
<!-- Book hover effect -->
<style>
.book:hover {
  transform: rotateZ(-5deg) translateX(-10px);
}

/* Scroll unfurl animation */
@keyframes unfurl {
  0% { transform: scaleY(0) rotateX(90deg); }
  100% { transform: scaleY(1) rotateX(0); }
}
</style>
```

#### The Tavern - About Section
**Story Fireplace Timeline**
- Drag year "logs" into fire
- Fire blazes up, reveals stories in smoke
- 2017 log → Competition story appears
- Ember particles float up with memories

**Jukebox Music Interaction**
- Click to play music snippets
- Linkin Park, Imagine Dragons tracks
- Each song reveals different life chapter
- Visual equalizer responds to content

**Anime Easter Egg Corner**
- Hidden click sequence activates
- Reveals favorite anime references
- Small character animations

#### The Guild Hall - Contact
**Message Raven System**
- Write message on parchment textarea
- Click "Send Raven" button
- Raven flies away with scroll animation
- Returns with delivery confirmation

**Guild Board**
- Pinned "quests" (project interests)
- Users post collaboration requests
- Papers flutter in wind on hover

**Implementation Concept**:
```vue
<!-- Raven flying animation -->
<style>
@keyframes fly-away {
  0% { transform: translate(0, 0) scale(1); }
  100% {
    transform: translate(500px, -300px) scale(0.2);
    opacity: 0;
  }
}
</style>
```

#### Village-Wide Systems

**Mini-Map Navigation**
- Fixed position corner map
- Shows current location with pulsing marker
- Click buildings for fast travel
- Path trail shows journey
- Visited buildings marked differently

**Parallax Mouse Interaction**
- Mouse movement creates depth
- Multiple layers move at different speeds
- Creates immersive 3D effect
- Subtle enough not to distract

**Time-Based Changes**
- Real-time based village states
- Morning: Workshop smoke, birds
- Evening: Tavern lights, fireflies
- Matches user's actual timezone

**Sound Design (Optional Toggle)**
- Ambient village sounds
- Door creaks entering buildings
- Page flips in library
- Hammer sounds from workshop
- Mutable for accessibility

### Animation & User Interaction Strategy

#### Animation Library Selection

**Primary Choice: @vueuse/motion + Native CSS**
- Lightweight approach without heavy 3D libraries
- Vue-native integration with Composition API
- GPU-accelerated CSS transforms for performance
- Flexible foundation for future upgrades

**Specialized Libraries:**
- **particles.js** - Fireplace smoke, snow weather, fireflies
- **lottie-web** - Complex animations like raven flying
- **howler.js** - Audio management for sound system

#### Core Interaction Patterns

**1. Universal Drag & Drop System**
```typescript
// Reusable drag & drop composable
export function useDragDrop() {
  const isDragging = ref(false)
  const startDrag = (event: DragEvent, data: any) => {
    isDragging.value = true
    event.dataTransfer?.setData('application/json', JSON.stringify(data))
  }
  return { isDragging, startDrag, onDrop }
}
```

**2. Parallax Mouse Tracking**
- Multiple layers with different movement intensities
- Background: 0.02, Midground: 0.05, Foreground: 0.08
- Creates natural 3D depth effect

**3. Scene Transition System**
- Smooth fade/slide transitions between village areas
- Pre-loading of scene assets for seamless experience
- Transition states prevent user confusion during changes

#### Specific Animation Implementations

**Day/Night Cycle Animation**
- CSS filter transitions for atmosphere changes
- Conditional star field generation at night
- Building lights toggle automatically
- Smooth gradient shifts for sky background

**Interactive Fireplace System**
- Dynamic fire intensity based on dragged timeline logs
- Particle system for realistic flame effects
- Story revelation through smoke-like animations
- GPU-optimized flame flicker animations

**Performance Optimization Strategy**
- GPU-accelerated properties (transform, opacity, filter)
- Intersection Observer for scroll-triggered animations
- Scene-based lazy loading of animation assets
- RequestAnimationFrame for smooth 60fps animations

### Town Square - Discovery Tutorial Design

#### Core Concept
Town Square serves as the discovery tutorial area where visitors learn "this village has secrets worth finding."

#### Hidden Clickable Areas

**Flying Birds (Natural Tutorial)**
- 2-3 birds flying in gentle arcs across sky
- Hover: Birds slow down, cursor becomes pointing hand
- Click: Bird lands on building, then flies there with camera pan
- Purpose: Natural movement catches eye, teaches exploration

**Village Well (Wisdom Discovery)**
- Classic stone well with wooden bucket
- Click: Bucket lowers and returns with glowing scroll
- Reveals personal philosophy: "Invest in myself, then invest in other people"
- Animation: Water ripples, magical glow, parchment unfurls

**Street Lamp (Time Control)**
- Cycles through Dawn → Day → Dusk → Night
- Changes entire village atmosphere
- Tutorial value: Shows users can change environment

**Village Cat (Guide Character)**
- Cute cat that responds to clicks
- Sometimes leads to hidden areas
- After 5+ clicks: Leads to secret anime reference
- Represents playful personality

**Flower Pots (Growth Metaphor)**
- Click to see plant growth stages
- Each stage = career milestone:
  - Seedling: 2017 Competition
  - Sprout: First job at Portofolio
  - Flower: Becoming CTO
  - Bloom: Current success

**Weather Vane (Mood Changer)**
- Click to change weather:
  - Sunny: "Hot" trending skills
  - Cloudy: Problem-solving mood
  - Rain: Creative/introspective
  - Snow: Cool experimental projects

**Hint System**
- Subtle tooltip after 10-15 seconds of no interaction
- Progressive hints guide discovery
- Visual sparkles near interactive elements

### Storytelling Timeline Puzzle Mechanics

#### Core Concept: "Piece Together Fatih's Story"
Visitors become detectives uncovering journey through scattered clues and interactive discoveries.

#### Fragment Types

**Achievement Stones (Major Milestones)**
- Glowing stones embedded in different locations
- Key career moments:
  - 2017 Stone (Competition) → Village entrance
  - 2018 Stone (First Job) → Workshop area
  - 2020 Stone (Backend Lead) → Forge area
  - 2022 Stone (CTO) → Guild Hall
  - 2025 Stone (Current) → Town Square center

**Memory Scrolls (Personal Moments)**
- Hidden parchments with personal insights
- Examples: "Learning to lead", "Building tools that help others"

**Music Notes (Personal Touch)**
- Floating musical notes revealing defining moments
- Connected to favorite songs (Linkin Park, Imagine Dragons)
- Multiple notes unlock "soundtrack of journey"

**Code Fragments (Technical Journey)**
- Evolution from HTML → JavaScript → TypeScript → Rust
- Shows skill progression visually

#### Discovery Mechanics

**Puzzle Assembly**
- Ancient stone tablet in Town Square with empty slots
- Drag found fragments onto tablet
- Auto-arranges chronologically
- Wrong placement gives gentle feedback

**Progressive Story Revelation**
- 0 Fragments: "Seek the scattered memories..."
- 1-2 Fragments: Basic timeline forms
- 3-4 Fragments: Connections appear
- 5-6 Fragments: Personal insights unlock
- 7+ Fragments: Complete story with personality

#### Completion Rewards
- "Master Detective" status
- Special message from Fatih
- Hidden anime corner unlocks
- Special contact form: "Want to add your chapter?"
- Share Your Discovery feature (future development)

### Memory Fragments - Scattered Discovery System

#### Core Concept: "Hidden Memories Throughout the Village"
Special memory fragments reveal deeper personality, interests, and quirks for intimate visitor connection.

#### Fragment Categories

**Anime Easter Eggs (For Fellow Fans)**
- Behind Tavern Bar: Small figurine reveals favorite anime list
- Library Secret Shelf: Book spine sequence unlocks manga collection
- Workshop Corner: Rubber duck with anime headband
- Cat Interaction: After befriending, leads to hidden anime poster

**Music Memory Fragments**
- Fragment 1 (Competition Nerves): Linkin Park - "In the End" near entrance
- Fragment 2 (First Job): Imagine Dragons - "On Top of the World" in Workshop
- Fragment 3 (Late Night Coding): Lo-fi playlist reference at Guild Hall
- Collection Reward: Unlocks functional Tavern jukebox

**Coffee Chronicles (Developer Fuel)**
- Workshop Mug Collection: Different mugs tell coding stories
- Tavern Coffee Stain: "Great Coffee Disaster of 2019"
- Guild Hall Coffee Machine: Evolution from instant to espresso
- Unlock: Coffee strength meter affecting village energy

**Bug Stories (Debugging Adventures)**
- The Infinite Loop Incident (Forge furnace)
- The Missing Semicolon Saga (Library desk)
- Production Deploy at 5 PM Friday (Guild Hall exit)
- The Great Merge Conflict (Workshop tool chest)

**Inspiration Fragments (What Drives You)**
- Mentor's Wisdom (Guild Hall portrait)
- Young CTO Doubts (Tavern hidden diary)
- Open Source Philosophy (Library cornerstone)

#### Discovery Mechanics

**Environmental Storytelling**
- Workshop table scratches → "First project marks"
- Worn paths → "My daily routine"
- Book stacks → "Self-taught journey"

**Combination Discoveries**
- Coffee mug + late lamp = "All-nighter memory"
- Music note + code = "Flow state story"
- Rain + fireplace = "Reflective journey moment"

**Time-Based Discoveries**
- Dawn: "Early bird coding sessions"
- Night: "Late night breakthroughs"
- Weather-specific revelations

#### Special Interactions

**Photo Album (Tavern)**
- Click dusty shelf 3x to reveal
- Blurred photos clear on click
- Shows team photos, competition day
- One photo links to LinkedIn/GitHub

**Code Evolution Wall (Workshop)**
- Tool sequence unlocks sliding wall
- Shows code progression 2017-2024
- HTML → JavaScript → TypeScript → Rust
- Hover for story snippets

**Failure Museum (Forge Basement)**
- Click anvil during thunderstorm
- Failed projects with lessons learned
- Growth mindset showcase

### Progressive Story Revelation System

#### Layer System

**Layer 1: Surface Story (0-5 min)**
- Basic bio and timeline
- Generic project descriptions
- "Fatih is a CTO at TurnkeyID"

**Layer 2: Professional Depth (5-15 min)**
- Specific challenges overcome
- Technical decisions explained
- Team leadership stories
- "At 22, becoming CTO was terrifying..."

**Layer 3: Personal Connection (15-30 min)**
- Vulnerable moments shared
- Deep interest revelations
- Philosophy formation stories
- "That Linkin Park song hit different after..."

**Layer 4: Hidden Depths (30+ min)**
- Easter eggs and inside jokes
- Future dreams and goals
- Messages for dedicated explorers
- "If you're reading this..."

#### Dynamic Story Elements

**Time-Based Variations**
- 3 AM visits: "Another night owl! Let me tell you..."
- Rainy weather: "Rain makes me introspective..."

**Branching Narratives**
- Click desk → Technical challenges
- Click team photo → Leadership lessons
- Click coffee → Work-life balance

**The Developer's Room**
- Unlocked after finding ALL content
- Live coding environment
- Real-time GitHub contributions
- Direct message option
- Exclusive future previews

### Collaborative Visitor Memory System

#### The Village Guestbook

**Discovery**
- Complete 50% of timeline puzzle
- Click mysterious Library door
- Reveals "The Adventurer's Chronicle"

**Memory Crystal System**
- Earn crystal through discoveries
- Write message/tip/drawing
- Hide crystal in village
- Leave clue for others

**Crystal Types**
- 💎 Blue: Discovery tips
- 💎 Green: Personal messages
- 💎 Purple: Creative content
- 💎 Gold: Collaboration invites

**Community Features**
- Crystal resonance (like) system
- Popular crystals glow brighter
- Low-resonance fade after 30 days
- Memory Map unlocks after finding 5 crystals

### Village Season System

#### Spring Season - "New Beginnings" (March-May)
**Changes:** Cherry blossoms, baby animals, fresh colors
**Content:** New projects, spring cleaning stories
**Event:** Seed Planting Week - plant ideas that grow

#### Summer Season - "Peak Performance" (June-August)
**Changes:** Bright colors, fireflies, festival decorations
**Content:** Internship stories, summer projects
**Event:** Summer Festival - collaborative puzzles

#### Autumn Season - "Harvest & Reflection" (Sept-Nov)
**Changes:** Falling leaves, warm colors, cozy lanterns
**Content:** Year achievements, lessons learned
**Event:** Harvest Moon Night - moonlight reveals

#### Winter Season - "Deep Dive" (Dec-Feb)
**Changes:** Snow, frozen pond, northern lights
**Content:** Year review, debugging stories
**Event:** Time Capsule - goals and predictions

#### Seasonal Features
- Persistent main content
- Seasonal fragments add layers
- Progress saves across seasons
- Seasonal passport stamps
- Return visitor recognition
- Community celebrations

#### Year-Long Arc
- Spring: "What seeds will you plant?"
- Summer: "How will you grow?"
- Autumn: "What will you harvest?"
- Winter: "What foundations will you build?"

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

## Current Development Progress

### ✅ Completed: Loading Screen System
**Achievement Unlocked: Cloud Formation System**
- Successfully implemented CloudFormation.vue component
- Created massive cloud formations on left/right sides using simple cloud structures
- Added floating background clouds with smooth animations
- Integrated big composite cloud with 10-second drift animation
- Optimized for 1920x1200 resolution with proper scaling (7x-15x for formations)
- Perfect Studio Ghibli aesthetic achieved with layered z-index system

### 🎯 Current Quest: Chapter I - Hero Section Interactive Elements

#### Implementation Priority (Town Square Discovery Tutorial):
1. **Parallax Mouse Interaction** ⏳ - Foundation for 3D depth feeling
2. **Day/Night Toggle** ⏳ - Core atmospheric control via street lamp
3. **Village Well** ⏳ - Philosophy discovery mechanism
4. **Flying Birds** ⏳ - Natural tutorial system
5. **Village Cat** ⏳ - Guide character with behaviors
6. **Weather System** ⏳ - Mood variations via weather vane
7. **Growth Elements** ⏳ - Career metaphors via flower pots

#### Technical Architecture for Chapter I:

**Core Composables Needed:**
```typescript
// composables/useParallax.ts
export function useParallax(intensity = 0.05) {
  const x = ref(0)
  const y = ref(0)
  // Mouse-based parallax with multiple layers
  // Background: 0.02, Midground: 0.05, Foreground: 0.08
}

// composables/useDiscovery.ts
export function useDiscovery() {
  const discovered = ref(new Set())
  const hints = ref([])
  // Discovery tracking and hint system
}

// composables/useVillageState.ts
export function useVillageState() {
  // Time of day, weather, visitor progress
  const timeOfDay = ref('day') // dawn, day, dusk, night
  const weather = ref('sunny') // sunny, cloudy, rainy, snowy
  const discoveredElements = ref(new Set())
}
```

**Component Structure:**
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

#### Discovery Tutorial Flow:
1. **Arrival** - Clouds part revealing village (completed)
2. **First Interaction** - Flying bird catches eye, teaches clicking
3. **Depth Discovery** - Mouse movement reveals parallax depth
4. **Atmosphere Control** - Street lamp teaches environment changes
5. **Hidden Secrets** - Well, cat, and other elements reward exploration
6. **Mastery** - User understands "this village has secrets"

#### Content Planning - Specific Interactions:

**Village Well Wisdom Quotes (Rotating):**
1. "I want my simple life to become legacy"
2. "Invest in myself, then invest in other people"
3. "Never gonna give you up, never gonna let servers down"
4. "With great commits comes great responsibility"
5. "There are only two hard things in programming: cache invalidation, naming things, and off-by-one errors"

**Flower Pot Career Growth:**
- Seedling: 2017 Competition
- Sprout: First job at Portofolio
- Flower: Becoming CTO
- Bloom: Current success

**Cat Behaviors:**
- Idle: Cleaning paws, looking around, occasional meow
- Hover: Perks up, looks at cursor
- Click: Stretches, walks to new location
- Special: After 5+ clicks, leads to secret anime reference

**Time-of-Day Atmosphere Changes:**
- Dawn: Pink/orange sky, early morning mist
- Day: Bright, clear, bustling sounds, workshop smoke
- Dusk: Golden hour lighting, warm atmosphere
- Night: Stars, fireflies, cozy building lights

#### Next Development Steps:
1. Install @vueuse/motion and @vueuse/core dependencies
2. Create useParallax composable for mouse tracking
3. Implement TownSquare.vue with layered parallax structure
4. Add StreetLamp.vue component with day/night toggle
5. Create VillageWell.vue with wisdom reveal animation
6. Implement discovery tracking system
7. Add subtle hint system for user guidance

#### Performance Considerations:
- GPU-accelerated CSS transforms only (transform, opacity, filter)
- Throttled mouse events for parallax
- Intersection Observer for animation triggers
- Scene-based lazy loading
- RequestAnimationFrame for smooth 60fps animations

### 🎨 Asset Requirements for Chapter I:

**Immediate Needs:**
- Village layout with separated layers (PSD/SVG with 3-5 parallax layers)
- Street lamp sprite with day/night states
- Village well with bucket animation frames
- Cat sprite sheet (idle, walk, stretch animations)
- Flying birds sprite (6-frame flight cycle)
- Flower pot growth stages (4 stages)
- Weather vane sprite

**Animation Libraries:**
- @vueuse/motion (primary for Vue 3 integration)
- @vueuse/core (mouse tracking, reactive utilities)
- Native CSS animations for lightweight effects
- Future: particles.js for fireflies, lottie-web for complex animations

### 📖 Story Content for Chapter I:

**Personal Philosophy Fragments:**
- Competition origin story (2017)
- Mentor influence quotes
- CTO journey insights
- Open source philosophy
- Coffee-fueled coding sessions
- Anime references for fellow fans

**Discovery Rewards System:**
- Each interaction unlocks hint about next discovery
- Progressive revelation of personality layers
- Easter eggs reward thorough exploration
- Building trust through consistent discovery

### 🎯 Success Metrics for Chapter I:
- User discovers at least 3 interactive elements within first 2 minutes
- Parallax effect feels natural and adds depth without distraction
- Day/night toggle creates meaningful atmosphere change
- Discovery hints guide without being obvious
- Village feels alive and responsive to user presence

### 🔄 Integration with Existing Systems:
- CloudFormation.vue continues to work as atmospheric background
- Hero section message remains: "Welcome home adventurer!"
- Smooth transition to future portfolio buildings
- State management for discovered elements carries to future chapters
- Loading screen clouds integrate with village weather system