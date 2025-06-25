# Interactive Mechanics Design

## Core Interaction Principles
- **Natural Discovery**: Interactions feel intuitive, not forced
- **Dual Purpose**: Each interaction both entertains AND informs
- **Performance First**: Smooth animations that don't lag
- **Memorable Experience**: Unique mechanics people will want to share

## Town Square - Hero Section

### Day/Night Cycle Toggle
**Mechanism**: Click sun/moon icon to change village atmosphere
- **Day**: Bright, bustling village with birds and workshop smoke
- **Night**: Lanterns light up, fireflies appear, cozy atmosphere
- **Technical**: Smooth CSS filter transitions between states
- **Details**: Building lights toggle automatically

### Weather System
**Mechanism**: Click clouds for weather changes
- **Sunny** → Shows "hot" technologies (trending skills)
- **Rainy** → Reveals "problem-solving" projects
- **Snowy** → Shows "cool" experimental projects

### Hidden Clickable Areas

#### Flying Birds (Natural Tutorial)
- 2-3 birds flying in gentle arcs across sky
- **Hover**: Birds slow down, cursor becomes pointing hand
- **Click**: Bird lands on building, then flies there with camera pan
- **Purpose**: Natural movement catches eye, teaches exploration

#### Village Well (Wisdom Discovery)
- Classic stone well with wooden bucket
- **Click**: Bucket lowers and returns with glowing scroll
- **Reveals**: Personal philosophy: "Invest in myself, then invest in other people"
- **Animation**: Water ripples, magical glow, parchment unfurls

#### Street Lamp (Time Control)
- Cycles through Dawn → Day → Dusk → Night
- Changes entire village atmosphere
- **Tutorial Value**: Shows users can change environment

#### Village Cat (Guide Character)
- Cute cat that responds to clicks
- Sometimes leads to hidden areas
- **Special**: After 5+ clicks, leads to secret anime reference
- Represents playful personality

#### Flower Pots (Growth Metaphor)
- Click to see plant growth stages
- Each stage = career milestone:
  - **Seedling**: 2017 Competition
  - **Sprout**: First job at Portofolio
  - **Flower**: Becoming CTO
  - **Bloom**: Current success

#### Weather Vane (Mood Changer)
- Click to change weather:
  - **Sunny**: "Hot" trending skills
  - **Cloudy**: Problem-solving mood
  - **Rain**: Creative/introspective
  - **Snow**: Cool experimental projects

### Hint System
- Subtle tooltip after 10-15 seconds of no interaction
- Progressive hints guide discovery
- Visual sparkles near interactive elements

## The Workshop - Development Projects

### Project Workbench (Drag & Drop)
**Mechanism**: Drag technology "tools" from rack onto workbench
- Combine techs to see what projects were built
- **Example**: TypeScript + Docker = TurnkeyID microservices
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

## The Forge - Skills Display

### Skill Mixing Cauldron
**Mechanism**: Drag two skills into cauldron
- See outcomes from skill combinations
- Particle effects reveal results
- **Example**: Rust + Trading = High-performance trading bots

### Battle Stats Toggle
**Mechanism**: RPG character sheet style display
- Switch between modes:
  - **Combat Mode**: AWS (Defense), Docker (Attack)
  - **Magic Mode**: TypeScript (Spell Power), Python (Mana)
  - **Crafting Mode**: Years XP, Projects completed

## The Library - Articles/Knowledge

### Interactive Bookshelf
**Mechanism**: Physical book interaction
- Books slightly protrude on hover
- Pull book = Article slides out like scroll
- Secret passages for hidden content
- Categorized by visual indicators

### Magic Reading Glass
**Mechanism**: Content filter via draggable lens
- Drag magnifying glass over shelves
- Different lenses reveal different content:
  - **Red lens** → Technical deep dives
  - **Blue lens** → Beginner friendly
  - **Green lens** → Code snippets

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

## The Tavern - About Section

### Story Fireplace Timeline
**Mechanism**: Interactive timeline via fire feeding
- Drag year "logs" into fire
- Fire blazes up, reveals stories in smoke
- **2017 log** → Competition story appears
- Ember particles float up with memories

### Jukebox Music Interaction
**Mechanism**: Personal music integration
- Click to play music snippets
- Linkin Park, Imagine Dragons tracks
- Each song reveals different life chapter
- Visual equalizer responds to content

### Anime Easter Egg Corner
**Mechanism**: Hidden sequence activation
- Specific click sequence activates
- Reveals favorite anime references
- Small character animations

## The Guild Hall - Contact

### Message Raven System
**Mechanism**: Animated contact form
- Write message on parchment textarea
- Click "Send Raven" button
- Raven flies away with scroll animation
- Returns with delivery confirmation

### Guild Board
**Mechanism**: Interactive collaboration board
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

## Village-Wide Systems

### Mini-Map Navigation
- Fixed position corner map
- Shows current location with pulsing marker
- Click buildings for fast travel
- Path trail shows journey
- Visited buildings marked differently

### Parallax Mouse Interaction
- Mouse movement creates depth
- Multiple layers move at different speeds
- Creates immersive 3D effect
- Subtle enough not to distract

### Time-Based Changes
- Real-time based village states
- **Morning**: Workshop smoke, birds
- **Evening**: Tavern lights, fireflies
- Matches user's actual timezone

### Sound Design (Optional Toggle)
- Ambient village sounds
- Door creaks entering buildings
- Page flips in library
- Hammer sounds from workshop
- Mutable for accessibility

## Performance Considerations
- GPU-accelerated CSS transforms only (transform, opacity, filter)
- Throttled mouse events for parallax
- Intersection Observer for animation triggers
- Scene-based lazy loading
- RequestAnimationFrame for smooth 60fps animations