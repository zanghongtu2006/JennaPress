import { defineNuxtConfig } from 'nuxt/config'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { SECONDARY_LOCALES } from './lib/i18n'

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

function readApiRoutes() {
  const routes = new Set<string>(['/api/pages', '/api/posts', '/api/posts/categories'])
  const pagesDir = path.resolve(process.cwd(), 'content/pages')
  const postsDir = path.resolve(process.cwd(), 'content/posts')

  const defaultPageRoutes = readPageRoutesForDir(pagesDir)
  for (const route of defaultPageRoutes) {
    const normalized = route === '/' ? '' : route.replace(/^\//, '')
    if (normalized) {
      routes.add(`/api/pages/${normalized}`)
    }
  }

  const defaultPostEntries = readPostEntriesForDir(postsDir)
  for (const entry of defaultPostEntries) {
    routes.add(`/api/posts/category/${entry.category}`)
    routes.add(`/api/posts/${entry.category}/${entry.slug}`)
  }

  for (const locale of SECONDARY_LOCALES) {
    routes.add(`/api/site/${locale}`)
    routes.add(`/api/pages/${locale}`)
    routes.add(`/api/posts/${locale}`)
    routes.add(`/api/posts/${locale}/categories`)

    const localizedPageRoutes = new Set(readPageRoutesForDir(path.join(pagesDir, locale)))
    for (const route of defaultPageRoutes) {
      const normalized = route === '/' ? '' : route.replace(/^\//, '')
      if (normalized) {
        routes.add(`/api/pages/${locale}/${normalized}`)
      }
    }
    for (const route of localizedPageRoutes) {
      const normalized = route === '/' ? '' : route.replace(/^\//, '')
      if (normalized) {
        routes.add(`/api/pages/${locale}/${normalized}`)
      }
    }

    const mergedPosts = new Map<string, { slug: string, category: string }>()
    for (const entry of defaultPostEntries) {
      mergedPosts.set(entry.slug, entry)
    }
    for (const entry of readPostEntriesForDir(path.join(postsDir, locale))) {
      mergedPosts.set(entry.slug, entry)
    }
    for (const entry of mergedPosts.values()) {
      routes.add(`/api/posts/${locale}/category/${entry.category}`)
      routes.add(`/api/posts/${locale}/${entry.category}/${entry.slug}`)
    }
  }

  return Array.from(routes)
}

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  css: ['~/assets/main.css'],
  hooks: {
    'pages:extend'(pages) {
      const root = process.cwd()
      const localizedRoutes = [
        {
          name: 'locale-blog-post',
          path: '/:locale(de|zh)/blog/:category/:slug',
          file: path.resolve(root, 'pages/blog/[category]/[slug].vue')
        },
        {
          name: 'locale-blog-category',
          path: '/:locale(de|zh)/blog/:category',
          file: path.resolve(root, 'pages/blog/[category]/index.vue')
        },
        {
          name: 'locale-blog',
          path: '/:locale(de|zh)/blog',
          file: path.resolve(root, 'pages/blog/index.vue')
        },
        {
          name: 'locale-page',
          path: '/:locale(de|zh)/:slug(.*)',
          file: path.resolve(root, 'pages/[...slug].vue')
        },
        {
          name: 'locale-home',
          path: '/:locale(de|zh)',
          file: path.resolve(root, 'pages/index.vue')
        }
      ]

      pages.unshift(...localizedRoutes)
    }
  },
  app: {
    baseURL: '/JennaPress/',
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
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
    var secondaryLocales = ['de', 'zh']
    var baseURL = '/JennaPress/'

    var applyTheme = function (value) {
      if (!value) return
      window.__SITE_THEME__ = value
      document.documentElement.dataset.theme = value

      var syncFrame = function () {
        var frame = document.querySelector('.template-saas-frame')
        if (frame) frame.setAttribute('data-theme', value)
      }

      syncFrame()
      document.addEventListener('DOMContentLoaded', syncFrame, { once: true })
      requestAnimationFrame(syncFrame)
    }

    var savedTheme = localStorage.getItem(themeKey)
    if (savedTheme) applyTheme(savedTheme)

    var savedLanguage = localStorage.getItem(languageKey)
    if (!savedLanguage) return

    var path = window.location.pathname
    var normalizedBaseURL = baseURL.endsWith('/') ? baseURL : baseURL + '/'
    var normalizedBaseRoot = normalizedBaseURL.replace(/\/$/, '')
    if (!(path === normalizedBaseRoot || path.startsWith(normalizedBaseURL))) return

    var slicedPath = path === normalizedBaseRoot ? '' : path.slice(normalizedBaseURL.length)
    var relativePath = '/' + slicedPath.replace(/^\/+/, '')
    if (relativePath === '//') relativePath = '/'

    var parts = relativePath.split('/').filter(Boolean)
    var currentLocale = secondaryLocales.indexOf(parts[0]) !== -1 ? parts[0] : defaultLocale

    if (currentLocale !== defaultLocale) return
    if (savedLanguage === defaultLocale) return
    if (secondaryLocales.indexOf(savedLanguage) === -1) return

    var targetPath = relativePath === '/' ? '/' + savedLanguage : '/' + savedLanguage + relativePath
    var targetHref = baseURL.replace(/\/$/, '') + targetPath + window.location.search + window.location.hash

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
    prerender: {
      autoSubfolderIndex: true,
      routes: [...readPageRoutes(), ...readBlogRoutes(), ...readApiRoutes()]
    }
  },
  runtimeConfig: {
    public: {
      siteBaseUrl: 'https://example.com'
    }
  },
  typescript: {
    strict: true,
    typeCheck: false
  }
})
