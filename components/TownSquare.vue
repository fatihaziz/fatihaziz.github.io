<template>
  <div class="town-square" :class="timeClass">
    <!-- Parallax Background Layers -->
    <div class="parallax-layer background" :style="{ transform: background.transform }">
      <div class="mountains"></div>
      <div class="distant-clouds"></div>
      <div class="grass-field"></div>
      <div class="cobblestone-path"></div>
    </div>
    
    <!-- Parallax Midground Layers -->
    <div class="parallax-layer midground" :style="{ transform: midground.transform }">
      <div class="buildings-layer">
        <!-- Workshop -->
        <div class="building workshop" @click="enterBuilding('workshop')">
          <div class="building-base"></div>
          <div class="chimney">
            <div class="smoke" v-if="timeOfDay === 'day'"></div>
          </div>
          <div class="windows">
            <div class="window" :class="{ lit: timeOfDay === 'night' }"></div>
            <div class="window" :class="{ lit: timeOfDay === 'night' }"></div>
          </div>
        </div>
        
        <!-- Library -->
        <div class="building library" @click="enterBuilding('library')">
          <div class="building-base"></div>
          <div class="windows">
            <div class="window" :class="{ lit: timeOfDay === 'night' }"></div>
          </div>
        </div>
        
        <!-- Tavern -->
        <div class="building tavern" @click="enterBuilding('tavern')">
          <div class="building-base"></div>
          <div class="fireplace-glow" :class="{ active: timeOfDay !== 'day' }"></div>
          <div class="windows">
            <div class="window" :class="{ lit: timeOfDay !== 'day' }"></div>
          </div>
        </div>
        
        <!-- Guild Hall -->
        <div class="building guild-hall" @click="enterBuilding('guild-hall')">
          <div class="building-base"></div>
          <div class="flag" :style="flagAnimation"></div>
          <div 
            class="weather-vane interactive-element"
            @click="changeWeather"
            @mouseenter="showHint('weather-vane')"
            @mouseleave="hideHint"
          >
            <div class="vane-post"></div>
            <div class="vane-arrow" :class="`weather-${weather}`"></div>
            <div class="vane-directions">
              <span class="direction n">N</span>
              <span class="direction s">S</span>
              <span class="direction e">E</span>
              <span class="direction w">W</span>
            </div>
          </div>
        </div>
        
        <!-- Forge -->
        <div class="building forge" @click="enterBuilding('forge')">
          <div class="building-base"></div>
          <div class="forge-glow" :class="{ active: hasDiscovered('forge-interaction') }"></div>
        </div>
      </div>
      
      <!-- Central Village Well -->
      <div 
        class="village-well interactive-element"
        @click="interactWithWell"
        @mouseenter="showHint('well')"
        @mouseleave="hideHint"
      >
        <div class="well-base"></div>
        <div class="well-rope"></div>
        <div class="well-bucket" :class="{ lowered: wellState === 'lowered' }"></div>
        <div class="wisdom-scroll" v-if="wellState === 'revealing'" :class="{ visible: wellState === 'revealing' }">
          <p>{{ currentWisdom }}</p>
        </div>
      </div>
      
      <!-- Street Lamp -->
      <div 
        class="street-lamp interactive-element"
        @click="cycleTimeOfDay"
        @mouseenter="showHint('lamp')"
        @mouseleave="hideHint"
      >
        <div class="lamp-post"></div>
        <div class="lamp-light" :class="{ glowing: timeOfDay === 'night' || timeOfDay === 'dusk' }"></div>
        <div class="flame" v-if="timeOfDay === 'night' || timeOfDay === 'dusk'"></div>
      </div>
    </div>
    
    <!-- Parallax Foreground Layers -->
    <div class="parallax-layer foreground" :style="{ transform: foreground.transform }">
      <!-- Flying Birds -->
      <div class="birds-container">
        <div 
          v-for="bird in birds" 
          :key="bird.id"
          class="bird interactive-element"
          :style="bird.style"
          @click="followBird(bird)"
        >
          🐦
        </div>
      </div>
      
      <!-- Village Cat -->
      <div 
        class="village-cat interactive-element"
        :style="catPosition"
        @click="interactWithCat"
        @mouseenter="showHint('cat')"
        @mouseleave="hideHint"
      >
        🐱
      </div>
      
      <!-- Flower Pots for Career Growth -->
      <div class="flower-garden">
        <div 
          v-for="(pot, index) in flowerPots" 
          :key="index"
          class="flower-pot interactive-element"
          :style="pot.style"
          @click="growFlower(index)"
          @mouseenter="showHint('flower-pot')"
          @mouseleave="hideHint"
        >
          <div class="pot-base"></div>
          <div class="plant" :class="pot.stage">{{ pot.plant }}</div>
          <div class="growth-sparkles" v-if="pot.growing">✨</div>
        </div>
      </div>
      
      <!-- Interaction Hints -->
      <div class="interaction-hint" v-if="currentHint" :style="hintPosition">
        {{ currentHint }}
      </div>
    </div>
    
    <!-- Sky and Lighting Effects -->
    <div class="sky-layer" :style="skyStyle"></div>
    <div class="lighting-overlay" :class="timeClass"></div>
    
    <!-- Welcome Message -->
    <div class="welcome-message" v-if="showWelcome">
      <h1>Welcome home, adventurer!</h1>
      <p>Let's go explore my city!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMultiLayerParallax } from '~/composables/useParallax'
import { useVillageState } from '~/composables/useVillageState'

// Parallax system
const { background, midground, foreground } = useMultiLayerParallax()

// Village state
const { 
  state, 
  discover, 
  hasDiscovered, 
  cycleTimeOfDay: cycleDayNight,
  discoveryCount 
} = useVillageState()

// Computed properties for easy access
const timeOfDay = computed(() => state.value.timeOfDay)
const weather = computed(() => state.value.weather)

// Time-based styling
const timeClass = computed(() => `time-${timeOfDay.value}`)

const skyStyle = computed(() => {
  const gradients = {
    dawn: 'linear-gradient(to bottom, #FF9A8B, #A8E6CF)',
    day: 'linear-gradient(to bottom, #87CEEB, #98D8E8)', 
    dusk: 'linear-gradient(to bottom, #FF6B6B, #FFE66D)',
    night: 'linear-gradient(to bottom, #191970, #000000)'
  }
  return { background: gradients[timeOfDay.value] }
})

// Interactive elements state
const wellState = ref<'idle' | 'lowered' | 'revealing'>('idle')
const currentWisdom = ref('')
const showWelcome = ref(true)
const currentHint = ref('')
const hintPosition = ref({ top: '0px', left: '0px' })

// Birds animation
const birds = ref([
  { 
    id: 1, 
    style: { 
      left: '20%', 
      top: '15%', 
      animation: 'bird-fly 15s infinite linear',
      fontSize: '24px'
    }
  },
  { 
    id: 2, 
    style: { 
      left: '60%', 
      top: '25%', 
      animation: 'bird-fly 20s infinite linear',
      animationDelay: '5s',
      fontSize: '20px'
    }
  }
])

// Cat position and behavior
const catPosition = ref({ left: '45%', top: '70%', fontSize: '32px' })

// Flower pots for career growth metaphor
const flowerPots = ref([
  {
    style: { left: '35%', top: '75%' },
    stage: 'seed',
    plant: '🌱',
    milestone: '2017 Competition',
    growing: false
  },
  {
    style: { left: '50%', top: '78%' },
    stage: 'seed', 
    plant: '🌱',
    milestone: 'First Job at Portofolio',
    growing: false
  },
  {
    style: { left: '65%', top: '75%' },
    stage: 'seed',
    plant: '🌱', 
    milestone: 'Backend Lead',
    growing: false
  },
  {
    style: { left: '42%', top: '82%' },
    stage: 'seed',
    plant: '🌱',
    milestone: 'CTO at TurnkeyID',
    growing: false
  },
  {
    style: { left: '58%', top: '82%' },
    stage: 'seed',
    plant: '🌱',
    milestone: 'Current Success', 
    growing: false
  }
])

const growthStages = [
  { stage: 'seed', plant: '🌱', description: 'A tiny seed of potential...' },
  { stage: 'sprout', plant: '🌿', description: 'Growing with learning...' },
  { stage: 'flower', plant: '🌸', description: 'Blooming into expertise...' },
  { stage: 'bloom', plant: '🌺', description: 'Full mastery achieved!' }
]

// Flag animation for guild hall
const flagAnimation = computed(() => ({
  animation: 'flag-wave 3s ease-in-out infinite'
}))

// Wisdom quotes for the well
const wisdomQuotes = [
  "I want my simple life to become legacy",
  "Invest in myself, then invest in other people", 
  "With great commits comes great responsibility",
  "Never gonna give you up, never gonna let servers down",
  "There are only two hard things in programming: cache invalidation, naming things, and off-by-one errors"
]

// Methods
const enterBuilding = (building: string) => {
  discover(`building-${building}`)
  // TODO: Implement scene transition
  console.log(`Entering ${building}`)
}

const interactWithWell = () => {
  if (wellState.value === 'idle') {
    wellState.value = 'lowered'
    discover('village-well')
    
    setTimeout(() => {
      wellState.value = 'revealing'
      currentWisdom.value = wisdomQuotes[Math.floor(Math.random() * wisdomQuotes.length)]
    }, 1500)
    
    setTimeout(() => {
      wellState.value = 'idle'
      currentWisdom.value = ''
    }, 5000)
  }
}

const cycleTimeOfDay = () => {
  cycleDayNight()
  discover('street-lamp')
}

const followBird = (bird: any) => {
  discover('flying-bird')
  
  // Add visual feedback
  bird.style.animation = 'bird-guided-flight 3s ease-in-out forwards'
  
  // Show navigation hint
  currentHint.value = `Following ${bird.id === 1 ? 'Chirpy' : 'Tweety'} to new discoveries!`
  
  setTimeout(() => {
    // Reset bird animation
    bird.style.animation = bird.id === 1 ? 'bird-fly 15s infinite linear' : 'bird-fly 20s infinite linear'
    hideHint()
    
    // Guide to different buildings based on bird
    if (bird.id === 1) {
      currentHint.value = "Chirpy suggests checking the Workshop!"
      setTimeout(() => {
        hideHint()
      }, 3000)
    } else {
      currentHint.value = "Tweety thinks the Library might interest you!"
      setTimeout(() => {
        hideHint()
      }, 3000)
    }
  }, 3000)
}

const catBehaviors = [
  { position: { left: '25%', top: '65%' }, hint: "Meow! I sense hidden memories near the Library..." },
  { position: { left: '65%', top: '75%' }, hint: "Purr... The Workshop smells like fresh code!" },
  { position: { left: '45%', top: '60%' }, hint: "The well holds ancient wisdom, human..." },
  { position: { left: '30%', top: '55%' }, hint: "Follow me to discover the village secrets!" },
  { position: { left: '70%', top: '50%' }, hint: "Something glitters near the Forge..." }
]

let catInteractionCount = 0

const interactWithCat = () => {
  discover('village-cat')
  catInteractionCount++
  
  // Cat becomes more helpful with each interaction
  const behavior = catBehaviors[Math.min(catInteractionCount - 1, catBehaviors.length - 1)]
  
  // Move cat with personality
  catPosition.value = {
    ...behavior.position,
    fontSize: '32px',
    transition: 'all 2s ease'
  }
  
  // Show cat's hint
  currentHint.value = behavior.hint
  setTimeout(() => {
    hideHint()
  }, 4000)
  
  // Special behavior after 5 interactions
  if (catInteractionCount >= 5) {
    discover('cat-master-friendship')
    setTimeout(() => {
      currentHint.value = "🐱✨ Sudo the cat reveals the secret anime corner! Check behind the Tavern..."
      setTimeout(() => {
        hideHint()
      }, 6000)
    }, 2000)
  }
}

const weatherCycle = ['sunny', 'cloudy', 'rainy', 'snowy']
let weatherIndex = 0

const changeWeather = () => {
  weatherIndex = (weatherIndex + 1) % weatherCycle.length
  const newWeather = weatherCycle[weatherIndex]
  
  state.value.weather = newWeather
  discover('weather-vane')
  
  const weatherMessages = {
    sunny: "☀️ Sunny skies reveal your 'hot' technologies!",
    cloudy: "☁️ Cloudy thoughts perfect for problem-solving...",
    rainy: "🌧️ Rain brings creative introspection...", 
    snowy: "❄️ Snow time for cool experimental projects!"
  }
  
  currentHint.value = weatherMessages[newWeather]
  setTimeout(() => {
    hideHint()
  }, 3000)
}

const growFlower = (index: number) => {
  const pot = flowerPots.value[index]
  const currentStageIndex = growthStages.findIndex(stage => stage.stage === pot.stage)
  
  if (currentStageIndex < growthStages.length - 1) {
    pot.growing = true
    discover(`flower-growth-${index}`)
    
    setTimeout(() => {
      const nextStage = growthStages[currentStageIndex + 1]
      pot.stage = nextStage.stage
      pot.plant = nextStage.plant
      pot.growing = false
      
      currentHint.value = `🌱 ${pot.milestone}: ${nextStage.description}`
      setTimeout(() => {
        hideHint()
      }, 3000)
    }, 1000)
  } else {
    currentHint.value = `🌺 ${pot.milestone} has reached full bloom! Your journey continues...`
    setTimeout(() => {
      hideHint()
    }, 3000)
  }
}

const showHint = (element: string, event?: MouseEvent) => {
  const hints = {
    well: "Click to draw wisdom from the depths",
    lamp: "Toggle day and night", 
    cat: "The village guide has secrets",
    'weather-vane': "Spin to change the village weather and mood",
    'flower-pot': "Click to grow your career milestones"
  }
  currentHint.value = hints[element] || ''
  
  if (event) {
    hintPosition.value = {
      top: `${event.clientY - 40}px`,
      left: `${event.clientX}px`
    }
  }
}

const hideHint = () => {
  currentHint.value = ''
}

// Hide welcome message after exploration starts
setTimeout(() => {
  showWelcome.value = false
}, 8000)
</script>

<style scoped>
.town-square {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  cursor: crosshair;
}

/* Parallax Layers */
.parallax-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.parallax-layer.foreground {
  pointer-events: auto;
}

.sky-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  transition: background 2s ease;
}

.lighting-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: none;
  transition: all 2s ease;
}

.lighting-overlay.time-night {
  background: rgba(25, 25, 112, 0.3);
}

.lighting-overlay.time-dusk {
  background: rgba(255, 107, 107, 0.2);
}

/* Background Elements */
.mountains {
  position: absolute;
  bottom: 40%;
  left: 0;
  width: 100%;
  height: 30%;
  background: linear-gradient(135deg, #4B0082 0%, #663399 50%, #8A2BE2 100%);
  clip-path: polygon(0% 100%, 20% 60%, 40% 80%, 60% 40%, 80% 70%, 100% 50%, 100% 100%);
  opacity: 0.7;
}

.distant-clouds {
  position: absolute;
  top: 10%;
  left: 0;
  width: 100%;
  height: 20%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><ellipse cx="20" cy="15" rx="15" ry="8" fill="rgba(255,255,255,0.3)"/><ellipse cx="60" cy="12" rx="20" ry="6" fill="rgba(255,255,255,0.2)"/><ellipse cx="85" cy="16" rx="12" ry="5" fill="rgba(255,255,255,0.25)"/></svg>') repeat-x;
  animation: cloud-drift 60s infinite linear;
}

.grass-field {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: linear-gradient(to top, #228B22 0%, #32CD32 50%, #7CFC00 100%);
  opacity: 0.8;
}

.cobblestone-path {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10%;
  background: radial-gradient(circle at 25% 50%, #696969 1px, transparent 1px),
              radial-gradient(circle at 75% 50%, #808080 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
  opacity: 0.6;
}

@keyframes cloud-drift {
  0% { transform: translateX(-10%); }
  100% { transform: translateX(110%); }
}

/* Buildings */
.buildings-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.building {
  position: absolute;
  cursor: pointer;
  transition: transform 0.3s ease;
  pointer-events: auto;
  filter: drop-shadow(4px 4px 8px rgba(0,0,0,0.3));
}

.building:hover {
  transform: scale(1.05) translateY(-5px);
  filter: drop-shadow(6px 6px 12px rgba(0,0,0,0.4));
}

.workshop {
  left: 60%;
  top: 45%;
  width: 120px;
  height: 80px;
}

.library {
  left: 15%;
  top: 40%;
  width: 100px;
  height: 90px;
}

.tavern {
  left: 20%;
  top: 60%;
  width: 110px;
  height: 75px;
}

.guild-hall {
  left: 45%;
  top: 25%;
  width: 130px;
  height: 100px;
}

.forge {
  left: 75%;
  top: 65%;
  width: 90px;
  height: 70px;
}

.building-base {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #D2691E 0%, #8B4513 50%, #654321 100%);
  border-radius: 12px 12px 6px 6px;
  border: 3px solid #5D4037;
  position: relative;
}

.building-base::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -5px;
  right: -5px;
  height: 15px;
  background: linear-gradient(135deg, #B22222 0%, #8B0000 100%);
  border-radius: 15px;
  border: 2px solid #5D4037;
}

.building-base::after {
  content: '';
  position: absolute;
  top: 20%;
  left: 20%;
  width: 60%;
  height: 60%;
  background: linear-gradient(135deg, #CD853F 0%, #A0522D 100%);
  border-radius: 4px;
  border: 1px solid #5D4037;
}

/* Building-specific styling */
.workshop .building-base {
  background: linear-gradient(135deg, #D2691E 0%, #8B4513 50%, #654321 100%);
}

.workshop .building-base::before {
  background: linear-gradient(135deg, #B22222 0%, #8B0000 100%);
}

.library .building-base {
  background: linear-gradient(135deg, #9370DB 0%, #663399 50%, #4B0082 100%);
}

.library .building-base::before {
  background: linear-gradient(135deg, #8B008B 0%, #660066 100%);
}

.tavern .building-base {
  background: linear-gradient(135deg, #228B22 0%, #006400 50%, #004d00 100%);
}

.tavern .building-base::before {
  background: linear-gradient(135deg, #8B4513 0%, #654321 100%);
}

.guild-hall .building-base {
  background: linear-gradient(135deg, #FFD700 0%, #DAA520 50%, #B8860B 100%);
}

.guild-hall .building-base::before {
  background: linear-gradient(135deg, #DC143C 0%, #B22222 100%);
}

.forge .building-base {
  background: linear-gradient(135deg, #696969 0%, #2F4F4F 50%, #1C1C1C 100%);
}

.forge .building-base::before {
  background: linear-gradient(135deg, #FF4500 0%, #FF6347 100%);
}

/* Interactive Elements */
.interactive-element {
  cursor: pointer;
  transition: transform 0.3s ease;
  pointer-events: auto;
}

.interactive-element:hover {
  transform: scale(1.1);
}

.village-well {
  position: absolute;
  left: 45%;
  top: 55%;
  width: 60px;
  height: 60px;
  z-index: 3;
}

.well-base {
  width: 60px;
  height: 40px;
  background: radial-gradient(circle at 30% 30%, #A9A9A9, #696969, #2F4F4F);
  border-radius: 50%;
  border: 4px solid #556B2F;
  position: relative;
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.4));
}

.well-base::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 8px;
  background: linear-gradient(135deg, #8B4513, #654321);
  border-radius: 4px;
  border: 2px solid #5D4037;
}

.well-base::after {
  content: '💧';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  opacity: 0.7;
}

.well-bucket {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 15px;
  background: #8B4513;
  border-radius: 2px;
  transition: transform 1.5s ease;
}

.well-bucket.lowered {
  transform: translateX(-50%) translateY(30px);
}

.wisdom-scroll {
  position: absolute;
  top: -80px;
  left: -40px;
  width: 140px;
  padding: 10px;
  background: #F5DEB3;
  border: 2px solid #8B4513;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
  opacity: 0;
  transform: scale(0.8);
  transition: all 1s ease;
  z-index: 10;
}

.wisdom-scroll.visible {
  opacity: 1;
  transform: scale(1);
}

.street-lamp {
  position: absolute;
  left: 75%;
  top: 35%;
  width: 20px;
  height: 80px;
  z-index: 3;
}

.lamp-post {
  width: 12px;
  height: 60px;
  background: linear-gradient(135deg, #2F4F4F, #1C1C1C);
  margin: 0 auto;
  border-radius: 2px;
  position: relative;
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
}

.lamp-post::before {
  content: '';
  position: absolute;
  bottom: -5px;
  left: -8px;
  width: 28px;
  height: 12px;
  background: linear-gradient(135deg, #696969, #2F4F4F);
  border-radius: 6px;
}

.lamp-light {
  width: 35px;
  height: 25px;
  background: radial-gradient(circle, #FFD700, #FFA500);
  border-radius: 50% 50% 45% 45%;
  margin: -12px auto 0;
  transition: all 0.5s ease;
  opacity: 0.3;
  border: 2px solid #8B4513;
  position: relative;
}

.lamp-light::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: #2F4F4F;
  border-radius: 50%;
}

.lamp-light.glowing {
  opacity: 1;
  box-shadow: 
    0 0 20px #FFD700,
    0 0 40px rgba(255, 215, 0, 0.3),
    inset 0 0 10px rgba(255, 255, 255, 0.2);
}

/* Birds */
.birds-container {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 4;
}

.bird {
  position: absolute;
  z-index: 4;
  transition: all 0.5s ease;
  filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));
  animation: bird-bob 2s ease-in-out infinite;
}

.bird:hover {
  transform: scale(1.3);
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.4));
}

.village-cat {
  position: absolute;
  z-index: 4;
  transition: all 2s ease;
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
  animation: cat-idle 3s ease-in-out infinite;
}

.village-cat:hover {
  transform: scale(1.2);
  animation: cat-excited 0.5s ease-in-out;
}

/* Welcome Message */
.welcome-message {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  z-index: 10;
  animation: welcome-fade 8s ease forwards;
}

.welcome-message h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-family: 'Fantasy', serif;
}

.welcome-message p {
  font-size: 1.2rem;
}

/* Hints */
.interaction-hint {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  transform: translateY(-100%);
}

/* Animations */
@keyframes bird-fly {
  0% { left: -5%; }
  100% { left: 105%; }
}

@keyframes bird-bob {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
}

@keyframes cat-idle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(1deg); }
  75% { transform: rotate(-1deg); }
}

@keyframes cat-excited {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1) rotate(5deg); }
}

@keyframes flag-wave {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

@keyframes welcome-fade {
  0% { opacity: 1; }
  70% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
}

@keyframes bird-guided-flight {
  0% { transform: scale(1) translateY(0); }
  25% { transform: scale(1.2) translateY(-10px) rotate(5deg); }
  50% { transform: scale(1.3) translateY(-20px) rotate(-5deg); }
  75% { transform: scale(1.2) translateY(-15px) rotate(3deg); }
  100% { transform: scale(1.1) translateY(-10px) rotate(0deg); }
}

/* Smoke animation */
.smoke {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 15px;
  height: 15px;
  background: rgba(200, 200, 200, 0.6);
  border-radius: 50%;
  animation: smoke-rise 4s infinite linear;
}

@keyframes smoke-rise {
  0% {
    transform: translateX(-50%) translateY(0) scale(0.5);
    opacity: 0.8;
  }
  100% {
    transform: translateX(-50%) translateY(-60px) scale(1.2);
    opacity: 0;
  }
}

/* Window lighting */
.windows {
  position: absolute;
  top: 20%;
  left: 20%;
  right: 20%;
}

.window {
  width: 15px;
  height: 15px;
  background: rgba(255, 215, 0, 0.3);
  margin: 5px;
  display: inline-block;
  border-radius: 2px;
  transition: all 0.5s ease;
}

.window.lit {
  background: rgba(255, 215, 0, 0.9);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
}

/* Weather Vane */
.weather-vane {
  position: absolute;
  top: -25px;
  right: 10px;
  width: 30px;
  height: 30px;
  z-index: 5;
}

.vane-post {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 3px;
  height: 20px;
  background: linear-gradient(135deg, #2F4F4F, #1C1C1C);
  border-radius: 2px;
}

.vane-arrow {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 15px solid #8B4513;
  transition: all 0.8s ease;
}

.vane-arrow.weather-sunny {
  transform: translate(-50%, -50%) rotate(0deg);
  border-bottom-color: #FFD700;
}

.vane-arrow.weather-cloudy {
  transform: translate(-50%, -50%) rotate(90deg);
  border-bottom-color: #696969;
}

.vane-arrow.weather-rainy {
  transform: translate(-50%, -50%) rotate(180deg);
  border-bottom-color: #4169E1;
}

.vane-arrow.weather-snowy {
  transform: translate(-50%, -50%) rotate(270deg);
  border-bottom-color: #F0F8FF;
}

.vane-directions {
  position: absolute;
  width: 100%;
  height: 100%;
}

.direction {
  position: absolute;
  font-size: 8px;
  font-weight: bold;
  color: #2F4F4F;
}

.direction.n { top: 0; left: 50%; transform: translateX(-50%); }
.direction.s { bottom: 0; left: 50%; transform: translateX(-50%); }
.direction.e { right: 0; top: 50%; transform: translateY(-50%); }
.direction.w { left: 0; top: 50%; transform: translateY(-50%); }

/* Flower Garden */
.flower-garden {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 4;
}

.flower-pot {
  position: absolute;
  width: 40px;
  height: 40px;
  transition: transform 0.3s ease;
}

.flower-pot:hover {
  transform: scale(1.1);
}

.pot-base {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 25px;
  height: 15px;
  background: linear-gradient(135deg, #8B4513 0%, #654321 100%);
  border-radius: 2px 2px 8px 8px;
  border: 2px solid #5D4037;
}

.pot-base::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -2px;
  right: -2px;
  height: 5px;
  background: linear-gradient(135deg, #A0522D 0%, #8B4513 100%);
  border-radius: 3px;
}

.plant {
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  transition: all 0.8s ease;
  z-index: 2;
}

.plant.seed {
  font-size: 12px;
  opacity: 0.7;
}

.plant.sprout {
  font-size: 14px;
  opacity: 0.8;
}

.plant.flower {
  font-size: 16px;
  opacity: 0.9;
}

.plant.bloom {
  font-size: 18px;
  opacity: 1;
  animation: flower-bloom 2s ease-in-out infinite;
}

.growth-sparkles {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  animation: sparkle-growth 1s ease-in-out;
  z-index: 3;
}

@keyframes flower-bloom {
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.1); }
}

@keyframes sparkle-growth {
  0% { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0); }
  50% { opacity: 1; transform: translateX(-50%) translateY(-5px) scale(1.2); }
  100% { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.8); }
}

/* Responsive */
@media (max-width: 768px) {
  .building {
    transform: scale(0.8);
  }
  
  .welcome-message h1 {
    font-size: 2rem;
  }
  
  .welcome-message p {
    font-size: 1rem;
  }
}
</style>