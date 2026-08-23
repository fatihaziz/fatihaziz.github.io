import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { lunarUploadDir } from '../upload.post'

const MIME_BY_EXT: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  pdf: 'application/pdf',
  mp4: 'video/mp4',
  webm: 'video/webm',
}

// Public read of uploaded tracker files (names are unguessable random ids).
export default defineEventHandler((event) => {
  const name = getRouterParam(event, 'name') || ''
  // Strict allowlist blocks traversal: timestamp-hex.ext only.
  if (!/^\d{10,16}-[0-9a-f]{12}\.(png|jpg|webp|gif|pdf|mp4|webm)$/.test(name)) {
    throw createError({ statusCode: 400, statusMessage: 'Bad file name' })
  }
  const file = join(lunarUploadDir(), name)
  if (!existsSync(file)) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  setResponseHeaders(event, {
    'content-type': MIME_BY_EXT[name.split('.').pop() as string],
    'cache-control': 'public, max-age=31536000, immutable',
    'content-disposition': 'inline',
  })
  return readFileSync(file)
})
