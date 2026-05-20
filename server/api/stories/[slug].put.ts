export default defineEventHandler(async (event) => {
  assertCanWrite(event)
  const slug = getRouterParam(event, 'slug') as string
  const body = await readBody(event)
  const updated = updateStory(slug, {
    title: body.title,
    content_html:
      typeof body.contentHtml === 'string' ? body.contentHtml : body.content_html ?? '',
    font: body.font,
    theme: body.theme,
    base_size: body.baseSize ?? body.base_size,
    author: body.author,
  })
  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Story not found' })
  return updated
})
