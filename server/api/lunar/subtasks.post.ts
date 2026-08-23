import { getLunarDb, type LunarSubtask } from '../../utils/lunar'
import { requireLunarUser } from '../../utils/lunar-auth'

// Phase 3: sub-task under a roadmap card (feature). Dev-only maintenance.
export default defineEventHandler(async (event) => {
  requireLunarUser(event, ['dev'])
  const body = await readBody(event)
  const featureId = Number(body?.featureId)
  const title = typeof body?.title === 'string' ? body.title.trim().slice(0, 300) : ''
  if (!Number.isInteger(featureId) || !title) {
    throw createError({ statusCode: 400, statusMessage: 'featureId dan title wajib' })
  }
  const db = getLunarDb()
  const feature = db.prepare('SELECT id FROM features WHERE id = ?').get(featureId)
  if (!feature) throw createError({ statusCode: 404, statusMessage: 'Feature not found' })

  const status = ['todo', 'doing', 'done'].includes(body?.status) ? body.status : 'todo'
  const issueRef = typeof body?.issueRef === 'string' ? body.issueRef.trim().slice(0, 20) : ''
  const points = Math.min(13, Math.max(0, Number(body?.points) || 1))

  const info = db
    .prepare(
      `INSERT INTO subtasks (feature_id, title, status, issue_ref, points, sort)
       VALUES (?, ?, ?, ?, ?, (SELECT COALESCE(MAX(sort), 0) + 1 FROM subtasks WHERE feature_id = ?))`,
    )
    .run(featureId, title, status, issueRef, points, featureId)
  return db.prepare('SELECT * FROM subtasks WHERE id = ?').get(info.lastInsertRowid) as LunarSubtask
})
