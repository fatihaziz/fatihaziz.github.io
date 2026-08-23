import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'
import { getLunarDb } from './lunar'

// ---------------------------------------------------------------------------
// Lunar tracker auth (phase 1).
// Two fixed accounts, keys injected via secrets (never stored in the repo):
//   fatih   (role dev)     <- NUXT_LUNAR_DEV_KEY
//   product (role product) <- NUXT_LUNAR_PRODUCT_KEY (shared team account)
// A missing key disables that account (fail closed - no default credentials).
// The same access key doubles as the long-lived api_token for LLM/omp agents
// via the X-Api-Key header; humans use POST /api/lunar/auth/login and a
// Bearer session token (SQLite `sessions`, 30-day expiry).
// ---------------------------------------------------------------------------

export type LunarRole = 'dev' | 'product'

export interface LunarUser {
  username: string
  role: LunarRole
}

const SESSION_DAYS = 30

function configuredUsers(): Array<LunarUser & { key: string }> {
  const cfg = useRuntimeConfig()
  const all: Array<LunarUser & { key: string }> = [
    { username: 'fatih', role: 'dev', key: String(cfg.lunarDevKey || '') },
    { username: 'product', role: 'product', key: String(cfg.lunarProductKey || '') },
  ]
  return all.filter((u) => u.key.length >= 8)
}

// Constant-time compare on fixed-length digests (inputs vary in length).
function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export function loginLunar(
  username: string,
  key: string,
): { token: string; user: LunarUser; expiresAt: string } | null {
  const user = configuredUsers().find((u) => u.username === username && safeEqual(u.key, key))
  if (!user) return null
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000).toISOString()
  const db = getLunarDb()
  db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run()
  db.prepare('INSERT INTO sessions (token, username, role, expires_at) VALUES (?, ?, ?, ?)').run(
    token,
    user.username,
    user.role,
    expiresAt,
  )
  return { token, user: { username: user.username, role: user.role }, expiresAt }
}

export function logoutLunar(token: string) {
  getLunarDb().prepare('DELETE FROM sessions WHERE token = ?').run(token)
}

export function getLunarUser(event: H3Event): LunarUser | null {
  // Agents (LLM / omp): X-Api-Key carries the account's access key directly.
  const apiKey = getHeader(event, 'x-api-key')
  if (apiKey) {
    const user = configuredUsers().find((u) => safeEqual(u.key, apiKey))
    if (user) return { username: user.username, role: user.role }
    return null
  }
  // Humans: Bearer session token from POST /api/lunar/auth/login.
  const auth = getHeader(event, 'authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (!token) return null
  const row = getLunarDb()
    .prepare("SELECT username, role FROM sessions WHERE token = ? AND expires_at > datetime('now')")
    .get(token) as { username: string; role: LunarRole } | undefined
  return row ? { username: row.username, role: row.role } : null
}

export function requireLunarUser(event: H3Event, roles?: LunarRole[]): LunarUser {
  const user = getLunarUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Login dulu (atau kirim X-Api-Key)' })
  }
  if (roles && !roles.includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: `Role ${user.role} tidak boleh melakukan ini` })
  }
  return user
}
