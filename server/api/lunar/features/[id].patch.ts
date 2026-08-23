import { getLunarDb, type LunarFeature } from '../../../utils/lunar'
import { requireLunarUser } from '../../../utils/lunar-auth'
import { notifyTelegram } from '../../../utils/lunar-telegram'

// Correct feature coverage numbers / status (dev keeps them honest) and flip
// the per-card ball. Ball flips are handover semantics, so product may flip
// too; status/coverage edits stay dev-only.
export default defineEventHandler(async (event) => {
  const user = requireLunarUser(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Bad id' })

  const db = getLunarDb()
  const prev = db.prepare('SELECT * FROM features WHERE id = ?').get(id) as LunarFeature | undefined
  if (!prev) throw createError({ statusCode: 404, statusMessage: 'Feature not found' })

  const body = await readBody(event)
  const wantsCoverageEdit =
    body?.status !== undefined || body?.issuesTotal !== undefined || body?.issuesDone !== undefined
  if (wantsCoverageEdit && user.role !== 'dev') {
    throw createError({ statusCode: 403, statusMessage: 'Hanya dev yang boleh edit coverage/status' })
  }

  const status = ['planned', 'building', 'testing', 'done'].includes(body?.status)
    ? body.status
    : prev.status
  const total =
    body?.issuesTotal !== undefined ? Math.max(0, Number(body.issuesTotal) || 0) : prev.issues_total
  const done =
    body?.issuesDone !== undefined
      ? Math.min(total, Math.max(0, Number(body.issuesDone) || 0))
      : Math.min(total, prev.issues_done)
  const ball = body?.ball === 'product' || body?.ball === 'dev' ? body.ball : prev.ball

  db.prepare('UPDATE features SET status = ?, issues_done = ?, issues_total = ?, ball = ? WHERE id = ?').run(
    status,
    done,
    total,
    ball,
    id,
  )
  const row = db.prepare('SELECT * FROM features WHERE id = ?').get(id) as LunarFeature

  if (prev.ball !== ball) {
    notifyTelegram({
      kind: 'ball',
      title: `Bola card ${row.code} ke ${ball === 'product' ? 'TIM PRODUCT' : 'DEVELOPER'}`,
      fields: [
        { label: 'Card', value: `${row.code} - ${row.title}` },
        { label: 'Oleh', value: user.username },
      ],
    }).catch(() => {})
  }
  return row
})
