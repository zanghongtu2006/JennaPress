import { getPageBySlug } from '~/server/utils/content'

export default defineEventHandler((event) => {
  const slugParam = getRouterParam(event, 'slug')
  const slug = slugParam ? `/${slugParam}` : '/'
  const page = getPageBySlug(slug)

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  return page
})
