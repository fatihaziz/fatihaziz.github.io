import { getLunarDb, type LunarInternalNote } from '../../../utils/lunar'
import { requireLunarUser } from '../../../utils/lunar-auth'

// INTERNAL, dev-only. No Telegram notification by design.
export default defineEventHandler(async (event) => {
  const user = requireLunarUser(event, ['dev'])
  const body = await readBody(event)
  const title = typeof body?.title === 'string' ? body.title.trim().slice(0, 300) : ''
  if (!title) throw createError({ statusCode: 400, statusMessage: 'title wajib' })
  const text = typeof body?.body === 'string' ? body.body.slice(0, 20_000) : ''
  const tags = typeof body?.tags === 'string' ? body.tags.slice(0, 200) : ''

  const db = getLunarDb()
  const info = db
    .prepare('INSERT INTO internal_notes (title, body, tags, created_by) VALUES (?, ?, ?, ?)')
    .run(title, text, tags, user.username)
  return db.prepare('SELECT * FROM internal_notes WHERE id = ?').get(info.lastInsertRowid) as LunarInternalNote
})
