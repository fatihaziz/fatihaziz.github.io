import { getLunarDb, type LunarChecklistItem } from '../../../../utils/lunar'
import { requireLunarUser } from '../../../../utils/lunar-auth'

const STATUSES = ['todo', 'doing', 'done', 'blocked']

// INTERNAL, dev-only. Update one checklist item by its code (M1, T2, ...).
export default defineEventHandler(async (event) => {
  const user = requireLunarUser(event, ['dev'])
  const code = (getRouterParam(event, 'code') || '').trim()
  const db = getLunarDb()
  const prev = db.prepare('SELECT * FROM internal_checklist WHERE code = ?').get(code) as
    | LunarChecklistItem
    | undefined
  if (!prev) throw createError({ statusCode: 404, statusMessage: `Checklist ${code} not found` })

  const body = await readBody(event)
  const status = STATUSES.includes(body?.status) ? body.status : prev.status
  const note = typeof body?.note === 'string' ? body.note.slice(0, 2000) : prev.note
  const title =
    typeof body?.title === 'string' && body.title.trim() ? body.title.trim().slice(0, 500) : prev.title

  db.prepare(
    "UPDATE internal_checklist SET status = ?, note = ?, title = ?, updated_by = ?, updated_at = datetime('now') WHERE code = ?",
  ).run(status, note, title, user.username, code)
  return db.prepare('SELECT * FROM internal_checklist WHERE code = ?').get(code) as LunarChecklistItem
})
