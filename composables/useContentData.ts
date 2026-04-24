import { DEFAULT_LOCALE } from '~/lib/i18n'
import type { BlogCategory, BlogPostContent, BlogPostSummary, PageContent, Product, SiteConfig } from '~/types'

function resolveContentLocale(locale?: string | null) {
  return locale || DEFAULT_LOCALE
}

function encodeSegment(value: string) {
  return encodeURIComponent(value)
}

function pageSlugToSegments(slug: string) {
  const normalized = slug === '/' ? '_root' : slug.replace(/^\/+/, '')
  return normalized.split('/').filter(Boolean).map(encodeSegment).join('/')
}

function contentApiPath(locale: string, ...segments: string[]) {
  return `/api/content/${encodeSegment(resolveContentLocale(locale))}/${segments.join('/')}`
}

export async function fetchSiteContent(locale?: string | null) {
  const resolvedLocale = resolveContentLocale(locale)

  if (import.meta.server) {
    const { getStaticSite } = await import('~/lib/static-content')
    return getStaticSite(resolvedLocale)
  }

  return await $fetch<SiteConfig | null>(contentApiPath(resolvedLocale, 'site'))
}

export async function fetchPageContent(slug: string, locale?: string | null) {
  const resolvedLocale = resolveContentLocale(locale)

  if (import.meta.server) {
    const { getStaticPage } = await import('~/lib/static-content')
    return getStaticPage(slug, resolvedLocale)
  }

  return await $fetch<PageContent | null>(contentApiPath(resolvedLocale, 'page', pageSlugToSegments(slug)))
}

export async function fetchBlogCategories(locale?: string | null) {
  const resolvedLocale = resolveContentLocale(locale)

  if (import.meta.server) {
    const { getStaticBlogCategories } = await import('~/lib/static-content')
    return getStaticBlogCategories(resolvedLocale)
  }

  return await $fetch<BlogCategory[]>(contentApiPath(resolvedLocale, 'blog', 'categories'))
}

export async function fetchBlogPosts(locale?: string | null) {
  const resolvedLocale = resolveContentLocale(locale)

  if (import.meta.server) {
    const { getStaticBlogPosts } = await import('~/lib/static-content')
    return getStaticBlogPosts(resolvedLocale)
  }

  return await $fetch<BlogPostSummary[]>(contentApiPath(resolvedLocale, 'blog', 'posts'))
}

export async function fetchBlogCategoryContent(category: string, locale?: string | null) {
  const resolvedLocale = resolveContentLocale(locale)

  if (import.meta.server) {
    const { getStaticBlogCategoryPayload } = await import('~/lib/static-content')
    return getStaticBlogCategoryPayload(category, resolvedLocale)
  }

  return await $fetch<{ category: BlogCategory, posts: BlogPostSummary[] } | null>(
    contentApiPath(resolvedLocale, 'blog', 'category', encodeSegment(category)),
  )
}

export async function fetchBlogPostContent(category: string, slug: string, locale?: string | null) {
  const resolvedLocale = resolveContentLocale(locale)

  if (import.meta.server) {
    const { getStaticBlogPost } = await import('~/lib/static-content')
    return getStaticBlogPost(category, slug, resolvedLocale)
  }

  return await $fetch<BlogPostContent | null>(
    contentApiPath(resolvedLocale, 'blog', 'post', encodeSegment(category), encodeSegment(slug)),
  )
}

export async function fetchProductCategories(locale?: string | null) {
  const resolvedLocale = resolveContentLocale(locale)

  if (import.meta.server) {
    const { getStaticProductCategories } = await import('~/lib/static-content')
    return getStaticProductCategories(resolvedLocale)
  }

  return await $fetch<BlogCategory[]>(contentApiPath(resolvedLocale, 'products', 'categories'))
}

export async function fetchProductsContent(locale?: string | null) {
  const resolvedLocale = resolveContentLocale(locale)

  if (import.meta.server) {
    const { getStaticProducts } = await import('~/lib/static-content')
    return getStaticProducts(resolvedLocale)
  }

  return await $fetch<Product[]>(contentApiPath(resolvedLocale, 'products', 'items'))
}

export async function fetchProductCategoryContent(category: string, locale?: string | null) {
  const resolvedLocale = resolveContentLocale(locale)

  if (import.meta.server) {
    const { getStaticProductCategoryPayload } = await import('~/lib/static-content')
    return getStaticProductCategoryPayload(category, resolvedLocale)
  }

  return await $fetch<{ category: BlogCategory, products: Product[] } | null>(
    contentApiPath(resolvedLocale, 'products', 'category', encodeSegment(category)),
  )
}

export async function fetchProductContent(category: string, slug: string, locale?: string | null) {
  const resolvedLocale = resolveContentLocale(locale)

  if (import.meta.server) {
    const { getStaticProduct } = await import('~/lib/static-content')
    return getStaticProduct(category, slug, resolvedLocale)
  }

  return await $fetch<Product | null>(
    contentApiPath(resolvedLocale, 'products', 'item', encodeSegment(category), encodeSegment(slug)),
  )
}
