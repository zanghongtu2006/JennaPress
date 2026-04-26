import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const rootDir = process.cwd()
const contentProductsDir = path.join(rootDir, 'content', 'products')
const publicDir = path.join(rootDir, 'public')
const l18nPath = path.join(rootDir, 'content', 'l18n.ts')
const INDEX_VERSION = '1.0.0'

function readLocales() {
  if (!fs.existsSync(l18nPath)) return [{ code: 'en', isDefault: true }]
  const raw = fs.readFileSync(l18nPath, 'utf-8')
  const objectMatches = raw.match(/\{[^{}]*code\s*:\s*['"][^'"]+['"][^{}]*\}/g) || []
  const locales = []
  const seen = new Set()

  for (const item of objectMatches) {
    const code = item.match(/code\s*:\s*['"]([^'"]+)['"]/)?.[1]?.trim()
    if (!code || seen.has(code)) continue
    seen.add(code)
    locales.push({ code, isDefault: /isDefault\s*:\s*true/.test(item) })
  }

  if (!locales.length) return [{ code: 'en', isDefault: true }]
  if (!locales.some(locale => locale.isDefault)) locales[0].isDefault = true
  return locales
}

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return []
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolutePath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(absolutePath))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(absolutePath)
    }
  }
  return files
}

function slugify(input) {
  const normalized = String(input || '').normalize('NFKC').trim().toLowerCase()
  return normalized.replace(/[^\p{Letter}\p{Number}]+/gu, '-').replace(/^-+|-+$/g, '') || 'general'
}

function labelFromSlug(input) {
  return String(input || '')
    .replace(/[-_]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'General'
}

function asString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function asStringArray(value) {
  return Array.isArray(value) ? value.filter(item => typeof item === 'string').map(item => item.trim()).filter(Boolean) : []
}

function asNumber(value, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function asBoolean(value, fallback = false) {
  return typeof value === 'boolean' ? value : fallback
}

function normalizeDate(value) {
  const text = asString(value)
  return text || ''
}
function parseFrontMatter(raw) {
  if (!raw.startsWith('---')) return {}
  const end = raw.indexOf('\n---', 3)
  if (end === -1) return {}

  const yaml = raw.slice(3, end).replace(/^\r?\n/, '')
  const data = {}
  let currentArrayKey = ''

  for (const rawLine of yaml.split(/\r?\n/)) {
    const line = rawLine.replace(/\s+$/, '')
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    if (currentArrayKey && /^-\s+/.test(trimmed)) {
      data[currentArrayKey].push(parseScalar(trimmed.replace(/^-\s+/, '')))
      continue
    }

    currentArrayKey = ''
    const match = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/)
    if (!match) continue

    const key = match[1]
    const value = match[2] ?? ''
    if (!value.trim()) {
      data[key] = []
      currentArrayKey = key
      continue
    }

    data[key] = parseScalar(value.trim())
  }

  return data
}

function parseScalar(value) {
  const trimmed = value.trim()
  const quoted = trimmed.match(/^['"](.*)['"]$/)
  if (quoted) return quoted[1]
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed)
  return trimmed
}

function prefixPathForLocale(pathname, locale, defaultLocale) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  return locale === defaultLocale ? normalizedPath : `/${locale}${normalizedPath === '/' ? '' : normalizedPath}`
}

function localeFromProductPath(filePath, supportedLocales, defaultLocale) {
  const relativePath = path.relative(contentProductsDir, filePath).replace(/\\/g, '/')
  const firstSegment = relativePath.split('/').filter(Boolean)[0]?.toLowerCase()
  return firstSegment && supportedLocales.has(firstSegment) ? firstSegment : defaultLocale
}

function readProductEntry(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const data = parseFrontMatter(raw)
  const slug = asString(data.slug) || slugify(path.basename(filePath, '.md'))
  const rawCategory = asString(data.category) || 'General'
  const category = asString(data.categorySlug) ? slugify(data.categorySlug) : slugify(rawCategory)
  const previewImages = asStringArray(data.previewImages)
  const previewImage = asString(data.previewImage) || asString(data.coverImage) || previewImages[0] || ''
  const title = asString(data.title) || labelFromSlug(slug)

  return {
    name: title,
    title,
    slug,
    category,
    categoryLabel: asString(data.categoryLabel) || labelFromSlug(rawCategory || category),
    categoryDescription: asString(data.categoryDescription),
    tags: asStringArray(data.tags),
    price: asNumber(data.price, 0),
    isFree: asBoolean(data.isFree, asNumber(data.price, 0) === 0),
    previewImage,
    coverImage: asString(data.coverImage) || previewImage,
    previewImages,
    previewUrl: asString(data.previewUrl),
    downloadUrl: asString(data.downloadUrl),
    description: asString(data.description),
    author: asString(data.author),
    authorUrl: asString(data.authorUrl),
    authorAvatar: asString(data.authorAvatar),
    downloadCount: asNumber(data.downloadCount, 0),
    rating: asNumber(data.rating, 0),
    reviews: asNumber(data.reviews, 0),
    featured: asBoolean(data.featured, false),
    createdAt: normalizeDate(data.createdAt),
    updatedAt: normalizeDate(data.updatedAt),
  }
}
function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(item => stableStringify(item)).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

function hashPayload(payload) {
  return crypto.createHash('sha256').update(stableStringify(payload)).digest('hex').slice(0, 12)
}

function maxUpdatedAt(items) {
  const values = items.map(item => item.updatedAt || item.createdAt).filter(Boolean).sort()
  return values[values.length - 1] || '1970-01-01'
}

function buildCategorySummaries(items) {
  const categories = new Map()
  for (const item of items) {
    const existing = categories.get(item.category)
    if (existing) {
      existing.count += 1
      if (!existing.description && item.categoryDescription) existing.description = item.categoryDescription
      continue
    }
    categories.set(item.category, {
      id: item.category,
      label: item.categoryLabel,
      description: item.categoryDescription,
      count: 1,
    })
  }
  return Array.from(categories.values()).sort((a, b) => a.label.localeCompare(b.label))
}

function removeOldGeneratedIndexes() {
  if (!fs.existsSync(publicDir)) return
  for (const entry of fs.readdirSync(publicDir, { withFileTypes: true })) {
    if (entry.isFile() && /^template-index\.[a-z0-9-]+\.[a-f0-9]{12}\.json$/i.test(entry.name)) {
      fs.rmSync(path.join(publicDir, entry.name))
    }
  }
}

function main() {
  const locales = readLocales()
  const defaultLocale = locales.find(locale => locale.isDefault)?.code || locales[0].code
  const supportedLocales = new Set(locales.map(locale => locale.code))
  const productsByLocale = new Map(locales.map(locale => [locale.code, new Map()]))

  for (const filePath of listMarkdownFiles(contentProductsDir)) {
    const locale = localeFromProductPath(filePath, supportedLocales, defaultLocale)
    const product = readProductEntry(filePath)
    productsByLocale.get(locale)?.set(product.slug, product)
  }

  fs.mkdirSync(publicDir, { recursive: true })
  removeOldGeneratedIndexes()

  const manifest = { version: INDEX_VERSION, defaultLocale, locales: {} }
  const defaultProducts = productsByLocale.get(defaultLocale) || new Map()

  for (const locale of locales.map(item => item.code)) {
    const merged = new Map(defaultProducts)
    if (locale !== defaultLocale) {
      for (const [slug, product] of productsByLocale.get(locale)?.entries() || []) {
        const fallback = merged.get(slug) || {}
        merged.set(slug, { ...fallback, ...product })
      }
    }

    const items = Array.from(merged.values())
      .map(item => ({
        ...item,
        url: prefixPathForLocale(`/products/${item.category}/${item.slug}`, locale, defaultLocale),
      }))
      .sort((a, b) => {
        const featured = Number(Boolean(b.featured)) - Number(Boolean(a.featured))
        if (featured !== 0) return featured
        const updated = String(b.updatedAt || b.createdAt).localeCompare(String(a.updatedAt || a.createdAt))
        if (updated !== 0) return updated
        return a.title.localeCompare(b.title)
      })

    const updatedAt = maxUpdatedAt(items)
    const payload = {
      version: INDEX_VERSION,
      locale,
      updatedAt,
      count: items.length,
      categories: buildCategorySummaries(items),
      items,
    }
    const hash = hashPayload(payload)
    const indexFileName = `template-index.${locale}.${hash}.json`
    fs.writeFileSync(path.join(publicDir, indexFileName), `${JSON.stringify(payload, null, 2)}\n`, 'utf-8')
    manifest.locales[locale] = {
      index: `/${indexFileName}`,
      hash,
      updatedAt,
      count: items.length,
    }
  }

  fs.writeFileSync(path.join(publicDir, 'template-index.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8')
  console.log(`Generated template index for ${locales.length} locale(s) in public/template-index.json`)
}

main()
process.exit(0)
