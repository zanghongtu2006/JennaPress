<script setup lang="ts">
import type { BlogPostContent } from '~/types'
import { DEFAULT_LOCALE, isSecondaryLocale } from '~/lib/i18n'
import { getStaticBlogPost } from '~/lib/static-content'
import TemplateFrameRenderer from '~/components/layouts/TemplateFrameRenderer.vue'
import TemplateBlogRenderer from '~/components/layouts/TemplateBlogRenderer.vue'

const route = useRoute()
const category = computed(() => String(route.params.category || ''))
const slug = computed(() => String(route.params.slug || ''))
const locale = computed(() => {
  const value = Array.isArray(route.params.locale) ? route.params.locale[0] : route.params.locale
  return typeof value === 'string' && isSecondaryLocale(value) ? value : DEFAULT_LOCALE
})
const config = useRuntimeConfig()
const baseUrl = computed(() => config.public.baseUrl ? `/${config.public.baseUrl}` : '')

const { data: siteData, error: siteError } = await useSite(locale)
const site = computed(() => siteData.value)

const postKey = computed(() => `blog:${locale.value}:post:${category.value}:${slug.value}`)
const { data: postData, error: postError } = await useAsyncData<BlogPostContent | null>(
  postKey,
  () => Promise.resolve(getStaticBlogPost(category.value, slug.value, locale.value)),
  { watch: [locale, category, slug] },
)

if (siteError.value) throw createError({ statusCode: 500, statusMessage: siteError.value.statusMessage || 'Failed to load site config' })
if (postError.value || !postData.value) throw createError({ statusCode: 404, statusMessage: 'Post not found' })

const post = computed(() => postData.value!)

useSeoMeta({
  title: () => post.value.seo.title,
  description: () => post.value.seo.description,
  ogTitle: () => post.value.seo.title,
  ogDescription: () => post.value.seo.description,
})

useHead(() => ({
  link: post.value.seo.canonical ? [{ rel: 'canonical', href: post.value.seo.canonical }] : [],
}))
</script>

<template>
  <TemplateFrameRenderer v-if="site" :template="site.defaultTemplate" :site="site">
    <TemplateBlogRenderer
      :template="site.defaultTemplate"
      :site="site"
      mode="post"
      :post="post"
      :locale="locale"
      :defaultLocale="DEFAULT_LOCALE"
    />
  </TemplateFrameRenderer>
</template>
