import { getBlogCategoryBySlug, getBlogPostsByCategory } from '~/server/utils/content'

export default defineEventHandler((event) => {
  const category = getRouterParam(event, 'category') || ''
  const categoryMeta = getBlogCategoryBySlug(category)

  if (!categoryMeta) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }

  return {
    category: categoryMeta,
    posts: getBlogPostsByCategory(category)
  }
})
