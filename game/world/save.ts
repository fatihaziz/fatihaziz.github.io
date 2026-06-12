/**
 * Aetherveil persistent state -- localStorage wrapper.
 * Keys live under "aetherveil.*". Every accessor is exception-safe so the
 * game still runs with storage blocked (private mode, kiosk).
 */

const PREFIX = 'aetherveil.'

function get(key: string): string | null {
  try {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(PREFIX + key)
  } catch { return null }
}

function set(key: string, val: string): void {
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(PREFIX + key, val)
  } catch { /* ignore */ }
}

// ---- first visit ----------------------------------------------------------

export function isFirstVisit(): boolean {
  return get('visited') === null
}

export function markVisited(): void {
  set('visited', '1')
}

// ---- buildings ------------------------------------------------------------

export function isBuildingVisited(key: string): boolean {
  return get(`visited.${key}`) === '1'
}

export function markBuildingVisited(key: string): void {
  set(`visited.${key}`, '1')
}

// ---- findings (collectibles) ----------------------------------------------
// A finding is a small discovery: shells, the pool coin, the inventor's rune,
// petting all five cats, hearing all three riddles, the mythic catch.

export interface Finding {
  key: string
  label: string
}

export const ALL_FINDINGS: Finding[] = [
  { key: 'shell.1', label: 'a striped shell' },
  { key: 'shell.2', label: 'a rose shell' },
  { key: 'shell.3', label: 'a moon-white shell' },
  { key: 'shell.4', label: 'a dusk-blue shell' },
  { key: 'shell.5', label: 'a sun-gold shell' },
  { key: 'coin.pool', label: 'an old copper coin' },
  { key: 'rune.inventor', label: 'a tiny rune of unknown make' },
  { key: 'cats.allFive', label: 'the trust of five cats' },
  { key: 'riddles.allThree', label: "the hermit's three riddles" },
  { key: 'fish.mythic', label: 'the blessing of the dock-keeper' },
]

function readFindings(): Record<string, boolean> {
  try {
    const raw = get('findings')
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

export function hasFinding(key: string): boolean {
  return readFindings()[key] === true
}

export function addFinding(key: string): boolean {
  const all = readFindings()
  if (all[key]) return false
  all[key] = true
  set('findings', JSON.stringify(all))
  return true
}

export function findingsCount(): number {
  const all = readFindings()
  return ALL_FINDINGS.filter((f) => all[f.key]).length
}

export function findingsLabels(): string[] {
  const all = readFindings()
  return ALL_FINDINGS.filter((f) => all[f.key]).map((f) => f.label)
}

// ---- fishing log ----------------------------------------------------------

export function recordCatch(species: string): void {
  try {
    const raw = get('fishing')
    const log: Record<string, number> = raw ? JSON.parse(raw) : {}
    log[species] = (log[species] || 0) + 1
    set('fishing', JSON.stringify(log))
  } catch { /* ignore */ }
}

export function catchCount(): number {
  try {
    const raw = get('fishing')
    if (!raw) return 0
    const log: Record<string, number> = JSON.parse(raw)
    return Object.values(log).reduce((a, b) => a + b, 0)
  } catch { return 0 }
}

// ---- small flags (cats petted, riddles heard) ------------------------------

export function flagSet(group: string, id: string): void {
  try {
    const raw = get(group)
    const all: Record<string, boolean> = raw ? JSON.parse(raw) : {}
    all[id] = true
    set(group, JSON.stringify(all))
  } catch { /* ignore */ }
}

export function flagCount(group: string): number {
  try {
    const raw = get(group)
    if (!raw) return 0
    return Object.values(JSON.parse(raw)).filter(Boolean).length
  } catch { return 0 }
}

// ---- audio preference ------------------------------------------------------

export function isMuted(): boolean {
  return get('muted') === '1'
}

export function setMuted(m: boolean): void {
  set('muted', m ? '1' : '0')
}
