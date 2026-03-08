<script setup lang="ts">
import type { BlogCategory, BlogPostSummary } from '~/types'
import TemplateFrameRenderer from '~/components/layouts/TemplateFrameRenderer.vue'
import TemplateBlogRenderer from '~/components/layouts/TemplateBlogRenderer.vue'

const route = useRoute()
const category = String(route.params.category || '')

const { data: siteData, error: siteError } = await useSite()
const site = computed(() => siteData.value)

const { data: categoriesData, error: categoriesError } = await useAsyncData<BlogCategory[]>('blog:categories', () => $fetch('/api/posts/categories'))
const { data: categoryData, error: categoryError } = await useAsyncData<{ category: BlogCategory, posts: BlogPostSummary[] }>(`blog:category:${category}`, () => $fetch(`/api/posts/category/${category}`))

if (siteError.value) throw createError({ statusCode: 500, statusMessage: siteError.value.statusMessage || 'Failed to load site config' })
if (categoriesError.value) throw createError({ statusCode: 500, statusMessage: categoriesError.value.statusMessage || 'Failed to load categories' })
if (categoryError.value) throw createError({ statusCode: categoryError.value.statusCode || 404, statusMessage: categoryError.value.statusMessage || 'Category not found' })

const categories = computed(() => categoriesData.value ?? [])
const categoryMeta = computed(() => categoryData.value?.category ?? null)
const posts = computed(() => categoryData.value?.posts ?? [])

useSeoMeta({
  title: () => `${categoryMeta.value?.label || 'Category'} Blog`,
  description: () => categoryMeta.value?.description || 'Category-specific blog module.',
  ogTitle: () => `${categoryMeta.value?.label || 'Category'} Blog`,
  ogDescription: () => categoryMeta.value?.description || 'Category-specific blog module.'
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
    />
  </TemplateFrameRenderer>
</template>
