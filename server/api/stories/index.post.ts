export default defineEventHandler(async (event) => {
  assertCanWrite(event)
  const body = await readBody(event)
  if (!body || typeof body.title !== 'string' || !body.title.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'A title is required' })
  }
  return createStory({
    title: body.title,
    content_html:
      typeof body.contentHtml === 'string' ? body.contentHtml : body.content_html ?? '',
    font: body.font,
    theme: body.theme,
    base_size: body.baseSize ?? body.base_size,
    author: body.author,
  })
})
