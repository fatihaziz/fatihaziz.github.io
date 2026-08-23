import { existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import Database from 'better-sqlite3'

// ---------------------------------------------------------------------------
// Lunar CRM project tracker storage.
// Separate SQLite file from the journal DB. Prod (Fly) sets
// LUNAR_DB_PATH=/data/lunar.db on the persistent volume; local dev falls back
// to <projectRoot>/data/lunar.db (gitignored).
// ---------------------------------------------------------------------------

export interface LunarFeature {
  id: number
  code: string        // M1..M14 or trial workstream code
  group_name: string  // 'milestone' | 'trial'
  title: string
  status: string      // planned | building | testing | done
  issues_done: number
  issues_total: number
  due: string
  sort: number
  ball: string        // dev | product (per-card ownership; main ball in settings)
}

export interface LunarTask {
  id: number
  title: string
  detail: string
  type: string        // task | bugfix
  points: number
  status: string      // todo | doing | waiting-feedback | done
  ball: string        // dev | product
  area: string        // free text: KYC, Onboarding, UI, ...
  created_by: string
  created_at: string
  updated_at: string
  done_at: string | null
  due: string         // YYYY-MM-DD deadline, '' = none
  archived: number    // 1 = soft-deleted (Arsip tab, out of SP math)
}

export interface LunarFeedback {
  id: number
  task_id: number | null
  feature_id: number | null
  author: string
  severity: string    // critical | major | minor | note
  body: string
  link: string        // gdocs / screenshot URL (optional)
  attachment: string  // uploaded image path (optional)
  status: string      // open | ack | resolved
  archived: number    // 1 = soft-deleted
  created_at: string
  updated_at: string
}

export interface LunarSubtask {
  id: number
  feature_id: number
  title: string
  status: string      // todo | doing | done
  issue_ref: string   // '#123' or ''
  points: number
  sort: number
}

export interface LunarQuestion {
  id: number
  feature_id: number
  author: string
  question: string
  answer: string
  answered_by: string
  attachment: string
  status: string      // open | answered
  archived: number    // 1 = soft-deleted
  created_at: string
  answered_at: string | null
}

export interface LunarSpLog {
  id: number
  task_id: number
  user: string
  auto: number        // 1 = synthetic remainder logged on done (reversible)
  points: number
  spent_on: string    // YYYY-MM-DD
  note: string
  created_at: string
}

export interface LunarActivity {
  id: number
  kind: string        // commit | issue
  ref: string         // short sha or #123
  title: string
  state: string       // running | done  (issue open/closed, commit landed)
  author: string
  url: string
  happened_at: string
}

let _db: Database.Database | null = null

function dbFile(): string {
  const explicit = process.env.LUNAR_DB_PATH?.trim()
  const file = explicit || join(process.cwd(), 'data', 'lunar.db')
  const dir = dirname(file)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return file
}

export function getLunarDb(): Database.Database {
  if (_db) return _db
  const db = new Database(dbFile())
  db.pragma('journal_mode = WAL')
  db.exec(`
    CREATE TABLE IF NOT EXISTS features (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      code         TEXT UNIQUE NOT NULL,
      group_name   TEXT NOT NULL DEFAULT 'milestone',
      title        TEXT NOT NULL,
      status       TEXT NOT NULL DEFAULT 'planned',
      issues_done  INTEGER NOT NULL DEFAULT 0,
      issues_total INTEGER NOT NULL DEFAULT 0,
      due          TEXT NOT NULL DEFAULT '',
      sort         INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT NOT NULL,
      detail     TEXT NOT NULL DEFAULT '',
      type       TEXT NOT NULL DEFAULT 'task',
      points     INTEGER NOT NULL DEFAULT 1,
      status     TEXT NOT NULL DEFAULT 'todo',
      ball       TEXT NOT NULL DEFAULT 'dev',
      area       TEXT NOT NULL DEFAULT '',
      created_by TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      done_at    TEXT
    );
    CREATE TABLE IF NOT EXISTS feedback (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id    INTEGER,
      author     TEXT NOT NULL DEFAULT '',
      severity   TEXT NOT NULL DEFAULT 'note',
      body       TEXT NOT NULL,
      status     TEXT NOT NULL DEFAULT 'open',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS activity (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      kind        TEXT NOT NULL,
      ref         TEXT NOT NULL,
      title       TEXT NOT NULL,
      state       TEXT NOT NULL DEFAULT 'running',
      author      TEXT NOT NULL DEFAULT '',
      url         TEXT NOT NULL DEFAULT '',
      happened_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(kind, ref)
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token      TEXT PRIMARY KEY,
      username   TEXT NOT NULL,
      role       TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sp_log (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id    INTEGER NOT NULL,
      user       TEXT NOT NULL DEFAULT '',
      points     INTEGER NOT NULL,
      spent_on   TEXT NOT NULL,
      note       TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS subtasks (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      feature_id INTEGER NOT NULL,
      title      TEXT NOT NULL,
      status     TEXT NOT NULL DEFAULT 'todo',
      issue_ref  TEXT NOT NULL DEFAULT '',
      points     INTEGER NOT NULL DEFAULT 1,
      sort       INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS questions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      feature_id  INTEGER NOT NULL,
      author      TEXT NOT NULL DEFAULT '',
      question    TEXT NOT NULL,
      answer      TEXT NOT NULL DEFAULT '',
      answered_by TEXT NOT NULL DEFAULT '',
      attachment  TEXT NOT NULL DEFAULT '',
      status      TEXT NOT NULL DEFAULT 'open',
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      answered_at TEXT
    );
    CREATE TABLE IF NOT EXISTS internal_notes (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT NOT NULL,
      body       TEXT NOT NULL DEFAULT '',
      tags       TEXT NOT NULL DEFAULT '',
      created_by TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS internal_checklist (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      group_code TEXT NOT NULL,
      code       TEXT UNIQUE NOT NULL,
      title      TEXT NOT NULL,
      status     TEXT NOT NULL DEFAULT 'todo',
      secret     INTEGER NOT NULL DEFAULT 0,
      note       TEXT NOT NULL DEFAULT '',
      updated_by TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `)
  migrate(db)
  _db = db
  seed(db)
  seedSubtasks(db)
  return db
}

// Additive column migrations for DBs created before phases 1-4. SQLite has no
// ADD COLUMN IF NOT EXISTS, so guard with pragma table_info.
function migrate(db: Database.Database) {
  const cols = (table: string) =>
    new Set((db.pragma(`table_info(${table})`) as Array<{ name: string }>).map((c) => c.name))
  const feedbackCols = cols('feedback')
  if (!feedbackCols.has('feature_id')) db.exec('ALTER TABLE feedback ADD COLUMN feature_id INTEGER')
  if (!feedbackCols.has('link')) db.exec("ALTER TABLE feedback ADD COLUMN link TEXT NOT NULL DEFAULT ''")
  if (!feedbackCols.has('attachment')) db.exec("ALTER TABLE feedback ADD COLUMN attachment TEXT NOT NULL DEFAULT ''")
  const featureCols = cols('features')
  if (!featureCols.has('ball')) db.exec("ALTER TABLE features ADD COLUMN ball TEXT NOT NULL DEFAULT 'dev'")
  const taskCols = cols('tasks')
  if (!taskCols.has('due')) db.exec("ALTER TABLE tasks ADD COLUMN due TEXT NOT NULL DEFAULT ''")
  // Soft delete (phase: UX overhaul 2026-07-22). Archived rows stay queryable
  // for the Arsip tab + restore; they leave all SP math.
  if (!taskCols.has('archived')) db.exec('ALTER TABLE tasks ADD COLUMN archived INTEGER NOT NULL DEFAULT 0')
  if (!feedbackCols.has('archived')) db.exec('ALTER TABLE feedback ADD COLUMN archived INTEGER NOT NULL DEFAULT 0')
  const questionCols = cols('questions')
  if (!questionCols.has('archived')) db.exec('ALTER TABLE questions ADD COLUMN archived INTEGER NOT NULL DEFAULT 0')
  const spCols = cols('sp_log')
  if (!spCols.has('auto')) {
    // auto=1 marks synthetic remainder rows logged when a task is set to done;
    // they are deleted again when the task leaves done (mis-click reversal).
    // Backfill: pre-flag rows written by the old code (exact note match).
    db.exec("ALTER TABLE sp_log ADD COLUMN auto INTEGER NOT NULL DEFAULT 0")
    db.exec("UPDATE sp_log SET auto = 1 WHERE note = 'auto-log saat done'")
  }
}

// --- settings ---------------------------------------------------------------

export function getSetting(key: string, fallback = ''): string {
  const row = getLunarDb().prepare('SELECT value FROM settings WHERE key = ?').get(key) as
    | { value: string }
    | undefined
  return row?.value ?? fallback
}

export function setSetting(key: string, value: string) {
  getLunarDb()
    .prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
    .run(key, value)
}

// --- seed -------------------------------------------------------------------

// Seeded once (guarded by settings.seeded). Sources:
// - docs/ROADMAP.md milestone table (issue totals per milestone)
// - tmp/lunar-crm-trial-plan.txt (27 Jul user-trial workstreams)
// - __TEAM_FEEDBACKS/2026-07-20 daily target tasks (initial task list)
function seed(db: Database.Database) {
  const seeded = db.prepare("SELECT value FROM settings WHERE key = 'seeded'").get() as
    | { value: string }
    | undefined
  if (seeded) return

  const insFeature = db.prepare(
    'INSERT INTO features (code, group_name, title, status, issues_done, issues_total, due, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  )
  // Only work that is actually on the 27 Jul trial path. The full-MVP roadmap
  // rows (SUMSUB, CREGIS, PayOK, rebate, greylabel, hardening, PAMM) were cut
  // on product's request 2026-07-20 - they are NOT part of the 27 Jul target.
  // Totals = real GitHub milestone issue counts (turnkey-devs/lunar-crm-project);
  // "sisa" per milestone = the genuinely trial-critical open issues.
  const milestones: Array<[string, string, string, number, number, string]> = [
    ['M1', 'API Gateway Foundation', 'testing', 9, 10, '2026-05-22'],
    ['M2', 'User Module + RBAC', 'done', 8, 8, '2026-05-22'],
    ['M3', 'Admin Control Plane', 'testing', 20, 22, '2026-05-29'],
    ['M7', 'Trading + Trade Panel (MT5)', 'testing', 20, 25, '2026-06-15'],
    ['M9', 'Email + In-App Notifications', 'testing', 14, 16, '2026-06-22'],
    ['M10', 'Whitelabel Multi-Tenant', 'testing', 14, 16, '2026-06-29'],
    ['M13', 'Production Launch', 'building', 11, 15, '2026-07-27'],
  ]
  milestones.forEach(([code, title, status, done, total, due], i) =>
    insFeature.run(code, 'milestone', title, status, done, total, due, i),
  )

  const trial: Array<[string, string, string]> = [
    ['KYC', 'KYC manual review workflow', 'testing'],
    ['MT5', 'Trading account - MetaTrader provisioning', 'building'],
    ['MONEY', 'Deposit & withdrawal reconciled', 'building'],
    ['MAILGUN', 'Mailgun email delivery (SPF/DKIM)', 'building'],
    ['EMAILDSN', 'Email template designer', 'building'],
    ['TELE', 'Telegram notifications (client + ops)', 'building'],
    ['HUB', 'Hub + 14 Jul test-round fixes', 'building'],
    ['DEPLOY', 'Trial deploy + full E2E verification', 'planned'],
  ]
  trial.forEach(([code, title, status], i) =>
    insFeature.run(`TRIAL-${code}`, 'trial', title, status, 0, 1, '2026-07-24', 100 + i),
  )

  const insTask = db.prepare(
    'INSERT INTO tasks (title, detail, type, points, status, ball, area, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  )
  insTask.run(
    'Fix KYC client flow (client stuck mid-process)',
    'Client must not be stuck at any KYC stage. Critical priority from product team daily targets.',
    'bugfix', 3, 'doing', 'dev', 'KYC', 'NANA PRODUCT',
  )
  insTask.run(
    'KYC data reflected to admin side + approve/reject',
    'Client data shows in admin queue; approve/reject works; status reflected back to client.',
    'task', 5, 'waiting-feedback', 'product', 'KYC', 'Fatih',
  )
  insTask.run(
    'Remove MT Account ID as login credential',
    'Client cannot log in using Live Account MT ID; email/username only.',
    'task', 2, 'todo', 'dev', 'Onboarding', 'NANA PRODUCT',
  )
  insTask.run(
    'Fix transparent form UI on admin side + center forms',
    'Every admin form: opaque background, centered layout. See product docs pics.',
    'bugfix', 2, 'todo', 'dev', 'UI', 'NANA PRODUCT',
  )

  db.prepare("INSERT INTO settings (key, value) VALUES ('seeded', '1')").run()
  db.prepare("INSERT INTO settings (key, value) VALUES ('max_points_per_day', '8')").run()
  db.prepare("INSERT INTO settings (key, value) VALUES ('sprint_start', '2026-07-17')").run()
  db.prepare("INSERT INTO settings (key, value) VALUES ('sprint_end', '2026-07-27')").run()
  db.prepare("INSERT INTO settings (key, value) VALUES ('ball', 'dev')").run()
  db.prepare("INSERT INTO settings (key, value) VALUES ('ball_note', 'Development berjalan - workstream trial 27 Jul')").run()
  db.prepare("INSERT INTO settings (key, value) VALUES ('ball_since', datetime('now'))").run()
}

// Seed subtasks from the documented trial-critical open-issue list (guarded by
// settings.subtasks_seeded). These are the 16 issues that keep the roadmap at
// 96/112 for the 27 Jul trial. Runs on both fresh and already-seeded DBs.
export function seedSubtasks(db: Database.Database) {
  const done = db.prepare("SELECT value FROM settings WHERE key = 'subtasks_seeded'").get()
  if (done) return

  const remaining: Record<string, string[]> = {
    M1: ['#157'],
    M3: ['#168', '#172'],
    M7: ['#216', '#219', '#223', '#226', '#231'],
    M9: ['#248', '#253'],
    M10: ['#260', '#266'],
    M13: ['#289', '#293', '#294', '#296'],
  }
  const titles = db
    .prepare("SELECT ref, title FROM activity WHERE kind = 'issue'")
    .all() as Array<{ ref: string; title: string }>
  const titleByRef = new Map(titles.map((t) => [t.ref, t.title]))
  const ins = db.prepare(
    'INSERT INTO subtasks (feature_id, title, status, issue_ref, points, sort) VALUES (?, ?, ?, ?, 1, ?)',
  )
  const tx = db.transaction(() => {
    for (const [code, refs] of Object.entries(remaining)) {
      const feature = db.prepare('SELECT id FROM features WHERE code = ?').get(code) as
        | { id: number }
        | undefined
      if (!feature) continue
      refs.forEach((ref, i) => ins.run(feature.id, titleByRef.get(ref) ?? `Issue ${ref}`, 'todo', ref, i))
    }
    db.prepare("INSERT INTO settings (key, value) VALUES ('subtasks_seeded', '1')").run()
  })
  tx()
}

// --- queries ----------------------------------------------------------------

export function listFeatures(): LunarFeature[] {
  return getLunarDb().prepare('SELECT * FROM features ORDER BY sort').all() as LunarFeature[]
}

export function listTasks(): LunarTask[] {
  return getLunarDb()
    .prepare("SELECT * FROM tasks ORDER BY (status IN ('done', 'cancelled')), updated_at DESC")
    .all() as LunarTask[]
}

export function listFeedback(): LunarFeedback[] {
  return getLunarDb()
    .prepare("SELECT * FROM feedback ORDER BY (status = 'resolved'), created_at DESC")
    .all() as LunarFeedback[]
}

export function listActivity(limit = 60): LunarActivity[] {
  return getLunarDb()
    .prepare('SELECT * FROM activity ORDER BY happened_at DESC LIMIT ?')
    .all(limit) as LunarActivity[]
}

export function listSubtasks(): LunarSubtask[] {
  return getLunarDb()
    .prepare('SELECT * FROM subtasks ORDER BY feature_id, sort, id')
    .all() as LunarSubtask[]
}

export function listQuestions(): LunarQuestion[] {
  return getLunarDb()
    .prepare("SELECT * FROM questions ORDER BY (status = 'answered'), created_at DESC")
    .all() as LunarQuestion[]
}

export function listSpLog(sinceDay: string): LunarSpLog[] {
  return getLunarDb()
    .prepare('SELECT * FROM sp_log WHERE spent_on >= ? ORDER BY spent_on')
    .all(sinceDay) as LunarSpLog[]
}

// Total SP logged against a task (estimate-vs-actual + auto-log fallback).
export function spLoggedForTask(taskId: number): number {
  const row = getLunarDb()
    .prepare('SELECT COALESCE(SUM(points), 0) AS total FROM sp_log WHERE task_id = ?')
    .get(taskId) as { total: number }
  return row.total
}

// Mis-click reversal: leaving `done` (or cancelling) removes the synthetic
// remainder rows; manual worklogs stay - real time spent stays spent.
export function removeAutoLogs(taskId: number): number {
  return getLunarDb().prepare('DELETE FROM sp_log WHERE task_id = ? AND auto = 1').run(taskId).changes
}

// --- internal (dev-only; NEVER exposed via public state or Telegram) --------
// Agent-facing tracking: freeform notes + a coded checklist. Content is
// inserted at runtime via the dev-only /api/lunar/internal/* endpoints and
// lives ONLY in the DB on the Fly volume - never seed real content here,
// this repository is published publicly.

export interface LunarInternalNote {
  id: number
  title: string
  body: string
  tags: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface LunarChecklistItem {
  id: number
  group_code: string  // MT5 | TELE | EMAIL | DEC | PRIO
  code: string        // M1..M9, T1..T6, E1..E7, D1..D5, P1
  title: string
  status: string      // todo | doing | done | blocked
  secret: number      // 1 = value goes to SecretSpec/keyring, never chat
  note: string
  updated_by: string
  updated_at: string
}

export function listInternalNotes(): LunarInternalNote[] {
  return getLunarDb()
    .prepare('SELECT * FROM internal_notes ORDER BY updated_at DESC')
    .all() as LunarInternalNote[]
}

export function listChecklist(): LunarChecklistItem[] {
  return getLunarDb()
    .prepare('SELECT * FROM internal_checklist ORDER BY group_code, id')
    .all() as LunarChecklistItem[]
}

// --- attachments ------------------------------------------------------------
// The `attachment` column holds either one legacy upload path or a JSON array
// of paths (multi-file upload, UX overhaul 2026-07-22). Both parse here.

const UPLOAD_PATH_RE = /^\/api\/lunar\/uploads\/[\w][\w.-]*$/

export function parseAttachments(raw: string): string[] {
  if (!raw) return []
  if (raw.startsWith('[')) {
    try {
      const arr: unknown = JSON.parse(raw)
      return Array.isArray(arr) ? arr.filter((p): p is string => typeof p === 'string') : []
    } catch {
      return []
    }
  }
  return [raw]
}

// Validates client input (`attachments` array or legacy `attachment` string)
// down to at most 10 real upload paths, stored as a JSON array string.
export function packAttachments(attachments: unknown, attachment: unknown): string {
  const list = Array.isArray(attachments)
    ? attachments
    : typeof attachment === 'string' && attachment
      ? [attachment]
      : []
  const clean = list
    .filter((p): p is string => typeof p === 'string' && UPLOAD_PATH_RE.test(p))
    .slice(0, 10)
  return clean.length ? JSON.stringify(clean) : ''
}
