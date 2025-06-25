# Animation & User Interaction Strategy

## Animation Library Selection

### Primary Choice: @vueuse/motion + Native CSS
- Lightweight approach without heavy 3D libraries
- Vue-native integration with Composition API
- GPU-accelerated CSS transforms for performance
- Flexible foundation for future upgrades

### Specialized Libraries:
- **particles.js** - Fireplace smoke, snow weather, fireflies
- **lottie-web** - Complex animations like raven flying
- **howler.js** - Audio management for sound system

## Core Interaction Patterns

### 1. Universal Drag & Drop System
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

### 2. Parallax Mouse Tracking
- Multiple layers with different movement intensities
- **Background**: 0.02, **Midground**: 0.05, **Foreground**: 0.08
- Creates natural 3D depth effect

### 3. Scene Transition System
- Smooth fade/slide transitions between village areas
- Pre-loading of scene assets for seamless experience
- Transition states prevent user confusion during changes

## Specific Animation Implementations

### Day/Night Cycle Animation
- CSS filter transitions for atmosphere changes
- Conditional star field generation at night
- Building lights toggle automatically
- Smooth gradient shifts for sky background

```css
/* Day/Night cycle implementation */
.village-scene {
  transition: filter 2s ease-in-out;
}

.village-scene.night {
  filter: brightness(0.3) contrast(1.2) hue-rotate(240deg);
}

.village-scene.day {
  filter: brightness(1) contrast(1) hue-rotate(0deg);
}
```

### Interactive Fireplace System
- Dynamic fire intensity based on dragged timeline logs
- Particle system for realistic flame effects
- Story revelation through smoke-like animations
- GPU-optimized flame flicker animations

### Parallax Implementation
```typescript
// useParallax composable
export function useParallax(intensity = 0.05) {
  const x = ref(0)
  const y = ref(0)
  
  const { x: mouseX, y: mouseY } = useMouse()
  
  watchEffect(() => {
    x.value = (mouseX.value - window.innerWidth / 2) * intensity
    y.value = (mouseY.value - window.innerHeight / 2) * intensity
  })
  
  return { x, y }
}
```

### Weather System Animations
```css
/* Rain animation */
@keyframes rain-fall {
  0% { transform: translateY(-100vh) rotateZ(10deg); }
  100% { transform: translateY(100vh) rotateZ(10deg); }
}

/* Snow animation */
@keyframes snow-fall {
  0% { transform: translateY(-100vh) rotateZ(0deg); }
  100% { transform: translateY(100vh) rotateZ(360deg); }
}

/* Cloud drift */
@keyframes cloud-drift {
  0% { transform: translateX(-10%); }
  100% { transform: translateX(10%); }
}
```

## Performance Optimization Strategy

### GPU Acceleration Best Practices
- Use **transform**, **opacity**, and **filter** properties only
- Avoid animating layout properties (width, height, top, left)
- Leverage `will-change` property for elements about to animate
- Use `transform3d()` to trigger hardware acceleration

```css
/* Optimized animation example */
.animated-element {
  will-change: transform, opacity;
  transform: translate3d(0, 0, 0); /* Trigger GPU */
  transition: transform 0.3s ease, opacity 0.3s ease;
}
```

### Animation Performance Guidelines
- **Intersection Observer** for scroll-triggered animations
- **Scene-based lazy loading** of animation assets
- **RequestAnimationFrame** for smooth 60fps animations
- **Throttled mouse events** for parallax effects

### Memory Management
```typescript
// Proper cleanup for animations
onUnmounted(() => {
  // Cancel animation frames
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
  
  // Remove event listeners
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', handleResize)
})
```

## Village-Wide Animation Systems

### Mouse Parallax Implementation
```typescript
// Village-wide parallax system
export function useVillageParallax() {
  const parallaxLayers = ref([
    { selector: '.bg-layer', intensity: 0.02 },
    { selector: '.mid-layer', intensity: 0.05 },
    { selector: '.fg-layer', intensity: 0.08 }
  ])
  
  const { x: mouseX, y: mouseY } = useMouse()
  
  watchEffect(() => {
    parallaxLayers.value.forEach(layer => {
      const elements = document.querySelectorAll(layer.selector)
      const offsetX = (mouseX.value - window.innerWidth / 2) * layer.intensity
      const offsetY = (mouseY.value - window.innerHeight / 2) * layer.intensity
      
      elements.forEach(el => {
        el.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`
      })
    })
  })
}
```

### Time-Based Atmosphere Changes
```typescript
// Real-time atmosphere system
export function useAtmosphereSystem() {
  const currentTime = ref(new Date())
  const atmosphere = computed(() => {
    const hour = currentTime.value.getHours()
    
    if (hour >= 5 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'day'
    if (hour >= 17 && hour < 20) return 'evening'
    return 'night'
  })
  
  // Update every minute
  setInterval(() => {
    currentTime.value = new Date()
  }, 60000)
  
  return { atmosphere }
}
```

### Discovery Animation System
```typescript
// Discovery and hint animations
export function useDiscoveryAnimations() {
  const sparkleElement = (element: HTMLElement) => {
    element.classList.add('sparkle-animation')
    setTimeout(() => {
      element.classList.remove('sparkle-animation')
    }, 1000)
  }
  
  const pulseElement = (element: HTMLElement) => {
    element.classList.add('pulse-animation')
    setTimeout(() => {
      element.classList.remove('pulse-animation')
    }, 2000)
  }
  
  return { sparkleElement, pulseElement }
}
```

### Animation CSS Classes
```css
/* Discovery animations */
@keyframes sparkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.sparkle-animation {
  animation: sparkle 1s ease-in-out;
}

.pulse-animation {
  animation: pulse 2s ease-in-out infinite;
}

.float-animation {
  animation: float 3s ease-in-out infinite;
}
```

## Sound Integration (Optional)

### Audio System Setup
```typescript
// Audio management with howler.js
import { Howl } from 'howler'

export function useVillageAudio() {
  const sounds = {
    ambient: new Howl({ src: ['/audio/village-ambient.mp3'], loop: true, volume: 0.3 }),
    click: new Howl({ src: ['/audio/click.mp3'], volume: 0.5 }),
    discovery: new Howl({ src: ['/audio/discovery.mp3'], volume: 0.7 }),
    pageFlip: new Howl({ src: ['/audio/page-flip.mp3'], volume: 0.4 })
  }
  
  const isAudioEnabled = ref(false)
  
  const playSound = (soundName: keyof typeof sounds) => {
    if (isAudioEnabled.value) {
      sounds[soundName].play()
    }
  }
  
  return { playSound, isAudioEnabled }
}
```

### Audio Integration Guidelines
- All audio is optional and user-controlled
- Provide clear audio toggle controls
- Use appropriate volume levels (20-70%)
- Implement audio loading states
- Respect user preferences for reduced motion/audio