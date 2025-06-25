/**
 * Village State Management
 * Central state for all village interactions and discoveries
 */
import { ref, computed } from 'vue'

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night'
export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy'
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export interface VillageState {
  // Environment
  timeOfDay: TimeOfDay
  weather: Weather
  season: Season
  
  // Discovery progress
  discoveredElements: Set<string>
  interactionCount: number
  explorationTime: number
  
  // Current scene
  currentScene: string
  isTransitioning: boolean
}

const state = ref<VillageState>({
  timeOfDay: 'day',
  weather: 'sunny', 
  season: 'spring',
  discoveredElements: new Set(),
  interactionCount: 0,
  explorationTime: 0,
  currentScene: 'town-square',
  isTransitioning: false
})

export function useVillageState() {
  
  // Discovery methods
  const discover = (elementId: string) => {
    state.value.discoveredElements.add(elementId)
    state.value.interactionCount++
  }
  
  const hasDiscovered = (elementId: string) => {
    return state.value.discoveredElements.has(elementId)
  }
  
  // Environment controls
  const cycleTimeOfDay = () => {
    const times: TimeOfDay[] = ['dawn', 'day', 'dusk', 'night']
    const currentIndex = times.indexOf(state.value.timeOfDay)
    const nextIndex = (currentIndex + 1) % times.length
    state.value.timeOfDay = times[nextIndex]
  }
  
  const changeWeather = (weather: Weather) => {
    state.value.weather = weather
  }
  
  // Discovery progress computed
  const discoveryCount = computed(() => state.value.discoveredElements.size)
  const discoveryLevel = computed(() => {
    const count = discoveryCount.value
    if (count < 3) return 'beginner'
    if (count < 8) return 'explorer' 
    if (count < 15) return 'detective'
    return 'master'
  })
  
  return {
    state,
    discover,
    hasDiscovered,
    cycleTimeOfDay,
    changeWeather,
    discoveryCount,
    discoveryLevel
  }
}