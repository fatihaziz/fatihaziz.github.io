import { getLunarDb, packAttachments, parseAttachments, type LunarFeedback } from '../../utils/lunar'
import { requireLunarUser } from '../../utils/lunar-auth'
import { notifyTelegram } from '../../utils/lunar-telegram'

// Team feedback reports (bug repro, UAT notes, change requests).
// Phase 3 rules: one row per error, MUST reference a roadmap card, optional
// gdocs/screenshot link and uploaded image attachment.
export default defineEventHandler(async (event) => {
  const user = requireLunarUser(event)
  const body = await readBody(event)
  const text = typeof body?.body === 'string' ? body.body.trim() : ''
  if (!text) throw createError({ statusCode: 400, statusMessage: 'Feedback body is required' })

  const featureId = Number(body?.featureId)
  if (!Number.isInteger(featureId) || featureId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Pilih roadmap card dulu (featureId wajib)' })
  }
  const db = getLunarDb()
  const feature = db.prepare('SELECT code FROM features WHERE id = ?').get(featureId) as
    | { code: string }
    | undefined
  if (!feature) throw createError({ statusCode: 404, statusMessage: 'Feature not found' })

  const author =
    typeof body.author === 'string' && body.author.trim() ? body.author.slice(0, 60) : user.username
  const severity = ['critical', 'major', 'minor', 'note'].includes(body.severity)
    ? body.severity
    : 'note'
  const taskId = Number.isInteger(Number(body.taskId)) && Number(body.taskId) > 0 ? Number(body.taskId) : null
  const link = typeof body.link === 'string' ? body.link.trim().slice(0, 400) : ''
  const attachment = packAttachments(body.attachments, body.attachment)

  const info = db
    .prepare(
      'INSERT INTO feedback (task_id, feature_id, author, severity, body, link, attachment) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )
    .run(taskId, featureId, author, severity, text.slice(0, 6000), link, attachment)
  const row = db.prepare('SELECT * FROM feedback WHERE id = ?').get(info.lastInsertRowid) as LunarFeedback

  const files = parseAttachments(attachment).map((p) => `https://fatihaziz-web.fly.dev${p}`)
  notifyTelegram({
    kind: 'feedback',
    title: `Feedback ${severity.toUpperCase()} - ${feature.code}`,
    fields: [
      { label: 'Dari', value: author },
      { label: 'Link', value: link },
      { label: 'File', value: files.slice(0, 3).join(' ') + (files.length > 3 ? ` (+${files.length - 3} lagi)` : '') },
    ],
    note: text.slice(0, 500),
  }).catch(() => {})
  return row
})
