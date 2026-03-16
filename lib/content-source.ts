import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import { validatePageContent, validatePostContent, validateSiteConfig } from './schema'
import { DEFAULT_LOCALE, prefixPathForLocale, type SupportedLocale } from './i18n'
import { ensureTemplateExists } from './templates'
import type {
  Block,
  BlogCategory,
  BlogCategoryAccent,
  BlogPostContent,
  BlogPostSummary,
  CtaBannerBlock,
  PageContent,
  PostContent,
  PostSummary,
  RichTextBlock,
  SiteConfig
} from '../types'

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })

function readMarkdownFile(absolutePath: string) {
  const raw = fs.readFileSync(absolutePath, 'utf-8')
  return matter(raw)
}

function getCollectionFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    return []
  }
  return fs.readdirSync(dir).filter((file) => file.endsWith('.md'))
}

function normalizePageSlug(slug: string) {
  return slug === '/' ? '/' : `/${slug.replace(/^\//, '')}`
}

function normalizePostSlug(slug: string) {
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

const genericCategoryText: Record<SupportedLocale, { description: (label: string) => string; listTitle: (label: string) => string }> = {
  en: {
    description: (label) => `${label} posts grouped under one first-level CMS category.`,
    listTitle: (label) => `${label} articles`
  },
  de: {
    description: (label) => `${label}-Beiträge in einer Blog-Kategorie der ersten Ebene.`,
    listTitle: (label) => `${label}-Artikel`
  },
  zh: {
    description: (label) => `归档在一级博客分类“${label}”下的文章。`,
    listTitle: (label) => `${label}文章`
  }
}

function markdownToRichTextBlock(markdown: string, title?: string): RichTextBlock | null {
  const trimmed = markdown.trim()
  if (!trimmed) {
    return null
  }

  return {
    type: 'rich-text',
    ...(title ? { title } : {}),
    html: md.render(trimmed)
  }
}

function readPageFile(absolutePath: string): PageContent {
  const parsed = readMarkdownFile(absolutePath)
  const data = (parsed.data || {}) as Record<string, any>
  const blocks = Array.isArray(data.blocks) ? [...data.blocks as Block[]] : []
  const bodyBlock = markdownToRichTextBlock(parsed.content, typeof data.bodyTitle === 'string' ? data.bodyTitle : undefined)

  if (bodyBlock) {
    blocks.push(bodyBlock)
  }

  return validatePageContent({
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    seo: data.seo,
    blocks
  })
}

function readPostFile(absolutePath: string): PostContent {
  const parsed = readMarkdownFile(absolutePath)
  const data = (parsed.data || {}) as Record<string, any>
  const body: Array<RichTextBlock | CtaBannerBlock> = []
  const bodyBlock = markdownToRichTextBlock(parsed.content, typeof data.bodyTitle === 'string' ? data.bodyTitle : undefined)

  if (bodyBlock) {
    body.push(bodyBlock)
  }

  if (Array.isArray(data.bodyBlocks)) {
    body.push(...data.bodyBlocks as Array<RichTextBlock | CtaBannerBlock>)
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
    body
  })
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
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
    to: prefixPathForLocale(action.to, requestedLocale)
  }
}

function localizeBlock(block: Block, requestedLocale: SupportedLocale): Block {
  if (block.type === 'hero') {
    return {
      ...block,
      primaryAction: localizeAction(block.primaryAction, requestedLocale),
      secondaryAction: localizeAction(block.secondaryAction, requestedLocale)
    }
  }

  if (block.type === 'cta-banner') {
    return {
      ...block,
      action: localizeAction(block.action, requestedLocale)!
    }
  }

  return block
}

function localizePostBodyBlock(block: RichTextBlock | CtaBannerBlock, requestedLocale: SupportedLocale) {
  if (block.type === 'cta-banner') {
    return {
      ...block,
      action: localizeAction(block.action, requestedLocale)!
    }
  }
  return block
}

function localizePageContent(page: PageContent, requestedLocale: SupportedLocale): PageContent {
  const localized = clone(page)
  localized.blocks = localized.blocks.map(block => localizeBlock(block, requestedLocale))
  localized.seo = {
    ...localized.seo,
    canonical: localizeCanonical(localized.seo.canonical, requestedLocale)
  }
  return localized
}

function localizePostContent(post: PostContent, requestedLocale: SupportedLocale): PostContent {
  const localized = clone(post)
  localized.body = localized.body.map(block => localizePostBodyBlock(block, requestedLocale))
  localized.seo = {
    ...localized.seo,
    canonical: localizeCanonical(localized.seo.canonical, requestedLocale)
  }
  return localized
}

function localizeSiteConfig(site: SiteConfig, requestedLocale: SupportedLocale): SiteConfig {
  const localized = clone(site)
  localized.nav = localized.nav.map(item => ({
    ...item,
    to: prefixPathForLocale(item.to, requestedLocale)
  }))
  return localized
}

function getLocalizedCollectionDir(collection: 'pages' | 'posts', locale: SupportedLocale) {
  const baseDir = path.resolve(process.cwd(), `content/${collection}`)
  if (locale === DEFAULT_LOCALE) {
    return baseDir
  }
  return path.join(baseDir, locale)
}

function getPageMapForLocale(locale: SupportedLocale) {
  const defaultDir = getLocalizedCollectionDir('pages', DEFAULT_LOCALE)
  const localizedDir = getLocalizedCollectionDir('pages', locale)
  const map = new Map<string, PageContent>()

  for (const file of getCollectionFiles(defaultDir)) {
    const page = readPageFile(path.join(defaultDir, file))
    map.set(page.slug, page)
  }

  if (locale !== DEFAULT_LOCALE) {
    for (const file of getCollectionFiles(localizedDir)) {
      const page = readPageFile(path.join(localizedDir, file))
      map.set(page.slug, page)
    }
  }

  return map
}

function getPostMapForLocale(locale: SupportedLocale) {
  const defaultDir = getLocalizedCollectionDir('posts', DEFAULT_LOCALE)
  const localizedDir = getLocalizedCollectionDir('posts', locale)
  const map = new Map<string, PostContent>()

  for (const file of getCollectionFiles(defaultDir)) {
    const post = readPostFile(path.join(defaultDir, file))
    map.set(normalizePostSlug(post.slug), post)
  }

  if (locale !== DEFAULT_LOCALE) {
    for (const file of getCollectionFiles(localizedDir)) {
      const post = readPostFile(path.join(localizedDir, file))
      map.set(normalizePostSlug(post.slug), post)
    }
  }

  return map
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
  const text = genericCategoryText[locale]

  return {
    key: typeof extra.categoryKey === 'string' && extra.categoryKey.trim() ? extra.categoryKey.trim() : categoryValue || 'General',
    slug,
    label,
    description: typeof extra.categoryDescription === 'string' && extra.categoryDescription.trim() ? extra.categoryDescription.trim() : text.description(label),
    accent: isBlogCategoryAccent(extra.categoryAccent) ? extra.categoryAccent : 'default',
    listTitle: typeof extra.categoryListTitle === 'string' && extra.categoryListTitle.trim() ? extra.categoryListTitle.trim() : text.listTitle(label)
  }
}

function toBlogPost(post: PostContent, locale: SupportedLocale = DEFAULT_LOCALE): BlogPostContent {
  const categoryValue = typeof post.category === 'string' && post.category.trim() ? post.category.trim() : 'General'
  const categoryMeta = buildCategoryMeta(post, locale)
  return {
    ...post,
    category: categoryValue,
    categoryMeta
  }
}

export function getSiteConfig(locale: SupportedLocale = DEFAULT_LOCALE): SiteConfig {
  const localizedFile = path.resolve(process.cwd(), `content/site.${locale}.md`)
  const defaultFile = path.resolve(process.cwd(), 'content/site.md')
  const mdFile = locale !== DEFAULT_LOCALE && fs.existsSync(localizedFile) ? localizedFile : defaultFile

  if (!fs.existsSync(mdFile)) {
    throw new Error('Site config file not found: expected content/site.md')
  }

  const parsed = readMarkdownFile(mdFile)
  const site = validateSiteConfig(parsed.data || {})
  ensureTemplateExists(site.defaultTemplate)
  return localizeSiteConfig(site, locale)
}

export function getAllPages(locale: SupportedLocale = DEFAULT_LOCALE): PageContent[] {
  return Array.from(getPageMapForLocale(locale).values())
    .map(page => localizePageContent(page, locale))
    .sort((a, b) => a.slug.localeCompare(b.slug))
}

export function getPageBySlug(slug: string, locale: SupportedLocale = DEFAULT_LOCALE): PageContent | null {
  const normalized = normalizePageSlug(slug)
  const page = getPageMapForLocale(locale).get(normalized) ?? null
  return page ? localizePageContent(page, locale) : null
}

export function getAllPosts(locale: SupportedLocale = DEFAULT_LOCALE): PostContent[] {
  return Array.from(getPostMapForLocale(locale).values())
    .map(post => localizePostContent(post, locale))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getAllPostSummaries(locale: SupportedLocale = DEFAULT_LOCALE): PostSummary[] {
  return getAllPosts(locale).map(({ body, author, ...summary }) => summary)
}

export function getPostBySlug(slug: string, locale: SupportedLocale = DEFAULT_LOCALE): PostContent | null {
  const normalized = normalizePostSlug(slug)
  const post = getPostMapForLocale(locale).get(normalized) ?? null
  return post ? localizePostContent(post, locale) : null
}

export function getBlogCategories(locale: SupportedLocale = DEFAULT_LOCALE): BlogCategory[] {
  const categories = new Map<string, BlogCategory>()
  for (const post of getAllPosts(locale)) {
    const meta = buildCategoryMeta(post, locale)
    categories.set(meta.slug, meta)
  }
  return Array.from(categories.values()).sort((a, b) => a.label.localeCompare(b.label))
}

export function getAllBlogPostSummaries(locale: SupportedLocale = DEFAULT_LOCALE): BlogPostSummary[] {
  return getAllPosts(locale).map(post => toBlogPost(post, locale)).map(({ body, author, ...summary }) => summary)
}

export function getBlogPostByCategoryAndSlug(categorySlug: string, slug: string, locale: SupportedLocale = DEFAULT_LOCALE): BlogPostContent | null {
  const normalizedSlug = normalizePostSlug(slug)
  return getAllPosts(locale)
    .map(post => toBlogPost(post, locale))
    .find(post => post.categoryMeta.slug === categorySlug && normalizePostSlug(post.slug) === normalizedSlug) ?? null
}

export function getBlogPostsByCategory(categorySlug: string, locale: SupportedLocale = DEFAULT_LOCALE): BlogPostSummary[] {
  const category = getBlogCategoryBySlug(categorySlug, locale)
  if (!category) throw new Error(`Unsupported blog category: ${categorySlug}`)
  return getAllBlogPostSummaries(locale).filter(post => post.categoryMeta.slug === categorySlug)
}

export function getBlogCategoryBySlug(categorySlug: string, locale: SupportedLocale = DEFAULT_LOCALE): BlogCategory | null {
  return getBlogCategories(locale).find(item => item.slug === categorySlug) ?? null
}

export function getBlogRoutes(locale: SupportedLocale = DEFAULT_LOCALE): string[] {
  const categories = getBlogCategories(locale)
  const posts = getAllBlogPostSummaries(locale)
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`

  return [
    `${prefix}/blog`,
    ...categories.map(category => `${prefix}/blog/${category.slug}`),
    ...posts.map(post => `${prefix}/blog/${post.categoryMeta.slug}/${normalizePostSlug(post.slug)}`)
  ]
}
