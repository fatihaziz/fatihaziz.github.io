import { getLunarDb, packAttachments, parseAttachments, type LunarQuestion } from '../../utils/lunar'
import { requireLunarUser } from '../../utils/lunar-auth'
import { notifyTelegram } from '../../utils/lunar-telegram'

// Phase 3: questions are separate from feedback and MUST reference a roadmap
// card. Anyone logged in (dev or product) can ask; dev answers inline.
export default defineEventHandler(async (event) => {
  const user = requireLunarUser(event)
  const body = await readBody(event)
  const featureId = Number(body?.featureId)
  const question = typeof body?.question === 'string' ? body.question.trim().slice(0, 4000) : ''
  if (!Number.isInteger(featureId) || featureId <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Pilih roadmap card dulu (featureId wajib)' })
  }
  if (!question) throw createError({ statusCode: 400, statusMessage: 'Pertanyaan wajib diisi' })

  const db = getLunarDb()
  const feature = db.prepare('SELECT code, title FROM features WHERE id = ?').get(featureId) as
    | { code: string; title: string }
    | undefined
  if (!feature) throw createError({ statusCode: 404, statusMessage: 'Feature not found' })

  const author =
    typeof body?.author === 'string' && body.author.trim()
      ? body.author.trim().slice(0, 60)
      : user.username
  const attachment = packAttachments(body?.attachments, body?.attachment)

  const info = db
    .prepare('INSERT INTO questions (feature_id, author, question, attachment) VALUES (?, ?, ?, ?)')
    .run(featureId, author, question, attachment)
  const row = db.prepare('SELECT * FROM questions WHERE id = ?').get(info.lastInsertRowid) as LunarQuestion

  const qfiles = parseAttachments(attachment).map((p) => `https://fatihaziz-web.fly.dev${p}`)
  notifyTelegram({
    kind: 'question',
    title: `Pertanyaan baru - ${feature.code}`,
    fields: [
      { label: 'Dari', value: author },
      { label: 'File', value: qfiles.slice(0, 3).join(' ') + (qfiles.length > 3 ? ` (+${qfiles.length - 3} lagi)` : '') },
    ],
    note: question.slice(0, 500),
  }).catch(() => {})
  return row
})
