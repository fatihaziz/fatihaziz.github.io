import { getLunarDb, removeAutoLogs, spLoggedForTask, type LunarTask } from '../../../utils/lunar'
import { requireLunarUser } from '../../../utils/lunar-auth'
import { notifyTelegram } from '../../../utils/lunar-telegram'

// Update status / ball / points on a task. Flipping the ball dev -> product
// means the developer handed it over and waits for feedback: product team gets
// a Telegram ping (when configured).
// Phase 2 fallback: a task reaching `done` without enough worklogs auto-logs
// the remaining estimate (sp_log.auto=1). Leaving `done` - including a
// mis-click undo or a cancel - deletes those synthetic rows again, so SP only
// ever counts real work. `cancelled` tasks drop out of all SP math.
export default defineEventHandler(async (event) => {
  const user = requireLunarUser(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Bad id' })

  const db = getLunarDb()
  const prev = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as LunarTask | undefined
  if (!prev) throw createError({ statusCode: 404, statusMessage: 'Task not found' })

  const body = await readBody(event)
  const status = ['todo', 'doing', 'waiting-feedback', 'done', 'cancelled'].includes(body?.status)
    ? body.status
    : prev.status
  const ball = body?.ball === 'product' || body?.ball === 'dev' ? body.ball : prev.ball
  const points =
    body?.points !== undefined ? Math.min(13, Math.max(0, Number(body.points) || 0)) : prev.points
  const title = typeof body?.title === 'string' && body.title.trim() ? body.title.trim() : prev.title
  const detail = typeof body?.detail === 'string' ? body.detail.slice(0, 4000) : prev.detail
  const area = typeof body?.area === 'string' ? body.area.slice(0, 60) : prev.area
  const archived = typeof body?.archived === 'boolean' ? (body.archived ? 1 : 0) : prev.archived
  const due =
    body?.due === '' || (typeof body?.due === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.due))
      ? body.due
      : prev.due
  const doneAt =
    status === 'done' ? prev.done_at ?? new Date().toISOString() : status !== 'done' ? null : prev.done_at

  db.prepare(
    "UPDATE tasks SET title = ?, detail = ?, status = ?, ball = ?, points = ?, due = ?, area = ?, archived = ?, done_at = ?, updated_at = datetime('now') WHERE id = ?",
  ).run(title, detail, status, ball, points, due, area, archived, doneAt, id)

  if (prev.status !== 'done' && status === 'done') {
    const logged = spLoggedForTask(id)
    const remainder = points - logged
    if (remainder > 0) {
      db.prepare(
        'INSERT INTO sp_log (task_id, user, points, spent_on, note, auto) VALUES (?, ?, ?, ?, ?, 1)',
      ).run(id, user.username, remainder, new Date().toISOString().slice(0, 10), 'auto-log saat done')
    }
  } else if (prev.status === 'done' && status !== 'done') {
    removeAutoLogs(id) // undo/cancel: synthetic SP disappears, manual logs stay
  }
  // Cancel or archive = "this should not count": drop synthetic SP rows.
  if ((status === 'cancelled' && prev.status !== 'cancelled') || (archived && !prev.archived)) {
    removeAutoLogs(id)
  }
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as LunarTask

  if (prev.ball === 'dev' && ball === 'product') {
    notifyTelegram({
      kind: 'ball',
      title: 'Bola task ke TIM PRODUCT',
      intro: 'Developer menunggu feedback kalian untuk task ini.',
      fields: [
        { label: 'Task', value: task.title },
        { label: 'Status', value: task.status },
      ],
    }).catch(() => {})
  } else if (prev.ball === 'product' && ball === 'dev') {
    notifyTelegram({
      kind: 'ball',
      title: 'Bola task kembali ke DEVELOPER',
      fields: [{ label: 'Task', value: task.title }],
    }).catch(() => {})
  }
  if (prev.status !== 'done' && status === 'done') {
    notifyTelegram({
      kind: 'done',
      title: 'Task selesai',
      fields: [
        { label: 'Task', value: task.title },
        { label: 'SP', value: String(task.points) },
      ],
    }).catch(() => {})
  }
  return task
})
