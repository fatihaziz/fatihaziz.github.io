import { setSetting, getSetting } from '../../utils/lunar'
import { requireLunarUser } from '../../utils/lunar-auth'

// Sprint knobs: max sprint points per day + sprint window.
export default defineEventHandler(async (event) => {
  requireLunarUser(event, ['dev'])
  const body = await readBody(event)
  if (body?.maxPerDay !== undefined) {
    const n = Math.min(40, Math.max(1, Number(body.maxPerDay) || 8))
    setSetting('max_points_per_day', String(n))
  }
  if (body?.spPerDay !== undefined) {
    const n = Math.min(40, Math.max(0.5, Number(body.spPerDay) || 2))
    setSetting('sp_per_day', String(n))
  }
  if (typeof body?.sprintStart === 'string') setSetting('sprint_start', body.sprintStart.slice(0, 10))
  if (typeof body?.sprintEnd === 'string') setSetting('sprint_end', body.sprintEnd.slice(0, 10))
  return {
    maxPerDay: Number(getSetting('max_points_per_day', '8')),
    spPerDay: Number(getSetting('sp_per_day', '2')),
    sprintStart: getSetting('sprint_start'),
    sprintEnd: getSetting('sprint_end'),
  }
})
