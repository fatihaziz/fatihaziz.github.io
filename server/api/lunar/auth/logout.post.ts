import { logoutLunar } from '../../../utils/lunar-auth'

export default defineEventHandler((event) => {
  const auth = getHeader(event, 'authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (token) logoutLunar(token)
  return { ok: true }
})
