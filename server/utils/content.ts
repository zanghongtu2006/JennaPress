import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import { validatePageContent, validatePostContent, validateSiteConfig } from '~/lib/schema'
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
} from '~/types'

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
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
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

function inferCategoryAccent(slug: string): BlogCategoryAccent {
  if (slug === 'cases') return 'case-study'
  if (slug === 'products') return 'product-note'
  if (slug === 'events') return 'event-promo'
  return 'default'
}

function inferCategoryDescription(label: string, slug: string): string {
  if (slug === 'cases') return 'Proof-heavy stories that show how a company delivered outcomes for specific clients or segments.'
  if (slug === 'products') return 'Product-oriented posts that explain capabilities, packaging, and market positioning.'
  if (slug === 'events') return 'Campaign, webinar, and conference updates that benefit from a higher-energy presentation style.'
  return `${label} posts grouped under one first-level CMS category.`
}

function inferCategoryListTitle(label: string, slug: string): string {
  if (slug === 'cases') return 'Customer stories and implementation snapshots'
  if (slug === 'products') return 'Feature launches and product explainers'
  if (slug === 'events') return 'Upcoming activities and field updates'
  return `${label} articles`
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

function buildCategoryMeta(categoryValue: string): BlogCategory {
  const label = toCategoryLabel(categoryValue)
  const slug = slugifyCategory(categoryValue || 'general')
  return {
    key: categoryValue || 'General',
    slug,
    label,
    description: inferCategoryDescription(label, slug),
    accent: inferCategoryAccent(slug),
    listTitle: inferCategoryListTitle(label, slug)
  }
}

function toBlogPost(post: PostContent): BlogPostContent {
  const categoryValue = typeof post.category === 'string' && post.category.trim() ? post.category.trim() : 'General'
  const categoryMeta = buildCategoryMeta(categoryValue)
  return {
    ...post,
    category: categoryValue,
    categoryMeta
  }
}

export function getSiteConfig(): SiteConfig {
  const mdFile = path.resolve(process.cwd(), 'content/site.md')

  if (!fs.existsSync(mdFile)) {
    throw new Error('Site config file not found: expected content/site.md')
  }

  const parsed = readMarkdownFile(mdFile)
  return validateSiteConfig(parsed.data || {})
}

export function getAllPages(): PageContent[] {
  const dir = path.resolve(process.cwd(), 'content/pages')
  const files = getCollectionFiles(dir)

  return files
    .map((file) => readPageFile(path.join(dir, file)))
    .sort((a, b) => a.slug.localeCompare(b.slug))
}

export function getPageBySlug(slug: string): PageContent | null {
  const normalized = normalizePageSlug(slug)
  return getAllPages().find((page) => page.slug === normalized) ?? null
}

export function getAllPosts(): PostContent[] {
  const dir = path.resolve(process.cwd(), 'content/posts')
  const files = getCollectionFiles(dir)

  return files
    .map((file) => readPostFile(path.join(dir, file)))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getAllPostSummaries(): PostSummary[] {
  return getAllPosts().map(({ body, author, ...summary }) => summary)
}

export function getPostBySlug(slug: string): PostContent | null {
  const normalized = normalizePostSlug(slug)
  return getAllPosts().find((post) => normalizePostSlug(post.slug) === normalized) ?? null
}

export function getBlogCategories(): BlogCategory[] {
  const categories = new Map<string, BlogCategory>()
  for (const post of getAllPosts()) {
    const categoryValue = typeof post.category === 'string' && post.category.trim() ? post.category.trim() : 'General'
    const meta = buildCategoryMeta(categoryValue)
    categories.set(meta.slug, meta)
  }
  return Array.from(categories.values()).sort((a, b) => a.label.localeCompare(b.label))
}

export function getAllBlogPostSummaries(): BlogPostSummary[] {
  return getAllPosts().map(toBlogPost).map(({ body, author, ...summary }) => summary)
}

export function getBlogPostByCategoryAndSlug(categorySlug: string, slug: string): BlogPostContent | null {
  const normalizedSlug = normalizePostSlug(slug)
  return getAllPosts()
    .map(toBlogPost)
    .find(post => post.categoryMeta.slug === categorySlug && normalizePostSlug(post.slug) === normalizedSlug) ?? null
}

export function getBlogPostsByCategory(categorySlug: string): BlogPostSummary[] {
  const category = getBlogCategoryBySlug(categorySlug)
  if (!category) throw new Error(`Unsupported blog category: ${categorySlug}`)
  return getAllBlogPostSummaries().filter(post => post.categoryMeta.slug === categorySlug)
}

export function getBlogCategoryBySlug(categorySlug: string): BlogCategory | null {
  return getBlogCategories().find(item => item.slug === categorySlug) ?? null
}

export function getBlogRoutes(): string[] {
  const categories = getBlogCategories()
  const posts = getAllBlogPostSummaries()
  const categoryRoutes = categories.map(category => `/blog/${category.slug}`)
  const postRoutes = posts.map(post => `/blog/${post.categoryMeta.slug}/${post.slug}`)

  return ['/blog', ...categoryRoutes, ...postRoutes]
}
