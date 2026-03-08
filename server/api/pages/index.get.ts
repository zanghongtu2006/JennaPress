import { getPageBySlug } from '~/server/utils/content'

export default defineEventHandler(() => {
  const page = getPageBySlug('/')

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  return page
})
