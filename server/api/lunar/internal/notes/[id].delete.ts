import { getLunarDb } from '../../../../utils/lunar'
import { requireLunarUser } from '../../../../utils/lunar-auth'

export default defineEventHandler((event) => {
  requireLunarUser(event, ['dev'])
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Bad id' })
  const info = getLunarDb().prepare('DELETE FROM internal_notes WHERE id = ?').run(id)
  if (info.changes === 0) throw createError({ statusCode: 404, statusMessage: 'Note not found' })
  return { deleted: id }
})
