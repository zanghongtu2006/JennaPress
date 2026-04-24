<script setup lang="ts">
import type { BlogCategory, BlogPostSummary } from '~/types'
import { fetchBlogCategories, fetchBlogCategoryContent } from '~/composables/useContentData'
import { DEFAULT_LOCALE, isSecondaryLocale } from '~/lib/i18n'
import TemplateFrameRenderer from '~/components/layouts/TemplateFrameRenderer.vue'
import TemplateBlogRenderer from '~/components/layouts/TemplateBlogRenderer.vue'

const route = useRoute()
const category = computed(() => String(route.params.category || ''))
const locale = computed(() => {
  const value = Array.isArray(route.params.locale) ? route.params.locale[0] : route.params.locale
  return typeof value === 'string' && isSecondaryLocale(value) ? value : DEFAULT_LOCALE
})

const { data: siteData, error: siteError } = await useSite(locale)
const site = computed(() => siteData.value)

const categoriesKey = computed(() => `blog:${locale.value}:categories`)
const categoryKey = computed(() => `blog:${locale.value}:category:${category.value}`)

const { data: categoriesData, error: categoriesError } = await useAsyncData<BlogCategory[]>(
  categoriesKey,
  () => fetchBlogCategories(locale.value),
  { watch: [locale] },
)
const { data: categoryData, error: categoryError } = await useAsyncData<{ category: BlogCategory, posts: BlogPostSummary[] } | null>(
  categoryKey,
  () => fetchBlogCategoryContent(category.value, locale.value),
  { watch: [locale, category] },
)

if (siteError.value) throw createError({ statusCode: 500, statusMessage: siteError.value.statusMessage || 'Failed to load site config' })
if (categoriesError.value) throw createError({ statusCode: 500, statusMessage: categoriesError.value.statusMessage || 'Failed to load categories' })
if (categoryError.value || !categoryData.value) throw createError({ statusCode: 404, statusMessage: 'Category not found' })

const categories = computed(() => categoriesData.value ?? [])
const categoryMeta = computed(() => categoryData.value?.category ?? null)
const posts = computed(() => categoryData.value?.posts ?? [])

useSeoMeta({
  title: () => `${categoryMeta.value?.label || 'Category'} Blog`,
  description: () => categoryMeta.value?.description || 'Category-specific blog module.',
  ogTitle: () => `${categoryMeta.value?.label || 'Category'} Blog`,
  ogDescription: () => categoryMeta.value?.description || 'Category-specific blog module.',
})
</script>

<template>
  <TemplateFrameRenderer v-if="site && categoryMeta" :template="site.defaultTemplate" :site="site">
    <TemplateBlogRenderer
      :template="site.defaultTemplate"
      :site="site"
      mode="category"
      :categories="categories"
      :category="categoryMeta"
      :posts="posts"
      :locale="locale"
      :defaultLocale="DEFAULT_LOCALE"
    />
  </TemplateFrameRenderer>
</template>
