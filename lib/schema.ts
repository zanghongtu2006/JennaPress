import type { Block, PageContent, PostContent, SiteConfig } from '~/types'

function ensureString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid field: ${field}`)
  }
  return value
}

function ensureText(value: unknown, field: string): string {
  if (typeof value !== 'string') {
    throw new Error(`Invalid field: ${field}`)
  }
  return value
}

function ensureArray(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid field: ${field}`)
  }
  return value
}

function ensureOptionalString(value: unknown, field: string) {
  if (value !== undefined && typeof value !== 'string') {
    throw new Error(`Invalid field: ${field}`)
  }
}

function ensureOptionalStringArray(value: unknown, field: string) {
  if (value !== undefined) {
    const list = ensureArray(value, field)
    list.forEach((item, index) => ensureString(item, `${field}[${index}]`))
  }
}

function ensureFieldAbsent(value: unknown, field: string) {
  if (value !== undefined) {
    throw new Error(`Field is not allowed: ${field}`)
  }
}

function validateGenericBlock(block: any, index: number): Block {
  ensureString(block?.type, `blocks[${index}].type`)

  switch (block.type) {
    case 'hero':
      ensureText(block.title, `blocks[${index}].title`)
      ensureText(block.description, `blocks[${index}].description`)
      return block as Block
    case 'feature-grid':
      ensureString(block.title, `blocks[${index}].title`)
      ensureArray(block.items, `blocks[${index}].items`)
      return block as Block
    case 'rich-text':
      ensureText(block.html, `blocks[${index}].html`)
      return block as Block
    case 'cta-banner':
      ensureText(block.title, `blocks[${index}].title`)
      ensureText(block.action?.label, `blocks[${index}].action.label`)
      ensureText(block.action?.to, `blocks[${index}].action.to`)
      return block as Block
    case 'stats':
      ensureString(block.title, `blocks[${index}].title`)
      ensureArray(block.items, `blocks[${index}].items`)
      return block as Block
    case 'contact':
      ensureText(block.title, `blocks[${index}].title`)
      return block as Block
    default:
      throw new Error(`Unsupported block type: ${block.type}`)
  }
}

function validatePostBodyBlock(block: any, index: number) {
  ensureString(block?.type, `body[${index}].type`)

  switch (block.type) {
    case 'rich-text':
      ensureString(block.html, `body[${index}].html`)
      return
    case 'cta-banner':
      ensureString(block.title, `body[${index}].title`)
      ensureString(block.action?.label, `body[${index}].action.label`)
      ensureString(block.action?.to, `body[${index}].action.to`)
      return
    default:
      throw new Error(`Unsupported post body block type: ${block.type}`)
  }
}

export function validateSiteConfig(input: any): SiteConfig {
  ensureString(input?.name, 'site.name')
  ensureString(input?.logoText, 'site.logoText')
  ensureString(input?.defaultTemplate, 'site.defaultTemplate')
  ensureOptionalString(input?.defaultTheme, 'site.defaultTheme')
  ensureOptionalStringArray(input?.themes, 'site.themes')
  ensureArray(input?.nav, 'site.nav')
  return input as SiteConfig
}

export function validatePageContent(input: any): PageContent {
  ensureFieldAbsent(input?.template, 'page.template')
  ensureString(input?.slug, 'page.slug')
  ensureText(input?.title, 'page.title')
  ensureText(input?.seo?.title, 'page.seo.title')
  ensureText(input?.seo?.description, 'page.seo.description')
  ensureArray(input?.blocks, 'page.blocks').forEach((block, index) => validateGenericBlock(block, index))
  return input as PageContent
}

export function validatePostContent(input: any): PostContent {
  ensureString(input?.slug, 'post.slug')
  ensureString(input?.title, 'post.title')
  ensureString(input?.summary, 'post.summary')
  ensureString(input?.publishedAt, 'post.publishedAt')
  ensureString(input?.seo?.title, 'post.seo.title')
  ensureString(input?.seo?.description, 'post.seo.description')
  ensureArray(input?.body, 'post.body').forEach((block, index) => validatePostBodyBlock(block, index))
  return input as PostContent
}
