<script setup lang="ts">
import type { BlogCategory, BlogPostSummary } from '~/types'
import TemplateFrameRenderer from '~/components/layouts/TemplateFrameRenderer.vue'
import TemplateBlogRenderer from '~/components/layouts/TemplateBlogRenderer.vue'

const { data: siteData, error: siteError } = await useSite()
const site = computed(() => siteData.value)

const { data: categoriesData, error: categoriesError } = await useAsyncData<BlogCategory[]>('blog:categories', () => $fetch('/api/posts/categories'))
const { data: postsData, error: postsError } = await useAsyncData<BlogPostSummary[]>('blog:posts', () => $fetch('/api/posts'))

if (siteError.value) throw createError({ statusCode: 500, statusMessage: siteError.value.statusMessage || 'Failed to load site config' })
if (categoriesError.value) throw createError({ statusCode: 500, statusMessage: categoriesError.value.statusMessage || 'Failed to load categories' })
if (postsError.value) throw createError({ statusCode: 500, statusMessage: postsError.value.statusMessage || 'Failed to load posts' })

const categories = computed(() => categoriesData.value ?? [])
const posts = computed(() => postsData.value ?? [])
const sections = computed(() => categories.value.map(category => ({
  category,
  posts: posts.value.filter(post => post.categoryMeta.slug === category.slug)
})).filter(section => section.posts.length > 0))

useSeoMeta({
  title: `${site.value?.name || 'Site'} Blog`,
  description: 'A category-first blog driven by template-level rendering and markdown content.',
  ogTitle: `${site.value?.name || 'Site'} Blog`,
  ogDescription: 'A category-first blog driven by template-level rendering and markdown content.'
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
    />
  </TemplateFrameRenderer>
</template>
