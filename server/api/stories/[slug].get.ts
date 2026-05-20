export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') as string
  const story = getStory(slug)
  if (!story) throw createError({ statusCode: 404, statusMessage: 'Story not found' })
  return story
})
