import { getLunarDb, packAttachments, type LunarQuestion } from '../../../utils/lunar'
import { requireLunarUser } from '../../../utils/lunar-auth'
import { notifyTelegram } from '../../../utils/lunar-telegram'

// Question lifecycle:
// - question text edit + soft delete/restore (archived): any logged-in member.
// - answer (marks answered, Telegram ping): dev only.
export default defineEventHandler(async (event) => {
  const user = requireLunarUser(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Bad id' })

  const db = getLunarDb()
  const prev = db.prepare('SELECT * FROM questions WHERE id = ?').get(id) as LunarQuestion | undefined
  if (!prev) throw createError({ statusCode: 404, statusMessage: 'Question not found' })

  const body = await readBody(event)
  const answer = typeof body?.answer === 'string' ? body.answer.trim().slice(0, 4000) : ''
  if (answer && user.role !== 'dev') {
    throw createError({ statusCode: 403, statusMessage: 'Hanya dev yang boleh menjawab' })
  }
  const question =
    typeof body?.question === 'string' && body.question.trim()
      ? body.question.trim().slice(0, 4000)
      : prev.question
  const archived = typeof body?.archived === 'boolean' ? (body.archived ? 1 : 0) : prev.archived
  const attachment = Array.isArray(body?.attachments)
    ? packAttachments(body.attachments, '')
    : prev.attachment

  if (answer) {
    const answeredBy =
      typeof body?.answeredBy === 'string' && body.answeredBy.trim()
        ? body.answeredBy.trim().slice(0, 60)
        : user.username
    db.prepare(
      "UPDATE questions SET answer = ?, answered_by = ?, status = 'answered', answered_at = datetime('now'), question = ?, archived = ?, attachment = ? WHERE id = ?",
    ).run(answer, answeredBy, question, archived, attachment, id)
    notifyTelegram({
      kind: 'answer',
      title: 'Pertanyaan dijawab',
      fields: [
        { label: 'Penanya', value: prev.author },
        { label: 'Dijawab oleh', value: answeredBy },
      ],
      note: answer.slice(0, 500),
    }).catch(() => {})
  } else {
    db.prepare('UPDATE questions SET question = ?, archived = ?, attachment = ? WHERE id = ?').run(question, archived, attachment, id)
  }
  return db.prepare('SELECT * FROM questions WHERE id = ?').get(id) as LunarQuestion
})
