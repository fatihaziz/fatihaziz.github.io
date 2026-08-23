import { getLunarDb, packAttachments, type LunarFeedback } from '../../../utils/lunar'
import { requireLunarUser } from '../../../utils/lunar-auth'

// Feedback lifecycle:
// - body/link edits + soft delete/restore (archived): any logged-in member -
//   product fixes their own mis-submits.
// - workflow status (open/ack/resolved): dev only.
export default defineEventHandler(async (event) => {
  const user = requireLunarUser(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Bad id' })
  const db = getLunarDb()
  const prev = db.prepare('SELECT * FROM feedback WHERE id = ?').get(id) as LunarFeedback | undefined
  if (!prev) throw createError({ statusCode: 404, statusMessage: 'Feedback not found' })

  const body = await readBody(event)
  if (body?.status !== undefined && user.role !== 'dev') {
    throw createError({ statusCode: 403, statusMessage: 'Hanya dev yang boleh ubah status feedback' })
  }
  const status = ['open', 'ack', 'resolved'].includes(body?.status) ? body.status : prev.status
  const text =
    typeof body?.body === 'string' && body.body.trim() ? body.body.trim().slice(0, 6000) : prev.body
  const link = typeof body?.link === 'string' ? body.link.trim().slice(0, 400) : prev.link
  const archived = typeof body?.archived === 'boolean' ? (body.archived ? 1 : 0) : prev.archived
  // Editing may replace the uploaded file set (remove old / add new).
  const attachment = Array.isArray(body?.attachments)
    ? packAttachments(body.attachments, '')
    : prev.attachment

  db.prepare(
    "UPDATE feedback SET status = ?, body = ?, link = ?, archived = ?, attachment = ?, updated_at = datetime('now') WHERE id = ?",
  ).run(status, text, link, archived, attachment, id)
  return db.prepare('SELECT * FROM feedback WHERE id = ?').get(id) as LunarFeedback
})
