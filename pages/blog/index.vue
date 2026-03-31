<script setup lang="ts">
import type { BlogCategory, BlogPostSummary } from '~/types'
import { DEFAULT_LOCALE, isSecondaryLocale } from '~/lib/i18n'
import { getStaticBlogCategories, getStaticBlogPosts } from '~/lib/static-content'
import TemplateFrameRenderer from '~/components/layouts/TemplateFrameRenderer.vue'
import TemplateBlogRenderer from '~/components/layouts/TemplateBlogRenderer.vue'

const route = useRoute()
const locale = computed(() => {
  const value = Array.isArray(route.params.locale) ? route.params.locale[0] : route.params.locale
  return typeof value === 'string' && isSecondaryLocale(value) ? value : DEFAULT_LOCALE
})
const { data: siteData, error: siteError } = await useSite(locale)
const site = computed(() => siteData.value)

const categoriesKey = computed(() => `blog:${locale.value}:categories`)
const postsKey = computed(() => `blog:${locale.value}:posts`)

const { data: categoriesData, error: categoriesError } = await useAsyncData<BlogCategory[]>(
  categoriesKey,
  () => Promise.resolve(getStaticBlogCategories(locale.value)),
  { watch: [locale] },
)
const { data: postsData, error: postsError } = await useAsyncData<BlogPostSummary[]>(
  postsKey,
  () => Promise.resolve(getStaticBlogPosts(locale.value)),
  { watch: [locale] },
)

if (siteError.value) throw createError({ statusCode: 500, statusMessage: siteError.value.statusMessage || 'Failed to load site config' })
if (categoriesError.value) throw createError({ statusCode: 500, statusMessage: categoriesError.value.statusMessage || 'Failed to load categories' })
if (postsError.value) throw createError({ statusCode: 500, statusMessage: postsError.value.statusMessage || 'Failed to load posts' })

const categories = computed(() => categoriesData.value ?? [])
const posts = computed(() => postsData.value ?? [])
const sections = computed(() => categories.value.map(category => ({
  category,
  posts: posts.value.filter(post => post.categoryMeta.slug === category.slug),
})).filter(section => section.posts.length > 0))

useSeoMeta({
  title: () => `${site.value?.name || 'Site'} Blog`,
  description: 'A category-first blog driven by template-level rendering and markdown content.',
  ogTitle: () => `${site.value?.name || 'Site'} Blog`,
  ogDescription: 'A category-first blog driven by template-level rendering and markdown content.',
})
</script>

<template>
  <TemplateFrameRenderer v-if="site" :template="site.defaultTemplate" :site="site">
    <TemplateBlogRenderer
      :template="site.defaultTemplate"
      :site="site"
      mode="home"
      :categories="categories"
      :sections="sections"
      :posts="posts"
      :locale="locale"
      :defaultLocale="DEFAULT_LOCALE"
    />
  </TemplateFrameRenderer>
</template>
