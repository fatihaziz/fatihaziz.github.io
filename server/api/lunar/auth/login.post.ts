import { loginLunar } from '../../../utils/lunar-auth'

// Access-key login. Body: { username, key }. Returns a 30-day Bearer token.
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const username = typeof body?.username === 'string' ? body.username.trim().toLowerCase() : ''
  const key = typeof body?.key === 'string' ? body.key : ''
  if (!username || !key) {
    throw createError({ statusCode: 400, statusMessage: 'username dan key wajib diisi' })
  }
  const session = loginLunar(username, key)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Username atau access key salah' })
  }
  return session
})
