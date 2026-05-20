// Shared palette + font sets for the journal. Used by the procedural backdrop,
// the editor style picker, and the reader. Colors are ported from the laut
// novel themes so the journal shares its dusk-lit, papery mood.

export interface JournalPalette {
  name: string
  label: string
  bgFrom: string // backdrop gradient top
  bgTo: string // backdrop gradient bottom
  ink: string // backdrop wave/particle color
  glow: string // backdrop orb/star color
  paper: string // reading card background
  paperInk: string // reading body text
  accent: string // drop-cap, emphasis, rules
}

export const PALETTES: JournalPalette[] = [
  { name: 'oceanDeep', label: 'Ocean Deep', bgFrom: '#3e6e80', bgTo: '#13283a', ink: '#0c1820', glow: '#a8d4d8', paper: '#e6ecee', paperInk: '#1c2630', accent: '#347a92' },
  { name: 'rosyDawn', label: 'Rosy Dawn', bgFrom: '#f0bfc4', bgTo: '#c47488', ink: '#5a2436', glow: '#fde0d8', paper: '#f6e6e0', paperInk: '#3a2024', accent: '#c46a78' },
  { name: 'warmDust', label: 'Warm Dust', bgFrom: '#d6b787', bgTo: '#a8794a', ink: '#5b3a1d', glow: '#f0d9a8', paper: '#f4ebd9', paperInk: '#2d231a', accent: '#a87234' },
  { name: 'hiddenDeep', label: 'Hidden Deep', bgFrom: '#3a4258', bgTo: '#1c2030', ink: '#0e1018', glow: '#7c8aae', paper: '#e8e6df', paperInk: '#23262d', accent: '#5d6680' },
  { name: 'calmSage', label: 'Calm Sage', bgFrom: '#aabba0', bgTo: '#6a8472', ink: '#2c3e34', glow: '#dde6c8', paper: '#eef0e6', paperInk: '#26302a', accent: '#5e7a5a' },
  { name: 'warmHope', label: 'Warm Hope', bgFrom: '#e8b690', bgTo: '#b8704a', ink: '#5a2e1c', glow: '#fbe0c6', paper: '#f6ead9', paperInk: '#3a261a', accent: '#c47a48' },
  { name: 'coldGray', label: 'Cold Gray', bgFrom: '#a4adb8', bgTo: '#5d6776', ink: '#1f2a36', glow: '#cdd5dd', paper: '#e9eaec', paperInk: '#1f242c', accent: '#5b6a7a' },
  { name: 'fadingGold', label: 'Fading Gold', bgFrom: '#cdaf72', bgTo: '#8a6a32', ink: '#3e2e10', glow: '#f5e3b8', paper: '#f0e6d2', paperInk: '#2e2517', accent: '#a08040' },
]

export function paletteByName(name?: string): JournalPalette {
  return PALETTES.find((p) => p.name === name) || PALETTES[0]
}

export interface JournalFont {
  name: string
  label: string
  stack: string
}

export const FONTS: JournalFont[] = [
  { name: 'cormorant', label: 'Cormorant', stack: "'Cormorant Garamond', Georgia, serif" },
  { name: 'cinzel', label: 'Cinzel', stack: "'Cinzel', 'Cormorant Garamond', serif" },
  { name: 'georgia', label: 'Georgia', stack: "Georgia, 'Times New Roman', serif" },
  { name: 'sans', label: 'Sans', stack: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" },
]

export function fontByName(name?: string): JournalFont {
  return FONTS.find((f) => f.name === name) || FONTS[0]
}
