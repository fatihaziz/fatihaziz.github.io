import type { H3Event } from 'h3'

// Writes are open by default (no login, public collab). If NUXT_WRITE_SECRET is
// set, create/update require a matching x-write-secret header.
export function assertCanWrite(event: H3Event) {
  const secret = useRuntimeConfig().writeSecret
  if (!secret) return
  if (getHeader(event, 'x-write-secret') !== secret) {
    throw createError({ statusCode: 401, statusMessage: 'Writing is locked' })
  }
}
