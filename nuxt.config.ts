import { defineNuxtConfig } from 'nuxt/config'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { locales } from './content/l18n'

function normalizeLocales() {
  const seen = new Set<string>()
  const normalized: Array<{ code: string, label: string, isDefault?: boolean }> = []

  for (const item of locales) {
    const code = typeof item?.code === 'string' ? item.code.trim() : ''
    const label = typeof item?.label === 'string' ? item.label.trim() : ''

    if (!code || !label || seen.has(code)) {
      continue
    }

    seen.add(code)
    normalized.push({ code, label, ...(item?.isDefault ? { isDefault: true } : {}) })
  }

  if (!normalized.length) {
    throw new Error('content/l18n.ts must export at least one locale')
  }

  if (normalized.some((item) => item.isDefault)) {
    return normalized
  }

  const [first, ...rest] = normalized
  return [{ ...first, isDefault: true }, ...rest]
}

const LOCALES = normalizeLocales()
const DEFAULT_LOCALE = LOCALES.find((item) => item.isDefault)?.code || LOCALES[0]!.code

function readFrontMatter(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf-8')
  return matter(raw).data || {}
}

function slugifyCategory(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function listMarkdownFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    return []
  }
  return fs.readdirSync(dir).filter((file) => file.endsWith('.md'))
}

const SUPPORTED_LOCALES = LOCALES.map((item) => item.code)
const SECONDARY_LOCALES = SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE)
const localePattern = SECONDARY_LOCALES.length ? SECONDARY_LOCALES.map((locale) => locale.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') : '__no_locale__'

function readPageRoutesForDir(dir: string) {
  const files = listMarkdownFiles(dir)
  return files
    .map((file) => {
      const data = readFrontMatter(path.join(dir, file))
      const slug = data?.slug ? String(data.slug) : ''
      return slug === '/' ? '/' : `/${slug.replace(/^\//, '')}`
    })
    .filter(Boolean)
}

function readPageRoutes() {
  const pagesDir = path.resolve(process.cwd(), 'content/pages')
  const defaultRoutes = readPageRoutesForDir(pagesDir)
  const routes = new Set<string>(defaultRoutes.length ? defaultRoutes : ['/'])

  for (const locale of SECONDARY_LOCALES) {
    const localizedDir = path.join(pagesDir, locale)
    const localizedRoutes = new Set(readPageRoutesForDir(localizedDir))

    for (const route of defaultRoutes) {
      routes.add(route === '/' ? `/${locale}` : `/${locale}${route}`)
    }

    for (const route of localizedRoutes) {
      routes.add(route === '/' ? `/${locale}` : `/${locale}${route}`)
    }
  }

  return Array.from(routes)
}

function readPostEntriesForDir(dir: string) {
  const files = listMarkdownFiles(dir)
  return files
    .map((file) => {
      const data = readFrontMatter(path.join(dir, file))
      const slug = data?.slug ? String(data.slug).replace(/^\//, '') : ''
      const category = data?.category ? slugifyCategory(String(data.category)) : 'general'
      if (!slug) return null
      return { slug, category }
    })
    .filter(Boolean) as Array<{ slug: string, category: string }>
}

function readBlogRoutes() {
  const postsDir = path.resolve(process.cwd(), 'content/posts')
  const defaultEntries = readPostEntriesForDir(postsDir)
  const routes = new Set<string>(['/blog'])

  for (const entry of defaultEntries) {
    routes.add(`/blog/${entry.category}`)
    routes.add(`/blog/${entry.category}/${entry.slug}`)
  }

  for (const locale of SECONDARY_LOCALES) {
    const localizedDir = path.join(postsDir, locale)
    const merged = new Map<string, { slug: string, category: string }>()

    for (const entry of defaultEntries) {
      merged.set(entry.slug, entry)
    }

    for (const entry of readPostEntriesForDir(localizedDir)) {
      merged.set(entry.slug, entry)
    }

    routes.add(`/${locale}/blog`)
    for (const entry of merged.values()) {
      routes.add(`/${locale}/blog/${entry.category}`)
      routes.add(`/${locale}/blog/${entry.category}/${entry.slug}`)
    }
  }

  return Array.from(routes)
}

function readDefaultTheme() {
  const sitePath = path.resolve(process.cwd(), 'content/site.md')
  if (!fs.existsSync(sitePath)) {
    return 'light'
  }

  const data = readFrontMatter(sitePath)
  const value = typeof data?.defaultTheme === 'string' ? data.defaultTheme.trim() : ''
  return value || 'light'
}

const defaultTheme = readDefaultTheme()

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  css: ['~/assets/main.css'],
  modules: ['@nuxtjs/sitemap'],
  site: {
    url: 'https://www.jennapress.com',
    trailingSlash: true,
  },
  sitemap: {
    hostname: 'https://www.jennapress.com',
  },

  hooks: {
    'pages:extend'(pages) {
      const root = process.cwd()
      const localizedRoutes = [
        {
          name: 'locale-blog-post',
          path: `/:locale(${localePattern})/blog/:category/:slug`,
          file: path.resolve(root, 'pages/blog/[category]/[slug].vue')
        },
        {
          name: 'locale-blog-category',
          path: `/:locale(${localePattern})/blog/:category`,
          file: path.resolve(root, 'pages/blog/[category]/index.vue')
        },
        {
          name: 'locale-blog',
          path: `/:locale(${localePattern})/blog`,
          file: path.resolve(root, 'pages/blog/index.vue')
        },
        {
          name: 'locale-page',
          path: `/:locale(${localePattern})/:slug(.*)`,
          file: path.resolve(root, 'pages/[...slug].vue')
        },
        {
          name: 'locale-home',
          path: `/:locale(${localePattern})`,
          file: path.resolve(root, 'pages/index.vue')
        }
      ]

      if (SECONDARY_LOCALES.length) {
        pages.unshift(...localizedRoutes)
      }
    }
  },
  app: {
    baseURL: '/',
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      style: [
        {
          innerHTML: `html:not([data-theme]) body { visibility: hidden; }`
        }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: 'favicon.svg' }
      ],
      script: [
        {
          innerHTML: `(function () {
  try {
    var themeKey = 'site-theme'
    var languageKey = 'site-language'
    var defaultLocale = 'en'
    var secondaryLocales = ${JSON.stringify(SECONDARY_LOCALES)}
    var baseURL = '/JennaPress/'
    var defaultTheme = '${defaultTheme}'

    var applyTheme = function (value) {
      if (!value) return
      window.__SITE_THEME__ = value
      document.documentElement.dataset.theme = value
    }

    var savedTheme = localStorage.getItem(themeKey)
    applyTheme(savedTheme || defaultTheme)

    var savedLanguage = localStorage.getItem(languageKey)
    if (!savedLanguage) return

    var path = window.location.pathname
    var normalizedBaseURL = baseURL.endsWith('/') ? baseURL : baseURL + '/'
    var normalizedBaseRoot = normalizedBaseURL.slice(-1) === '/' ? normalizedBaseURL.slice(0, -1) : normalizedBaseURL
    if (!(path === normalizedBaseRoot || path.startsWith(normalizedBaseURL))) return

    var slicedPath = path === normalizedBaseRoot ? '' : path.slice(normalizedBaseURL.length)
    while (slicedPath.charAt(0) === '/') slicedPath = slicedPath.slice(1)
    var relativePath = '/' + slicedPath
    if (relativePath === '//') relativePath = '/'

    var parts = relativePath.split('/').filter(Boolean)
    var currentLocale = secondaryLocales.indexOf(parts[0]) !== -1 ? parts[0] : defaultLocale

    if (currentLocale !== defaultLocale) return
    if (savedLanguage === defaultLocale) return
    if (secondaryLocales.indexOf(savedLanguage) === -1) return

    var targetPath = relativePath === '/' ? '/' + savedLanguage : '/' + savedLanguage + relativePath
    var targetHrefBase = baseURL.slice(-1) === '/' ? baseURL.slice(0, -1) : baseURL
    var targetHref = targetHrefBase + targetPath + window.location.search + window.location.hash

    if (targetHref !== window.location.pathname + window.location.search + window.location.hash) {
      window.location.replace(targetHref)
    }
  } catch (e) {}
})()`,
          tagPosition: 'head'
        }
      ]
    }
  },
  ssr: true,
  nitro: {
    preset: 'static',
    prerender: {
      autoSubfolderIndex: true,
      routes: [...readPageRoutes(), ...readBlogRoutes()]
    }
  },
  runtimeConfig: {
    public: {
      siteBaseUrl: 'https://www.jennapress.com/',
      supportedLocales: SUPPORTED_LOCALES
    }
  },
  typescript: {
    strict: true,
    typeCheck: false
  }
})
