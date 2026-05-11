/**
 * Window-scroll -> normalized [0..1] progress.
 * Per spec §D.3. rAF-throttled.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useScrollProgress() {
  const progress = ref(0)
  let raf = 0
  let pending = false

  function compute() {
    pending = false
    if (typeof window === 'undefined') return
    const scrolled = window.scrollY
    const max = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    )
    progress.value = Math.min(1, Math.max(0, scrolled / max))
  }

  function onScroll() {
    if (pending) return
    pending = true
    raf = requestAnimationFrame(compute)
  }

  onMounted(() => {
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    if (raf) cancelAnimationFrame(raf)
  })

  return { progress }
}
