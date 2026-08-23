import { getLunarDb, type LunarTask } from '../../utils/lunar'
import { requireLunarUser } from '../../utils/lunar-auth'
import { notifyTelegram } from '../../utils/lunar-telegram'

// Team-facing: any logged-in member (dev or product) can add a task / bugfix.
export default defineEventHandler(async (event) => {
  const user = requireLunarUser(event)
  const body = await readBody(event)
  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  if (!title) throw createError({ statusCode: 400, statusMessage: 'A title is required' })

  const type = body.type === 'bugfix' ? 'bugfix' : 'task'
  const points = Math.min(13, Math.max(0, Number(body.points) || 1))
  const ball = body.ball === 'product' ? 'product' : 'dev'
  const status = ['todo', 'doing', 'waiting-feedback', 'done'].includes(body.status)
    ? body.status
    : 'todo'
  const detail = typeof body.detail === 'string' ? body.detail.slice(0, 4000) : ''
  const due = typeof body.due === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.due) ? body.due : ''
  const area = typeof body.area === 'string' ? body.area.slice(0, 60) : ''
  const createdBy =
    typeof body.createdBy === 'string' && body.createdBy.trim()
      ? body.createdBy.slice(0, 60)
      : user.username

  const db = getLunarDb()
  const info = db
    .prepare(
      'INSERT INTO tasks (title, detail, type, points, status, ball, area, created_by, due) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    )
    .run(title, detail, type, points, status, ball, area, createdBy, due)
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid) as LunarTask

  notifyTelegram({
    kind: 'task',
    title: 'Task baru',
    fields: [
      { label: 'Judul', value: title },
      { label: 'Tipe', value: type },
      { label: 'SP', value: String(points) },
      { label: 'Oleh', value: createdBy },
    ],
  }).catch(() => {})
  return task
})
