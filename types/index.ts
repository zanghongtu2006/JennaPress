export type NavItem = {
  label: string
  to: string
}

export type SeoMeta = {
  title: string
  description: string
  canonical?: string
}

export type HeroBlock = {
  type: 'hero'
  kicker?: string
  title: string
  description: string
  primaryAction?: { label: string; to: string }
  secondaryAction?: { label: string; to: string }
  panelTitle?: string
  panelLines?: string[]
}

export type FeatureGridBlock = {
  type: 'feature-grid'
  title: string
  description?: string
  items: Array<{ title: string; description: string }>
}

export type RichTextBlock = {
  type: 'rich-text'
  title?: string
  html: string
}

export type CtaBannerBlock = {
  type: 'cta-banner'
  title: string
  description?: string
  action: { label: string; to: string }
}

export type StatsBlock = {
  type: 'stats'
  title: string
  description?: string
  items: Array<{ value: string; label: string; note?: string }>
}

export type ContactBlock = {
  type: 'contact'
  title: string
  description?: string
  email?: string
  phone?: string
  address?: string
}

export type Block = HeroBlock | FeatureGridBlock | RichTextBlock | CtaBannerBlock | StatsBlock

export type SiteConfig = {
  name: string
  logoText: string
  defaultTemplate: string
  defaultTheme?: string
  themes?: string[]
  tagline?: string
  nav: NavItem[]
  footerText: string
  contactEmail?: string
  socialLinks?: Array<{ label: string; to: string }>
}

export type PageContent = {
  slug: string
  title: string
  summary?: string
  seo: SeoMeta
  blocks: Block[]
}

export type PostSummary = {
  slug: string
  title: string
  summary: string
  publishedAt: string
  updatedAt?: string
  coverImage?: string
  tags?: string[]
  category?: string
  seo: SeoMeta
}

export type PostContent = PostSummary & {
  author?: {
    name: string
    avatar?: string
  }
  body: Array<RichTextBlock | CtaBannerBlock>
}

export type BlogCategoryAccent = 'case-study' | 'product-note' | 'event-promo' | 'default'

export type BlogCategory = {
  key: string
  slug: string
  label: string
  description: string
  accent: BlogCategoryAccent
  listTitle: string
}

export type BlogPostSummary = PostSummary & {
  category: string
  categoryMeta: BlogCategory
}

export type BlogPostContent = Omit<PostContent, 'category'> & {
  category: string
  categoryMeta: BlogCategory
}

export type Template = {
  id: string
  name: string
  label: string
  description?: string
  version: string
  author: string
  tags: string[]
  category: string
  downloadCount: number
  createdAt: string
  updatedAt: string
}

export type Creator = {
  username: string
  displayName: string
  avatar?: string
  bio?: string
  socialLinks?: Array<{ platform: string; url: string }>
  templateCount: number
}

export type Product = {
  slug: string
  title: string
  description: string
  seo?: SeoMeta
  coverImage: string
  previewImages: string[]
  price: number
  isFree: boolean
  downloadUrl: string
  author: string
  authorUrl: string
  category: string
  categoryMeta?: BlogCategory
  tags: string[]
  downloadCount: number
  createdAt: string
  updatedAt: string
  blocks?: Block[]
}

export type SearchCollection = 'pages' | 'blog' | 'products'

export type SearchIndexEntry = {
  id: string
  collection: SearchCollection
  locale: string
  title: string
  description: string
  url: string
  text: string
  category?: string
  categoryLabel?: string
  tags?: string[]
  publishedAt?: string
  updatedAt?: string
}

export type SearchIndexPayload = {
  locale: string
  entries: SearchIndexEntry[]
}
