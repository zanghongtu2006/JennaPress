<script setup lang="ts">
import type { PageContent } from '~/types'
import TemplateRenderer from '~/components/layouts/TemplateRenderer.vue'
import TemplateFrameRenderer from '~/components/layouts/TemplateFrameRenderer.vue'

const route = useRoute()
const slugPath = Array.isArray(route.params.slug)
  ? route.params.slug.join('/')
  : route.params.slug || ''
const slug = `/${slugPath}`

const { data: siteData, error: siteError } = await useSite()
const site = computed(() => siteData.value)

const key = `page:${slug}`
const { data: pageData, error: pageError } = await useAsyncData<PageContent>(key, () => {
  return $fetch(`/api/pages/${slug.replace(/^\//, '')}`)
})

if (siteError.value) {
  throw createError({ statusCode: 500, statusMessage: 'Failed to load site config' })
}

if (pageError.value || !pageData.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const page = computed(() => pageData.value!)

useSeoMeta({
  title: () => page.value.seo.title,
  description: () => page.value.seo.description,
  ogTitle: () => page.value.seo.title,
  ogDescription: () => page.value.seo.description
})

useHead(() => ({
  link: page.value.seo.canonical
    ? [{ rel: 'canonical', href: page.value.seo.canonical }]
    : []
}))
</script>

<template>
  <TemplateFrameRenderer v-if="site" :template="site.defaultTemplate" :site="site">
    <div class="container page-meta-row">
      <div class="page-meta-label">{{ page.title }}</div>
    </div>
    <TemplateRenderer :template="site.defaultTemplate" :page="page" />
  </TemplateFrameRenderer>
</template>
