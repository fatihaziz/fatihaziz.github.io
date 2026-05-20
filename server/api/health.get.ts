// Health check for Fly.io machine lifecycle (standard flyio-deployment Pattern 5).
// No auth, no DB query -- must stay cheap. Path matches Dockerfile + fly.toml.
export default defineEventHandler(() => {
  return { data: 'ok' }
})
