● Update Todos
  ⎿  ☒ Plan technical architecture for RPG village implementation
     ☐ Plan animation libraries and performance strategy
     ☐ Design component structure and data flow
     ☐ Create development roadmap with milestones
     ☐ Define content structure and data models

● 🎬 Animation & User Interaction Strategy

  Animation Library Selection

  Primary Choice: @vueuse/motion + Native CSS
  // Why this combo:
  // 1. Lightweight - no heavy 3D libraries for simple effects
  // 2. Vue-native - integrates perfectly with Composition API
  // 3. Performant - CSS transforms + GPU acceleration
  // 4. Flexible - Can upgrade to more complex libraries later

  import { useMotion } from '@vueuse/motion'

  // Example: Building hover animation
  const buildingRef = ref()
  const { apply } = useMotion(buildingRef, {
    initial: { scale: 1, y: 0 },
    hover: { scale: 1.05, y: -10 },
    tap: { scale: 0.95 }
  })

  Specialized Libraries for Complex Effects:
  - particles.js - Fireplace smoke, snow weather, fireflies
  - lottie-web - Raven flying animation (export from After Effects)
  - howler.js - Sound system (ambient + interaction sounds)

  Core Interaction Patterns

  1. Drag & Drop System
  // Universal drag & drop composable
  export function useDragDrop() {
    const isDragging = ref(false)
    const dragData = ref(null)

    const startDrag = (event: DragEvent, data: any) => {
      isDragging.value = true
      dragData.value = data
      event.dataTransfer?.setData('application/json', JSON.stringify(data))
    }

    const onDrop = (event: DragEvent, handler: Function) => {
      event.preventDefault()
      const data = JSON.parse(event.dataTransfer?.getData('application/json') || '{}')
      handler(data)
      isDragging.value = false
    }

    return { isDragging, startDrag, onDrop }
  }

  // Usage in Workshop
  const { startDrag, onDrop } = useDragDrop()

  // Drag tech tool
  <div @dragstart="startDrag($event, tech)" draggable="true">
    {{ tech.name }}
  </div>

  // Drop on workbench
  <div @drop="onDrop($event, craftProject)" @dragover.prevent>
    Workbench
  </div>

  2. Parallax Mouse Tracking
  // Mouse-based parallax system
  export function useParallax(intensity = 0.05) {
    const x = ref(0)
    const y = ref(0)

    const { elementX, elementY } = useMouse()

    watchEffect(() => {
      x.value = (elementX.value - window.innerWidth / 2) * intensity
      y.value = (elementY.value - window.innerHeight / 2) * intensity
    })

    return { x, y }
  }

  // Usage: Multiple layers with different intensities
  const backgroundParallax = useParallax(0.02)  // Subtle
  const midgroundParallax = useParallax(0.05)   // Medium
  const foregroundParallax = useParallax(0.08)  // More pronounced

  3. Scene Transition System
  // Smooth scene transitions
  interface SceneTransition {
    type: 'fade' | 'slide' | 'zoom' | 'custom'
    duration: number
    easing: string
  }

  export function useSceneTransition() {
    const currentScene = ref('town-square')
    const isTransitioning = ref(false)

    const transitionTo = async (
      sceneId: string,
      transition: SceneTransition = { type: 'fade', duration: 800, easing: 'ease-out' }
    ) => {
      if (isTransitioning.value) return

      isTransitioning.value = true

      // Pre-load next scene assets
      await preloadScene(sceneId)

      // Execute transition
      await executeTransition(transition)

      currentScene.value = sceneId
      isTransitioning.value = false
    }

    return { currentScene, isTransitioning, transitionTo }
  }

  Specific Animation Implementations

  Day/Night Cycle
  <template>
    <div class="village" :class="timeOfDay">
      <!-- Sky gradient changes -->
      <div class="sky" :style="skyStyle"></div>

      <!-- Stars appear at night -->
      <div class="stars" v-show="timeOfDay === 'night'">
        <div v-for="star in stars" :key="star.id"
             class="star"
             :style="{ left: star.x + '%', top: star.y + '%' }">
        </div>
      </div>

      <!-- Buildings with conditional lighting -->
      <div class="building workshop" :class="{ 'lights-on': timeOfDay === 'night' }">
        <!-- Animated smoke during day -->
        <div v-if="timeOfDay === 'day'" class="smoke"></div>
      </div>
    </div>
  </template>

  <script setup>
  const timeOfDay = ref('day')
  const stars = ref(generateStars(50)) // Random star positions

  const skyStyle = computed(() => ({
    background: timeOfDay.value === 'day'
      ? 'linear-gradient(to bottom, #87CEEB, #98D8E8)'
      : 'linear-gradient(to bottom, #191970, #000000)'
  }))

  // Smooth transition between day/night
  watch(timeOfDay, (newTime) => {
    // Animate filter changes
    const village = document.querySelector('.village')
    village?.style.setProperty('--filter-transition', '0.8s ease')
  })
  </script>

  <style>
  .village {
    transition: filter var(--filter-transition, 0s);
  }
  .day { filter: brightness(1) saturate(1); }
  .night { filter: brightness(0.7) saturate(0.8) hue-rotate(220deg); }

  /* Twinkling stars */
  .star {
    width: 2px;
    height: 2px;
    background: white;
    border-radius: 50%;
    animation: twinkle 2s infinite alternate;
  }
  @keyframes twinkle {
    from { opacity: 0.3; }
    to { opacity: 1; }
  }

  /* Smoke animation */
  .smoke {
    width: 20px;
    height: 20px;
    background: rgba(200, 200, 200, 0.6);
    border-radius: 50%;
    animation: smoke-rise 4s infinite linear;
  }
  @keyframes smoke-rise {
    0% {
      transform: translateY(0) scale(0.5);
      opacity: 0.8;
    }
    100% {
      transform: translateY(-80px) scale(1.5);
      opacity: 0;
    }
  }
  </style>

  Interactive Fireplace
  <template>
    <div class="fireplace-container">
      <!-- Drag zone for logs -->
      <div class="fire-pit"
           @drop="addLogToFire"
           @dragover.prevent
           :class="{ burning: activeLogs.length > 0 }">

        <!-- Fire particles -->
        <div ref="fireContainer" class="fire-effect">
          <div v-for="flame in flames"
               :key="flame.id"
               class="flame"
               :style="flame.style">
          </div>
        </div>
      </div>

      <!-- Draggable timeline logs -->
      <div class="log-pile">
        <div v-for="year in timelineYears"
             :key="year.id"
             draggable="true"
             @dragstart="startDragLog(year)"
             class="timeline-log">
          {{ year.year }}
        </div>
      </div>

      <!-- Story revelation in smoke -->
      <transition name="story-smoke">
        <div v-if="currentStory" class="story-container">
          <h3>{{ currentStory.year }} - {{ currentStory.title }}</h3>
          <p>{{ currentStory.content }}</p>
        </div>
      </transition>
    </div>
  </template>

  <script setup>
  const activeLogs = ref([])
  const flames = ref([])
  const currentStory = ref(null)

  // Dynamic fire intensity based on active logs
  const fireIntensity = computed(() => Math.min(activeLogs.value.length * 0.3, 1))

  // Generate flame particles
  const generateFlames = (intensity: number) => {
    return Array.from({ length: Math.floor(intensity * 20) }, (_, i) => ({
      id: i,
      style: {
        left: Math.random() * 100 + '%',
        animationDelay: Math.random() * 2 + 's',
        animationDuration: (1 + Math.random()) + 's'
      }
    }))
  }

  watch(fireIntensity, (intensity) => {
    flames.value = generateFlames(intensity)
  })

  const addLogToFire = (event) => {
    const yearData = JSON.parse(event.dataTransfer.getData('application/json'))
    activeLogs.value.push(yearData)

    // Show story after brief delay
    setTimeout(() => {
      currentStory.value = yearData
    }, 1000)
  }
  </script>

  <style>
  .fire-pit.burning {
    box-shadow: 0 0 60px rgba(255, 100, 0, 0.8);
    animation: fire-glow 1s infinite alternate;
  }

  @keyframes fire-glow {
    from { filter: brightness(1); }
    to { filter: brightness(1.2); }
  }

  .flame {
    position: absolute;
    bottom: 0;
    width: 4px;
    height: 20px;
    background: linear-gradient(to top, #ff4500, #ffa500, transparent);
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    animation: flicker linear infinite;
  }

  @keyframes flicker {
    0%, 100% { transform: rotate(-2deg) scale(1); }
    25% { transform: rotate(2deg) scale(1.1); }
    50% { transform: rotate(-1deg) scale(0.9); }
    75% { transform: rotate(1deg) scale(1.05); }
  }

  /* Story smoke revelation */
  .story-smoke-enter-active {
    animation: smoke-reveal 1.5s ease-out;
  }

  @keyframes smoke-reveal {
    0% {
      opacity: 0;
      transform: translateY(30px) scale(0.8);
      filter: blur(10px);
    }
    50% {
      filter: blur(3px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
  }
  </style>

  Performance Optimization Strategy

  1. Animation Performance
  // Use GPU-accelerated properties
  const optimizedAnimations = {
    // ✅ Good - GPU accelerated
    transform: 'translateX(100px) scale(1.1)',
    opacity: 0.5,
    filter: 'brightness(1.2)',

    // ❌ Avoid - triggers layout recalculation
    // left: '100px',
    // width: '200px',
    // height: '150px'
  }

  // Batch animation updates
  const useAnimationFrame = () => {
    const animations = ref([])

    const addAnimation = (callback) => {
      animations.value.push(callback)
    }

    const runAnimations = () => {
      requestAnimationFrame(() => {
        animations.value.forEach(callback => callback())
        animations.value = []
      })
    }

    return { addAnimation, runAnimations }
  }

  2. Lazy Loading Strategy
  // Scene-based asset loading
  const useAssetLoader = () => {
    const loadedScenes = ref(new Set())

    const preloadScene = async (sceneId: string) => {
      if (loadedScenes.value.has(sceneId)) return

      // Load scene-specific assets
      const assets = await import(`~/assets/scenes/${sceneId}/index.ts`)

      // Pre-load images
      await Promise.all(
        assets.images.map(src => {
          return new Promise(resolve => {
            const img = new Image()
            img.onload = resolve
            img.src = src
          })
        })
      )

      loadedScenes.value.add(sceneId)
    }

    return { preloadScene }
  }

  3. Intersection Observer for Triggers
  // Trigger animations when elements come into view
  export function useIntersectionTrigger(callback: Function, options = {}) {
    const target = ref(null)

    onMounted(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              callback(entry)
            }
          })
        },
        { threshold: 0.1, ...options }
      )

      if (target.value) {
        observer.observe(target.value)
      }
    })

    return { target }
  }

  // Usage: Trigger building animations on scroll
  const { target: workshopRef } = useIntersectionTrigger(() => {
    // Start workshop smoke animation
    startWorkshopSmoke()
  })

  This animation strategy balances visual impact with performance, using lightweight libraries and GPU-optimized CSS. Ready
  to dive into Component Structure next?