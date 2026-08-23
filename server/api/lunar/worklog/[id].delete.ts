import { getLunarDb } from '../../../utils/lunar'
import { requireLunarUser } from '../../../utils/lunar-auth'

// Correction path: delete a mistaken worklog row (wrong points / wrong task).
// Dev only; the daily burn recomputes from sp_log so no other cleanup needed.
export default defineEventHandler((event) => {
  requireLunarUser(event, ['dev'])
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Bad id' })
  const info = getLunarDb().prepare('DELETE FROM sp_log WHERE id = ?').run(id)
  if (info.changes === 0) throw createError({ statusCode: 404, statusMessage: 'Worklog not found' })
  return { deleted: id }
})
