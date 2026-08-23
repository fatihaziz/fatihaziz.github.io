import { listChecklist, listInternalNotes } from '../../../utils/lunar'
import { requireLunarUser } from '../../../utils/lunar-auth'

// INTERNAL, dev-only (X-Api-Key dev / dev session). Never merged into the
// public /api/lunar/state payload and never mirrored to Telegram: the
// Telegram group is read by the product team.
export default defineEventHandler((event) => {
  requireLunarUser(event, ['dev'])
  const checklist = listChecklist()
  const byGroup: Record<string, { total: number; done: number }> = {}
  for (const item of checklist) {
    const g = (byGroup[item.group_code] ??= { total: 0, done: 0 })
    g.total++
    if (item.status === 'done') g.done++
  }
  return {
    notes: listInternalNotes(),
    checklist,
    summary: {
      total: checklist.length,
      done: checklist.filter((i) => i.status === 'done').length,
      byGroup,
    },
  }
})
