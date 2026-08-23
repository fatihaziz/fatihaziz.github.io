import { getLunarDb } from '../../../utils/lunar'
import { requireLunarUser } from '../../../utils/lunar-auth'

// Remove a target from the coverage board (e.g. scope cuts decided by product).
export default defineEventHandler((event) => {
  requireLunarUser(event, ['dev'])
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Bad id' })
  const info = getLunarDb().prepare('DELETE FROM features WHERE id = ?').run(id)
  if (info.changes === 0) throw createError({ statusCode: 404, statusMessage: 'Feature not found' })
  return { deleted: id }
})
