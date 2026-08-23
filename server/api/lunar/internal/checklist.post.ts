import { getLunarDb, listChecklist } from '../../../utils/lunar'
import { requireLunarUser } from '../../../utils/lunar-auth'

const STATUSES = ['todo', 'doing', 'done', 'blocked']

// INTERNAL, dev-only. Bulk upsert checklist items by unique code, e.g.
// {"items":[{"group":"MT5","code":"M1","title":"...","secret":false}]}.
// Content is provisioned at runtime so nothing sensitive lives in the repo.
export default defineEventHandler(async (event) => {
  const user = requireLunarUser(event, ['dev'])
  const body = await readBody(event)
  const items = Array.isArray(body?.items) ? body.items : []
  if (!items.length) throw createError({ statusCode: 400, statusMessage: 'items[] wajib' })

  const db = getLunarDb()
  const upsert = db.prepare(
    `INSERT INTO internal_checklist (group_code, code, title, secret, status, note, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(code) DO UPDATE SET
       group_code = excluded.group_code, title = excluded.title, secret = excluded.secret,
       status = excluded.status, note = excluded.note, updated_by = excluded.updated_by,
       updated_at = datetime('now')`,
  )
  let count = 0
  const tx = db.transaction(() => {
    for (const it of items) {
      const group = typeof it?.group === 'string' ? it.group.trim().slice(0, 20) : ''
      const code = typeof it?.code === 'string' ? it.code.trim().slice(0, 20) : ''
      const title = typeof it?.title === 'string' ? it.title.trim().slice(0, 500) : ''
      if (!group || !code || !title) continue
      const status = STATUSES.includes(it.status) ? it.status : 'todo'
      const note = typeof it?.note === 'string' ? it.note.slice(0, 2000) : ''
      upsert.run(group, code, title, it.secret ? 1 : 0, status, note, user.username)
      count++
    }
  })
  tx()
  return { upserted: count, checklist: listChecklist() }
})
