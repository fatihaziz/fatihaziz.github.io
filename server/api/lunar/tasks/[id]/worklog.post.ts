import { getLunarDb, spLoggedForTask, type LunarTask } from '../../../../utils/lunar'
import { requireLunarUser } from '../../../../utils/lunar-auth'

// Phase 2: daily SP worklog per task. Dev logs partial progress; daily spend
// and burn charts derive from sp_log, not from task completion alone.
export default defineEventHandler(async (event) => {
  const user = requireLunarUser(event, ['dev'])
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Bad id' })

  const db = getLunarDb()
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as LunarTask | undefined
  if (!task) throw createError({ statusCode: 404, statusMessage: 'Task not found' })

  const body = await readBody(event)
  const points = Math.min(13, Math.max(0.5, Number(body?.points) || 0))
  if (!points) throw createError({ statusCode: 400, statusMessage: 'points > 0 required' })
  const spentOn =
    typeof body?.spentOn === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.spentOn)
      ? body.spentOn
      : new Date().toISOString().slice(0, 10)
  const note = typeof body?.note === 'string' ? body.note.slice(0, 300) : ''

  db.prepare('INSERT INTO sp_log (task_id, user, points, spent_on, note) VALUES (?, ?, ?, ?, ?)').run(
    id,
    user.username,
    points,
    spentOn,
    note,
  )
  db.prepare("UPDATE tasks SET updated_at = datetime('now') WHERE id = ?").run(id)
  return { taskId: id, logged: points, spentOn, totalLogged: spLoggedForTask(id) }
})
