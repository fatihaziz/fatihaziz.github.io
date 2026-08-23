import { getLunarDb, type LunarInternalNote } from '../../../../utils/lunar'
import { requireLunarUser } from '../../../../utils/lunar-auth'

export default defineEventHandler(async (event) => {
  requireLunarUser(event, ['dev'])
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Bad id' })
  const db = getLunarDb()
  const prev = db.prepare('SELECT * FROM internal_notes WHERE id = ?').get(id) as
    | LunarInternalNote
    | undefined
  if (!prev) throw createError({ statusCode: 404, statusMessage: 'Note not found' })

  const body = await readBody(event)
  const title =
    typeof body?.title === 'string' && body.title.trim() ? body.title.trim().slice(0, 300) : prev.title
  const text = typeof body?.body === 'string' ? body.body.slice(0, 20_000) : prev.body
  const tags = typeof body?.tags === 'string' ? body.tags.slice(0, 200) : prev.tags

  db.prepare(
    "UPDATE internal_notes SET title = ?, body = ?, tags = ?, updated_at = datetime('now') WHERE id = ?",
  ).run(title, text, tags, id)
  return db.prepare('SELECT * FROM internal_notes WHERE id = ?').get(id) as LunarInternalNote
})
