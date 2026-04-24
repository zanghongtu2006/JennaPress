import { getStaticBlogCategories, getStaticBlogCategoryPayload, getStaticBlogPost, getStaticBlogPosts, getStaticPage, getStaticProduct, getStaticProductCategories, getStaticProductCategoryPayload, getStaticProducts, getStaticSearchIndex, getStaticSite } from '~/lib/static-content'

function decodePath(value: string | undefined) {
  return (value || '').split('/').filter(Boolean).map(segment => decodeURIComponent(segment))
}

function pageSlugFromSegments(segments: string[]) {
  if (!segments.length || segments[0] === '_root') {
    return '/'
  }

  return `/${segments.join('/')}`
}

export default defineEventHandler((event) => {
  const locale = event.context.params?.locale
  const path = decodePath(event.context.params?.path)
  const [collection, action, ...rest] = path

  if (collection === 'site') {
    return getStaticSite(locale)
  }

  if (collection === 'page') {
    return getStaticPage(pageSlugFromSegments([action, ...rest].filter(Boolean)), locale)
  }

  if (collection === 'blog') {
    if (action === 'categories') return getStaticBlogCategories(locale)
    if (action === 'posts') return getStaticBlogPosts(locale)
    if (action === 'category') return getStaticBlogCategoryPayload(rest[0] || '', locale)
    if (action === 'post') return getStaticBlogPost(rest[0] || '', rest[1] || '', locale)
  }

  if (collection === 'products') {
    if (action === 'categories') return getStaticProductCategories(locale)
    if (action === 'items') return getStaticProducts(locale)
    if (action === 'category') return getStaticProductCategoryPayload(rest[0] || '', locale)
    if (action === 'item') return getStaticProduct(rest[0] || '', rest[1] || '', locale)
  }

  if (collection === 'search-index') {
    return getStaticSearchIndex(locale)
  }

  throw createError({ statusCode: 404, statusMessage: 'Content endpoint not found' })
})
