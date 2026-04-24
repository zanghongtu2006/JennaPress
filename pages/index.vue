<script setup lang="ts">
import type { PageContent } from '~/types'
import { fetchPageContent } from '~/composables/useContentData'
import { DEFAULT_LOCALE, isSecondaryLocale } from '~/lib/i18n'
import TemplateRenderer from '~/components/layouts/TemplateRenderer.vue'
import TemplateFrameRenderer from '~/components/layouts/TemplateFrameRenderer.vue'

const route = useRoute()
const locale = computed(() => {
  const value = Array.isArray(route.params.locale) ? route.params.locale[0] : route.params.locale
  return typeof value === 'string' && isSecondaryLocale(value) ? value : DEFAULT_LOCALE
})

const { data: siteData, error: siteError } = await useSite(locale)
const site = computed(() => siteData.value)

const pageKey = computed(() => `page:${locale.value}:/`)
const { data: pageData, error: pageError } = await useAsyncData<PageContent | null>(
  pageKey,
  () => fetchPageContent('/', locale.value),
  { watch: [locale] },
)

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
  ogDescription: () => page.value.seo.description,
})

useHead(() => ({
  link: page.value.seo.canonical
    ? [{ rel: 'canonical', href: page.value.seo.canonical }]
    : [],
}))
</script>

<template>
  <TemplateFrameRenderer v-if="site" :template="site.defaultTemplate" :site="site">
    <TemplateRenderer :template="site.defaultTemplate" :page="page" />
  </TemplateFrameRenderer>
</template>
