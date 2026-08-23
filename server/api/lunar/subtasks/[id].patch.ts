import { getLunarDb, type LunarSubtask } from '../../../utils/lunar'
import { requireLunarUser } from '../../../utils/lunar-auth'

export default defineEventHandler(async (event) => {
  requireLunarUser(event, ['dev'])
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Bad id' })

  const db = getLunarDb()
  const prev = db.prepare('SELECT * FROM subtasks WHERE id = ?').get(id) as LunarSubtask | undefined
  if (!prev) throw createError({ statusCode: 404, statusMessage: 'Subtask not found' })

  const body = await readBody(event)
  const status = ['todo', 'doing', 'done'].includes(body?.status) ? body.status : prev.status
  const title =
    typeof body?.title === 'string' && body.title.trim() ? body.title.trim().slice(0, 300) : prev.title
  const points =
    body?.points !== undefined ? Math.min(13, Math.max(0, Number(body.points) || 0)) : prev.points

  db.prepare('UPDATE subtasks SET title = ?, status = ?, points = ? WHERE id = ?').run(
    title,
    status,
    points,
    id,
  )
  return db.prepare('SELECT * FROM subtasks WHERE id = ?').get(id) as LunarSubtask
})
