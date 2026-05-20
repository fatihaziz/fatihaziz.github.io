import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import Database from 'better-sqlite3'

export interface StoryRow {
  id: number
  slug: string
  title: string
  content_html: string
  excerpt: string
  seed: string
  font: string
  theme: string
  base_size: number
  author: string
  created_at: string
  updated_at: string
}

let _db: Database.Database | null = null

// Anchor the SQLite file to <projectRoot>/data. nuxt dev/start run with cwd at
// the project root, so this stays inside the repo and never leaks elsewhere.
function dataDir(): string {
  const dir = join(process.cwd(), 'data')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return dir
}

export function getDb(): Database.Database {
  if (_db) return _db
  const db = new Database(join(dataDir(), 'journal.db'))
  db.pragma('journal_mode = WAL')
  db.exec(`
    CREATE TABLE IF NOT EXISTS stories (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      slug         TEXT UNIQUE NOT NULL,
      title        TEXT NOT NULL,
      content_html TEXT NOT NULL DEFAULT '',
      excerpt      TEXT NOT NULL DEFAULT '',
      seed         TEXT NOT NULL,
      font         TEXT NOT NULL DEFAULT 'cormorant',
      theme        TEXT NOT NULL DEFAULT 'oceanDeep',
      base_size    INTEGER NOT NULL DEFAULT 17,
      author       TEXT NOT NULL DEFAULT '',
      created_at   TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)
  _db = db
  return db
}

export function slugify(title: string): string {
  const base = (title || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || 'cerita'
}

export function uniqueSlug(title: string): string {
  const db = getDb()
  const base = slugify(title)
  const stmt = db.prepare('SELECT 1 FROM stories WHERE slug = ?')
  let slug = base
  let n = 2
  while (stmt.get(slug)) slug = `${base}-${n++}`
  return slug
}

export function makeSeed(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

// Strip tags for a short plain-text preview shown on the index cards.
export function excerptFrom(html: string, max = 160): string {
  const text = (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return text.length > max ? text.slice(0, max - 1).trimEnd() + '…' : text
}

export interface StoryInput {
  title: string
  content_html: string
  font?: string
  theme?: string
  base_size?: number
  author?: string
}

export function listStories(): StoryRow[] {
  return getDb()
    .prepare('SELECT * FROM stories ORDER BY datetime(updated_at) DESC')
    .all() as StoryRow[]
}

export function getStory(slug: string): StoryRow | undefined {
  return getDb().prepare('SELECT * FROM stories WHERE slug = ?').get(slug) as
    | StoryRow
    | undefined
}

export function createStory(input: StoryInput): StoryRow {
  const db = getDb()
  const slug = uniqueSlug(input.title)
  const seed = makeSeed()
  db.prepare(
    `INSERT INTO stories (slug, title, content_html, excerpt, seed, font, theme, base_size, author)
     VALUES (@slug, @title, @content_html, @excerpt, @seed, @font, @theme, @base_size, @author)`,
  ).run({
    slug,
    title: input.title?.trim() || 'Tanpa Judul',
    content_html: input.content_html ?? '',
    excerpt: excerptFrom(input.content_html ?? ''),
    seed,
    font: input.font || 'cormorant',
    theme: input.theme || 'oceanDeep',
    base_size: input.base_size ?? 17,
    author: input.author?.trim() || '',
  })
  return getStory(slug)!
}

export function updateStory(slug: string, input: StoryInput): StoryRow | undefined {
  const db = getDb()
  const existing = getStory(slug)
  if (!existing) return undefined
  db.prepare(
    `UPDATE stories SET
       title = @title,
       content_html = @content_html,
       excerpt = @excerpt,
       font = @font,
       theme = @theme,
       base_size = @base_size,
       author = @author,
       updated_at = datetime('now')
     WHERE slug = @slug`,
  ).run({
    slug,
    title: input.title?.trim() || existing.title,
    content_html: input.content_html ?? existing.content_html,
    excerpt: excerptFrom(input.content_html ?? existing.content_html),
    font: input.font || existing.font,
    theme: input.theme || existing.theme,
    base_size: input.base_size ?? existing.base_size,
    author: input.author ?? existing.author,
  })
  return getStory(slug)
}
