import { getAllBlogPostSummaries } from '~/server/utils/content'

export default defineEventHandler(() => {
  try {
    return getAllBlogPostSummaries()
  } catch (error: any) {
    console.error('[api/posts] failed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to load posts'
    })
  }
})
