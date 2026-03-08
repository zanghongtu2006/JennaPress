<script setup lang="ts">
import type { BlogPostContent } from '~/types'
import TemplateFrameRenderer from '~/components/layouts/TemplateFrameRenderer.vue'
import TemplateBlogRenderer from '~/components/layouts/TemplateBlogRenderer.vue'

const route = useRoute()
const category = String(route.params.category || '')
const slug = String(route.params.slug || '')

const { data: siteData, error: siteError } = await useSite()
const site = computed(() => siteData.value)

const { data: postData, error: postError } = await useAsyncData<BlogPostContent>(`blog:post:${category}:${slug}`, () => $fetch(`/api/posts/${category}/${slug}`))

if (siteError.value) throw createError({ statusCode: 500, statusMessage: siteError.value.statusMessage || 'Failed to load site config' })
if (postError.value) throw createError({ statusCode: postError.value.statusCode || 404, statusMessage: postError.value.statusMessage || 'Post not found' })

const post = computed(() => postData.value!)

useSeoMeta({
  title: () => post.value.seo.title,
  description: () => post.value.seo.description,
  ogTitle: () => post.value.seo.title,
  ogDescription: () => post.value.seo.description
})

useHead(() => ({
  link: post.value.seo.canonical ? [{ rel: 'canonical', href: post.value.seo.canonical }] : []
}))
</script>

<template>
  <TemplateFrameRenderer v-if="site" :template="site.defaultTemplate" :site="site">
    <TemplateBlogRenderer
      :template="site.defaultTemplate"
      :site="site"
      mode="post"
      :post="post"
    />
  </TemplateFrameRenderer>
</template>
