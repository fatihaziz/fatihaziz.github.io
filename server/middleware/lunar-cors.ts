// CORS for the Lunar tracker API only. The dashboard page is also served
// statically from gh-pages (fatihaziz.com) while the API lives on Fly, so
// cross-origin calls from the apex domain must be allowed.
const ALLOWED: Record<string, true> = {
  'https://fatihaziz.com': true,
  'https://www.fatihaziz.com': true,
  'http://localhost:3000': true,
}

export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api/lunar/')) return
  const origin = getHeader(event, 'origin')
  if (!origin || !ALLOWED[origin]) return

  setResponseHeaders(event, {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'access-control-allow-headers': 'content-type,authorization,x-api-key,x-write-secret',
    'access-control-max-age': '86400',
    vary: 'origin',
  })
  if (event.method === 'OPTIONS') {
    setResponseStatus(event, 204)
    return ''
  }
})
