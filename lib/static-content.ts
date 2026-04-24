import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import { validatePageContent, validatePostContent, validateProduct, validateSiteConfig } from './schema'
import { DEFAULT_LOCALE, isSupportedLocale, prefixPathForLocale, type SupportedLocale } from './i18n'
import type {
  Block,
  BlogCategory,
  BlogCategoryAccent,
  BlogPostContent,
  BlogPostSummary,
  CtaBannerBlock,
  NavItem,
  PageContent,
  PostContent,
  Product,
  RichTextBlock,
  SearchIndexPayload,
  SearchIndexEntry,
  SiteConfig,
} from '~/types'

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })

type RawModuleMap = Record<string, string>

type LocalePayload = {
  site: SiteConfig
  pages: Record<string, PageContent>
  blog: {
    categories: BlogCategory[]
    posts: BlogPostSummary[]
    categoryMap: Record<string, { category: BlogCategory, posts: BlogPostSummary[] }>
    postMap: Record<string, BlogPostContent>
  }
  products: {
    categories: BlogCategory[]
    products: Product[]
    categoryMap: Record<string, { category: BlogCategory, products: Product[] }>
    productMap: Record<string, Product>
  }
}

function listMarkdownFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    return []
  }

  const files: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolutePath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(absolutePath))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(absolutePath)
    }
  }

  return files
}

function moduleKeyFromPath(filePath: string) {
  return `../${path.relative(process.cwd(), filePath).replace(/\\/g, '/')}`
}

function readCollectionModules(collection: 'pages' | 'posts' | 'products'): RawModuleMap {
  const dir = path.resolve(process.cwd(), 'content', collection)
  return Object.fromEntries(
    listMarkdownFiles(dir).map(filePath => [moduleKeyFromPath(filePath), fs.readFileSync(filePath, 'utf-8')]),
  )
}

function readSiteModules(): RawModuleMap {
  const dir = path.resolve(process.cwd(), 'content')
  if (!fs.existsSync(dir)) {
    return {}
  }

  return Object.fromEntries(
    fs.readdirSync(dir, { withFileTypes: true })
      .filter(entry => entry.isFile() && /^site(?:\.[a-z0-9-]+)?\.md$/i.test(entry.name))
      .map((entry) => {
        const filePath = path.join(dir, entry.name)
        return [moduleKeyFromPath(filePath), fs.readFileSync(filePath, 'utf-8')]
      }),
  )
}

const pageModules = readCollectionModules('pages')
const postModules = readCollectionModules('posts')
const siteModules = readSiteModules()
const productModules = readCollectionModules('products')

function resolveLocale(locale?: string | null): SupportedLocale {
  return isSupportedLocale(locale) ? locale : DEFAULT_LOCALE
}

function normalizePageSlug(slug: string) {
  return slug === '/' ? '/' : `/${slug.replace(/^\//, '')}`
}

function normalizePostSlug(slug: string) {
  return slug.replace(/^\//, '')
}

function normalizeProductSlug(slug: string) {
  return slug.replace(/^\//, '')
}

function slugifyCategory(input: string) {
  const normalized = input.normalize('NFKC').trim().toLowerCase()
  const slug = normalized.replace(/[^\p{Letter}\p{Number}]+/gu, '-').replace(/^-+|-+$/g, '')
  return slug || 'general'
}

function toCategoryLabel(input: string) {
  if (!input) return 'General'
  return input
    .replace(/[-_]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function isBlogCategoryAccent(value: string | undefined): value is BlogCategoryAccent {
  return value === 'default' || value === 'case-study' || value === 'product-note' || value === 'event-promo'
}


function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function markdownToRichTextBlock(markdown: string, title?: string): RichTextBlock | null {
  const trimmed = markdown.trim()
  if (!trimmed) {
    return null
  }

  return {
    type: 'rich-text',
    ...(title ? { title } : {}),
    html: md.render(trimmed),
  }
}

function localizeCanonical(canonical: string | undefined, requestedLocale: SupportedLocale) {
  if (!canonical) return canonical

  try {
    const url = new URL(canonical)
    url.pathname = prefixPathForLocale(url.pathname, requestedLocale)
    return url.toString()
  } catch {
    return prefixPathForLocale(canonical, requestedLocale)
  }
}

function localizeAction(action: { label: string, to: string } | undefined, requestedLocale: SupportedLocale) {
  if (!action) return action
  return {
    ...action,
    to: prefixPathForLocale(action.to, requestedLocale),
  }
}

function localizeBlock(block: Block, requestedLocale: SupportedLocale): Block {
  if (block.type === 'hero') {
    return {
      ...block,
      primaryAction: localizeAction(block.primaryAction, requestedLocale),
      secondaryAction: localizeAction(block.secondaryAction, requestedLocale),
    }
  }

  if (block.type === 'cta-banner') {
    return {
      ...block,
      action: localizeAction(block.action, requestedLocale)!,
    }
  }

  return block
}

function localizePostBodyBlock(block: RichTextBlock | CtaBannerBlock, requestedLocale: SupportedLocale) {
  if (block.type === 'cta-banner') {
    return {
      ...block,
      action: localizeAction(block.action, requestedLocale)!,
    }
  }
  return block
}

function localizePageContent(page: PageContent, requestedLocale: SupportedLocale): PageContent {
  const localized = clone(page)
  localized.blocks = localized.blocks.map(block => localizeBlock(block, requestedLocale))
  localized.seo = {
    ...localized.seo,
    canonical: localizeCanonical(localized.seo.canonical, requestedLocale),
  }
  return localized
}

function localizePostContent(post: PostContent, requestedLocale: SupportedLocale): PostContent {
  const localized = clone(post)
  localized.body = localized.body.map(block => localizePostBodyBlock(block, requestedLocale))
  localized.seo = {
    ...localized.seo,
    canonical: localizeCanonical(localized.seo.canonical, requestedLocale),
  }
  return localized
}

function localizeSiteConfig(site: SiteConfig, requestedLocale: SupportedLocale): SiteConfig {
  const localized = clone(site)
  localized.nav = localized.nav.map(item => ({
    ...item,
    to: prefixPathForLocale(item.to, requestedLocale),
  }))
  return localized
}

function parseRawMarkdown(raw: string) {
  return matter(raw)
}

function localeFromPath(filePath: string, collection: 'pages' | 'posts' | 'products' | 'site'): SupportedLocale {
  const normalized = filePath.replace(/\\/g, '/')

  if (collection === 'site') {
    const match = normalized.match(/\/site\.([a-z0-9-]+)\.md$/i)
    return match?.[1]?.toLowerCase() || DEFAULT_LOCALE
  }

  const match = normalized.match(new RegExp(`/${collection}/([a-z0-9-]+)/`, 'i'))
  return match?.[1]?.toLowerCase() || DEFAULT_LOCALE
}

function readPageFile(raw: string): PageContent {
  const parsed = parseRawMarkdown(raw)
  const data = (parsed.data || {}) as Record<string, any>
  const blocks = Array.isArray(data.blocks) ? [...(data.blocks as Block[])] : []
  const bodyBlock = markdownToRichTextBlock(parsed.content, typeof data.bodyTitle === 'string' ? data.bodyTitle : undefined)

  if (bodyBlock) {
    blocks.push(bodyBlock)
  }

  return validatePageContent({
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    seo: data.seo,
    blocks,
  })
}

function readPostFile(raw: string): PostContent {
  const parsed = parseRawMarkdown(raw)
  const data = (parsed.data || {}) as Record<string, any>
  const body: Array<RichTextBlock | CtaBannerBlock> = []
  const bodyBlock = markdownToRichTextBlock(parsed.content, typeof data.bodyTitle === 'string' ? data.bodyTitle : undefined)

  if (bodyBlock) {
    body.push(bodyBlock)
  }

  if (Array.isArray(data.bodyBlocks)) {
    body.push(...(data.bodyBlocks as Array<RichTextBlock | CtaBannerBlock>))
  }

  return validatePostContent({
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt,
    coverImage: data.coverImage,
    tags: data.tags,
    category: data.category,
    author: data.author,
    seo: data.seo,
    body,
  })
}

function readProductFile(raw: string): Product {
  const parsed = parseRawMarkdown(raw)
  const data = (parsed.data || {}) as Record<string, any>
  return validateProduct({
    ...data,
    blocks: Array.isArray(data.blocks) ? data.blocks : [],
  })
}

function readSiteFile(raw: string): SiteConfig {
  const parsed = parseRawMarkdown(raw)
  return validateSiteConfig(parsed.data || {})
}

function getLocalizedModuleEntries(modules: RawModuleMap, collection: 'pages' | 'posts' | 'site' | 'products', locale: SupportedLocale) {
  return Object.entries(modules).filter(([filePath]) => localeFromPath(filePath, collection) === locale)
}

function getLocalizedProductEntries(modules: RawModuleMap, locale: SupportedLocale) {
  return Object.entries(modules).filter(([filePath]) => localeFromPath(filePath, 'products') === locale)
}

function getPageMapForLocale(locale: SupportedLocale) {
  const map = new Map<string, PageContent>()

  for (const [, raw] of getLocalizedModuleEntries(pageModules, 'pages', DEFAULT_LOCALE)) {
    const page = readPageFile(raw)
    map.set(page.slug, page)
  }

  if (locale !== DEFAULT_LOCALE) {
    for (const [, raw] of getLocalizedModuleEntries(pageModules, 'pages', locale)) {
      const page = readPageFile(raw)
      map.set(page.slug, page)
    }
  }

  return map
}

function getPostMapForLocale(locale: SupportedLocale) {
  const map = new Map<string, PostContent>()

  for (const [, raw] of getLocalizedModuleEntries(postModules, 'posts', DEFAULT_LOCALE)) {
    const post = readPostFile(raw)
    map.set(normalizePostSlug(post.slug), post)
  }

  if (locale !== DEFAULT_LOCALE) {
    for (const [, raw] of getLocalizedModuleEntries(postModules, 'posts', locale)) {
      const post = readPostFile(raw)
      map.set(normalizePostSlug(post.slug), post)
    }
  }

  return map
}

function getProductMapForLocale(locale: SupportedLocale) {
  const map = new Map<string, Product>()

  for (const [, raw] of getLocalizedProductEntries(productModules, DEFAULT_LOCALE)) {
    const product = readProductFile(raw)
    map.set(normalizeProductSlug(product.slug), product)
  }

  if (locale !== DEFAULT_LOCALE) {
    for (const [, raw] of getLocalizedProductEntries(productModules, locale)) {
      const product = readProductFile(raw)
      map.set(normalizeProductSlug(product.slug), product)
    }
  }

  return map
}

function getSiteConfigForLocale(locale: SupportedLocale) {
  const localizedEntry = Object.entries(siteModules).find(([filePath]) => localeFromPath(filePath, 'site') === locale)
  const defaultEntry = Object.entries(siteModules).find(([filePath]) => localeFromPath(filePath, 'site') === DEFAULT_LOCALE)
  const raw = (locale !== DEFAULT_LOCALE ? localizedEntry?.[1] : undefined) ?? defaultEntry?.[1]

  if (!raw) {
    throw new Error('Site config file not found: expected content/site.md')
  }

  return localizeSiteConfig(readSiteFile(raw), locale)
}

function buildCategoryMeta(post: PostContent, locale: SupportedLocale = DEFAULT_LOCALE): BlogCategory {
  const extra = post as PostContent & {
    categoryKey?: string
    categorySlug?: string
    categoryLabel?: string
    categoryDescription?: string
    categoryListTitle?: string
    categoryAccent?: string
  }

  const categoryValue = typeof post.category === 'string' && post.category.trim() ? post.category.trim() : 'General'
  const label = typeof extra.categoryLabel === 'string' && extra.categoryLabel.trim() ? extra.categoryLabel.trim() : toCategoryLabel(categoryValue)
  const slug = typeof extra.categorySlug === 'string' && extra.categorySlug.trim() ? slugifyCategory(extra.categorySlug) : slugifyCategory(categoryValue)
  return {
    key: typeof extra.categoryKey === 'string' && extra.categoryKey.trim() ? extra.categoryKey.trim() : categoryValue || 'General',
    slug,
    label,
    description: typeof extra.categoryDescription === 'string' && extra.categoryDescription.trim() ? extra.categoryDescription.trim() : label,
    accent: isBlogCategoryAccent(extra.categoryAccent) ? extra.categoryAccent : 'default',
    listTitle: typeof extra.categoryListTitle === 'string' && extra.categoryListTitle.trim() ? extra.categoryListTitle.trim() : label,
  }
}

function toBlogPost(post: PostContent, locale: SupportedLocale = DEFAULT_LOCALE): BlogPostContent {
  const categoryValue = typeof post.category === 'string' && post.category.trim() ? post.category.trim() : 'General'
  const categoryMeta = buildCategoryMeta(post, locale)
  return {
    ...post,
    category: categoryValue,
    categoryMeta,
  }
}

function buildProductCategoryMeta(product: Product): BlogCategory {
  const extra = product as Product & {
    categoryKey?: string
    categorySlug?: string
    categoryLabel?: string
    categoryDescription?: string
    categoryListTitle?: string
    categoryAccent?: string
  }

  const categoryValue = typeof product.category === 'string' && product.category.trim() ? product.category.trim() : 'General'
  const label = typeof extra.categoryLabel === 'string' && extra.categoryLabel.trim() ? extra.categoryLabel.trim() : toCategoryLabel(categoryValue)
  const slug = typeof extra.categorySlug === 'string' && extra.categorySlug.trim() ? slugifyCategory(extra.categorySlug) : slugifyCategory(categoryValue)

  return {
    key: typeof extra.categoryKey === 'string' && extra.categoryKey.trim() ? extra.categoryKey.trim() : categoryValue,
    slug,
    label,
    description: typeof extra.categoryDescription === 'string' && extra.categoryDescription.trim() ? extra.categoryDescription.trim() : label,
    accent: isBlogCategoryAccent(extra.categoryAccent) ? extra.categoryAccent : 'default',
    listTitle: typeof extra.categoryListTitle === 'string' && extra.categoryListTitle.trim() ? extra.categoryListTitle.trim() : label,
  }
}

function toProductRecord(product: Product): Product {
  return {
    ...product,
    category: typeof product.category === 'string' && product.category.trim() ? product.category.trim() : 'General',
    categoryMeta: buildProductCategoryMeta(product),
  }
}

function textFromHtml(html: string | undefined) {
  return typeof html === 'string'
    ? html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    : ''
}

function textFromBlock(block: Block | RichTextBlock | CtaBannerBlock) {
  if (block.type === 'hero') {
    return [block.kicker, block.title, block.description, block.panelTitle, ...(block.panelLines || [])].filter(Boolean).join(' ')
  }

  if (block.type === 'feature-grid') {
    return [block.title, block.description, ...block.items.flatMap(item => [item.title, item.description])].filter(Boolean).join(' ')
  }

  if (block.type === 'rich-text') {
    return [block.title, textFromHtml(block.html)].filter(Boolean).join(' ')
  }

  if (block.type === 'cta-banner') {
    return [block.title, block.description, block.action.label].filter(Boolean).join(' ')
  }

  if (block.type === 'stats') {
    return [block.title, block.description, ...block.items.flatMap(item => [item.value, item.label, item.note])].filter(Boolean).join(' ')
  }

  return ''
}

function compactText(parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
}

function buildSearchIndex(locale: SupportedLocale): SearchIndexPayload {
  const payload = getLocalePayload(locale)
  const entries: SearchIndexEntry[] = []

  for (const page of Object.values(payload.pages)) {
    entries.push({
      id: `pages:${page.slug}`,
      collection: 'pages',
      locale,
      title: page.title,
      description: page.summary || page.seo.description,
      url: prefixPathForLocale(page.slug, locale),
      text: compactText([
        page.title,
        page.summary,
        page.seo.title,
        page.seo.description,
        ...page.blocks.map(textFromBlock),
      ]),
    })
  }

  for (const post of payload.blog.posts) {
    entries.push({
      id: `blog:${post.categoryMeta.slug}/${post.slug}`,
      collection: 'blog',
      locale,
      title: post.title,
      description: post.summary,
      url: prefixPathForLocale(`/blog/${post.categoryMeta.slug}/${post.slug}`, locale),
      text: compactText([
        post.title,
        post.summary,
        post.seo.title,
        post.seo.description,
        post.category,
        post.categoryMeta.label,
        ...(post.tags || []),
      ]),
      category: post.categoryMeta.slug,
      categoryLabel: post.categoryMeta.label,
      tags: post.tags || [],
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
    })
  }

  for (const product of payload.products.products) {
    const categorySlug = product.categoryMeta?.slug || slugifyCategory(product.category)
    entries.push({
      id: `products:${categorySlug}/${product.slug}`,
      collection: 'products',
      locale,
      title: product.title,
      description: product.description,
      url: prefixPathForLocale(`/products/${categorySlug}/${product.slug}`, locale),
      text: compactText([
        product.title,
        product.description,
        product.seo?.title,
        product.seo?.description,
        product.category,
        product.categoryMeta?.label,
        ...(product.tags || []),
        ...(product.blocks || []).map(textFromBlock),
      ]),
      category: categorySlug,
      categoryLabel: product.categoryMeta?.label,
      tags: product.tags || [],
      updatedAt: product.updatedAt,
    })
  }

  return { locale, entries }
}


function discoverNav(locale: SupportedLocale, pages: Record<string, PageContent>, posts: BlogPostSummary[], products: Product[]): NavItem[] {
  const nav: NavItem[] = []

  if (pages['/']) {
    nav.push({ label: pages['/'].title, to: prefixPathForLocale('/', locale) })
  }

  const preferred = ['/about', '/principles']
  const slugs = Object.keys(pages).filter((slug) => slug !== '/')
  slugs.sort((a, b) => {
    const aIndex = preferred.indexOf(a)
    const bIndex = preferred.indexOf(b)
    if (aIndex !== -1 || bIndex !== -1) {
      return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) - (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex)
    }
    return a.localeCompare(b)
  })

  for (const slug of slugs) {
    const page = pages[slug]
    if (!page) continue
    nav.push({ label: page.title, to: prefixPathForLocale(slug, locale) })
  }

  if (posts.length) {
    nav.push({ label: 'Blog', to: prefixPathForLocale('/blog', locale) })
  }

  if (products.length) {
    nav.push({ label: 'Products', to: prefixPathForLocale('/products', locale) })
  }

  return nav
}

const localePayloadCache = new Map<SupportedLocale, LocalePayload>()

function buildLocalePayload(locale: SupportedLocale): LocalePayload {
  const pageMap = getPageMapForLocale(locale)
  const pages: Record<string, PageContent> = {}
  for (const [slug, page] of pageMap.entries()) {
    pages[slug] = localizePageContent(page, locale)
  }

  const posts = Array.from(getPostMapForLocale(locale).values())
    .map(post => localizePostContent(post, locale))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  const blogPosts = posts
    .map(post => toBlogPost(post, locale))
    .map(({ body, author, ...summary }) => summary)

  const categories = new Map<string, BlogCategory>()
  for (const post of posts) {
    const meta = buildCategoryMeta(post, locale)
    categories.set(meta.slug, meta)
  }
  const sortedCategories = Array.from(categories.values()).sort((a, b) => a.label.localeCompare(b.label))

  const categoryMap: Record<string, { category: BlogCategory, posts: BlogPostSummary[] }> = {}
  for (const category of sortedCategories) {
    categoryMap[category.slug] = {
      category,
      posts: blogPosts.filter(post => post.categoryMeta.slug === category.slug),
    }
  }

  const postMap: Record<string, BlogPostContent> = {}
  for (const post of posts.map(post => toBlogPost(post, locale))) {
    const key = `${post.categoryMeta.slug}/${normalizePostSlug(post.slug)}`
    postMap[key] = post
  }

  // Build products data
  const productEntries = Array.from(getProductMapForLocale(locale).values())
    .map(product => toProductRecord(product))

  const productCategories = new Map<string, BlogCategory>()
  for (const product of productEntries) {
    const categoryMeta = product.categoryMeta
    if (categoryMeta) {
      productCategories.set(categoryMeta.slug, categoryMeta)
    }
  }
  const sortedProductCategories = Array.from(productCategories.values()).sort((a, b) => a.label.localeCompare(b.label))

  const productCategoryMap: Record<string, { category: BlogCategory, products: Product[] }> = {}
  for (const category of sortedProductCategories) {
    productCategoryMap[category.slug] = {
      category,
      products: productEntries.filter(product => product.categoryMeta?.slug === category.slug),
    }
  }

  const productMap: Record<string, Product> = {}
  for (const product of productEntries) {
    const categorySlug = product.categoryMeta?.slug
    if (!categorySlug) continue
    const key = `${categorySlug}/${normalizeProductSlug(product.slug)}`
    productMap[key] = product
  }

  const site = getSiteConfigForLocale(locale)
  if (!Array.isArray(site.nav) || site.nav.length === 0) {
    site.nav = discoverNav(locale, pages, blogPosts, productEntries)
  }

  return {
    site,
    pages,
    blog: {
      categories: sortedCategories,
      posts: blogPosts,
      categoryMap,
      postMap,
    },
    products: {
      categories: sortedProductCategories,
      products: productEntries,
      categoryMap: productCategoryMap,
      productMap,
    },
  }
}

function getLocalePayload(locale?: string | null): LocalePayload {
  const resolved = resolveLocale(locale)
  const cached = localePayloadCache.get(resolved)
  if (cached) {
    return cached
  }

  const payload = buildLocalePayload(resolved)
  localePayloadCache.set(resolved, payload)
  return payload
}

export function getStaticSite(locale?: string | null): SiteConfig | null {
  return getLocalePayload(locale).site
}

export function getStaticPage(slug: string, locale?: string | null): PageContent | null {
  const normalized = normalizePageSlug(slug)
  return getLocalePayload(locale).pages[normalized] ?? null
}

export function getStaticBlogCategories(locale?: string | null): BlogCategory[] {
  return getLocalePayload(locale).blog.categories
}

export function getStaticBlogPosts(locale?: string | null): BlogPostSummary[] {
  return getLocalePayload(locale).blog.posts
}

export function getStaticBlogCategoryPayload(category: string, locale?: string | null): { category: BlogCategory, posts: BlogPostSummary[] } | null {
  return getLocalePayload(locale).blog.categoryMap[category] ?? null
}

export function getStaticBlogPost(category: string, slug: string, locale?: string | null): BlogPostContent | null {
  const key = `${category}/${slug.replace(/^\//, '')}`
  return getLocalePayload(locale).blog.postMap[key] ?? null
}

export function getStaticProductCategories(locale?: string | null): BlogCategory[] {
  return getLocalePayload(locale).products.categories
}

export function getStaticProducts(locale?: string | null): Product[] {
  return getLocalePayload(locale).products.products
}

export function getStaticProductCategoryPayload(category: string, locale?: string | null): { category: BlogCategory, products: Product[] } | null {
  return getLocalePayload(locale).products.categoryMap[category] ?? null
}

export function getStaticProduct(category: string, slug: string, locale?: string | null): Product | null {
  const key = `${category}/${slug.replace(/^\//, '')}`
  return getLocalePayload(locale).products.productMap[key] ?? null
}

export function getStaticSearchIndex(locale?: string | null): SearchIndexPayload {
  return buildSearchIndex(resolveLocale(locale))
}
