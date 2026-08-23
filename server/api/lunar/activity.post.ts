import { getLunarDb, type LunarActivity } from '../../utils/lunar'
import { requireLunarUser } from '../../utils/lunar-auth'

// Manual commit / issue row for the activity table (used when GitHub sync is
// off or for out-of-band work).
export default defineEventHandler(async (event) => {
  requireLunarUser(event, ['dev'])
  const body = await readBody(event)
  const kind = body?.kind === 'issue' ? 'issue' : 'commit'
  const ref = typeof body?.ref === 'string' ? body.ref.trim().slice(0, 40) : ''
  const title = typeof body?.title === 'string' ? body.title.trim().slice(0, 300) : ''
  if (!ref || !title) throw createError({ statusCode: 400, statusMessage: 'ref and title required' })
  const state = body.state === 'done' ? 'done' : 'running'
  const author = typeof body.author === 'string' ? body.author.slice(0, 60) : ''
  const url = typeof body.url === 'string' ? body.url.slice(0, 400) : ''

  const db = getLunarDb()
  db.prepare(
    `INSERT INTO activity (kind, ref, title, state, author, url) VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(kind, ref) DO UPDATE SET title = excluded.title, state = excluded.state, author = excluded.author, url = excluded.url`,
  ).run(kind, ref, title, state, author, url)
  return db.prepare('SELECT * FROM activity WHERE kind = ? AND ref = ?').get(kind, ref) as LunarActivity
})
