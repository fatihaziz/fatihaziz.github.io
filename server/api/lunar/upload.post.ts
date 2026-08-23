import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { requireLunarUser } from '../../utils/lunar-auth'

// Phase 4 + UX overhaul: evidence upload for feedback/questions. Multiple
// files per request (multipart field "file", repeated); images + pdf + video
// so the team no longer needs Drive links. Files land on the Fly volume
// (LUNAR_UPLOAD_DIR or <dir of LUNAR_DB_PATH>/lunar-uploads).
const MAX_BYTES = 25 * 1024 * 1024
export const EXT_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
}

export function lunarUploadDir(): string {
  const explicit = process.env.LUNAR_UPLOAD_DIR?.trim()
  const dbPath = process.env.LUNAR_DB_PATH?.trim()
  const dir =
    explicit ||
    (dbPath ? join(dbPath, '..', 'lunar-uploads') : join(process.cwd(), 'data', 'lunar-uploads'))
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return dir
}

export default defineEventHandler(async (event) => {
  requireLunarUser(event)
  const parts = await readMultipartFormData(event)
  const files = (parts ?? []).filter((p) => p.name === 'file' && p.data?.length)
  if (!files.length) throw createError({ statusCode: 400, statusMessage: 'Kirim multipart field "file"' })
  if (files.length > 10) throw createError({ statusCode: 400, statusMessage: 'Maks 10 file per kiriman' })

  const saved: Array<{ path: string; name: string; bytes: number }> = []
  for (const file of files) {
    if (file.data.length > MAX_BYTES) {
      throw createError({ statusCode: 413, statusMessage: `Maks 25MB per file (${file.filename})` })
    }
    const ext = EXT_BY_MIME[file.type || '']
    if (!ext) {
      throw createError({
        statusCode: 415,
        statusMessage: `Tipe tidak didukung (${file.type || '?'}). Boleh: png/jpg/webp/gif/pdf/mp4/webm`,
      })
    }
    const name = `${Date.now()}-${randomBytes(6).toString('hex')}.${ext}`
    writeFileSync(join(lunarUploadDir(), name), file.data)
    saved.push({ path: `/api/lunar/uploads/${name}`, name, bytes: file.data.length })
  }
  // Back-compat: `path` = first file; `files` = everything.
  return { path: saved[0].path, files: saved }
})
