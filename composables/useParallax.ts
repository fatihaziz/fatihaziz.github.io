/**
 * Parallax Mouse Tracking Composable
 * Creates depth effect by moving layers at different intensities based on mouse position
 */
import { ref, computed, watchEffect } from 'vue'
import { useMouse, useWindowSize } from '@vueuse/core'

export interface ParallaxLayer {
  x: number
  y: number
  intensity: number
}

export function useParallax(intensity = 0.05) {
  const { x: mouseX, y: mouseY } = useMouse()
  const { width, height } = useWindowSize()
  
  const x = ref(0)
  const y = ref(0)
  
  // Calculate parallax offset based on mouse position relative to center
  watchEffect(() => {
    const centerX = width.value / 2
    const centerY = height.value / 2
    
    x.value = (mouseX.value - centerX) * intensity
    y.value = (mouseY.value - centerY) * intensity
  })
  
  // Transform string for easy CSS application
  const transform = computed(() => 
    `translate3d(${x.value}px, ${y.value}px, 0)`
  )
  
  return {
    x: x.value,
    y: y.value,
    transform
  }
}

/**
 * Multi-layer parallax for complex scenes
 */
export function useMultiLayerParallax() {
  const backgroundParallax = useParallax(0.02)  // Subtle movement
  const midgroundParallax = useParallax(0.05)   // Medium movement
  const foregroundParallax = useParallax(0.08)  // More pronounced
  
  return {
    background: backgroundParallax,
    midground: midgroundParallax,
    foreground: foregroundParallax
  }
}