/**
 * Tiny WebAudio synth -- zero asset files. Every cue is generated from
 * oscillators at very low gain so it stays ambient, never startling.
 * The AudioContext is created lazily on the first user gesture
 * (browser autoplay policy) and the whole module no-ops when muted.
 */
import { isMuted, setMuted } from './save'

let ctx: AudioContext | null = null
let muted = true

export function initAudio(): void {
  muted = isMuted()
}

export function toggleMute(): boolean {
  muted = !muted
  setMuted(muted)
  return muted
}

export function audioMuted(): boolean {
  return muted
}

/** call on the first user gesture so later ambient cues are allowed to play */
export function unlockAudio(): void {
  ensureCtx()
}

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch { return null }
}

interface NoteOpts {
  freq: number
  dur: number          // seconds
  type?: OscillatorType
  gain?: number
  when?: number        // seconds from now
  slideTo?: number     // optional pitch slide target
}

function note(o: NoteOpts): void {
  if (muted) return
  const c = ensureCtx()
  if (!c) return
  try {
    const t0 = c.currentTime + (o.when ?? 0)
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = o.type ?? 'triangle'
    osc.frequency.setValueAtTime(o.freq, t0)
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t0 + o.dur)
    const peak = o.gain ?? 0.035
    g.gain.setValueAtTime(0, t0)
    g.gain.linearRampToValueAtTime(peak, t0 + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0004, t0 + o.dur)
    osc.connect(g)
    g.connect(c.destination)
    osc.start(t0)
    osc.stop(t0 + o.dur + 0.05)
  } catch { /* ignore */ }
}

// ---- cues -------------------------------------------------------------------

/** dialog advance / ui blip */
export function sfxBlip(): void {
  note({ freq: 660, dur: 0.07, type: 'square', gain: 0.018 })
}

/** door / scene transition whoosh */
export function sfxDoor(): void {
  note({ freq: 220, dur: 0.22, slideTo: 110, type: 'sine', gain: 0.04 })
}

/** finding collected ping */
export function sfxCollect(): void {
  note({ freq: 784, dur: 0.09, type: 'triangle' })
  note({ freq: 1175, dur: 0.14, when: 0.08, type: 'triangle' })
}

/** clock tower chime */
export function sfxChime(): void {
  note({ freq: 523, dur: 0.6, type: 'sine', gain: 0.03 })
  note({ freq: 392, dur: 0.8, when: 0.25, type: 'sine', gain: 0.025 })
}

/** bridge footstep echo */
export function sfxEcho(): void {
  note({ freq: 196, dur: 0.1, type: 'sine', gain: 0.02 })
  note({ freq: 196, dur: 0.08, when: 0.16, type: 'sine', gain: 0.01 })
}

/** fishing: bobber splash */
export function sfxSplash(): void {
  note({ freq: 340, dur: 0.12, slideTo: 120, type: 'sine', gain: 0.035 })
}

/** fishing: bite alert */
export function sfxBite(): void {
  note({ freq: 880, dur: 0.08, type: 'square', gain: 0.03 })
  note({ freq: 880, dur: 0.08, when: 0.12, type: 'square', gain: 0.03 })
}

/** fishing: catch fanfare (3 rising notes) */
export function sfxCatch(): void {
  note({ freq: 523, dur: 0.1, type: 'triangle' })
  note({ freq: 659, dur: 0.1, when: 0.1, type: 'triangle' })
  note({ freq: 784, dur: 0.2, when: 0.2, type: 'triangle' })
}

// ---- music hut: four tiny generated melodies --------------------------------

export interface Track {
  key: string
  name: string
  line: string
}

export const MUSIC_TRACKS: Track[] = [
  { key: 'walking', name: 'Walking Theme', line: 'for the road between doors' },
  { key: 'forge', name: 'Forge Hammer', line: 'for work that will not finish itself' },
  { key: 'sea', name: 'Sea Breeze', line: 'for the dock at low light' },
  { key: 'hearth', name: 'Hearth Glow', line: 'for the hour the inn quiets' },
]

// note sequences: [semitone offset from C5 (or -1 = rest), beats]
const MELODIES: Record<string, { tempo: number; type: OscillatorType; base: number; seq: [number, number][] }> = {
  walking: {
    tempo: 0.16, type: 'square', base: 523.25,
    seq: [[0, 1], [4, 1], [7, 1], [12, 1], [7, 1], [4, 1], [0, 1], [-1, 1],
          [2, 1], [5, 1], [9, 1], [14, 1], [9, 1], [5, 1], [2, 1], [-1, 1],
          [0, 1], [4, 1], [7, 1], [12, 2], [7, 1], [12, 2]],
  },
  forge: {
    tempo: 0.2, type: 'square', base: 130.81,
    seq: [[0, 1], [0, 1], [12, 1], [0, 1], [7, 1], [0, 1], [12, 1], [-1, 1],
          [0, 1], [0, 1], [10, 1], [0, 1], [7, 1], [5, 1], [3, 1], [0, 2]],
  },
  sea: {
    tempo: 0.3, type: 'sine', base: 392,
    seq: [[0, 2], [4, 1], [7, 2], [4, 1], [9, 2], [7, 2], [4, 1], [2, 2], [0, 3]],
  },
  hearth: {
    tempo: 0.26, type: 'triangle', base: 261.63,
    seq: [[0, 1], [4, 1], [7, 2], [4, 1], [7, 1], [9, 2], [7, 1], [4, 1], [2, 2], [4, 1], [0, 3]],
  },
}

let melodyTimer: number[] = []

export function stopMelody(): void {
  melodyTimer.forEach((id) => clearTimeout(id))
  melodyTimer = []
}

export function playMelody(key: string): void {
  if (muted) return
  stopMelody()
  const m = MELODIES[key]
  if (!m) return
  let t = 0
  for (const [semi, beats] of m.seq) {
    const dur = beats * m.tempo
    if (semi >= 0) {
      const freq = m.base * Math.pow(2, semi / 12)
      const id = window.setTimeout(() => {
        note({ freq, dur: dur * 0.92, type: m.type, gain: 0.03 })
      }, t * 1000)
      melodyTimer.push(id)
    }
    t += dur
  }
}
