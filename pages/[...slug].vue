<script setup lang="ts">
import type { PageContent } from '~/types'
import { DEFAULT_LOCALE, isSecondaryLocale } from '~/lib/i18n'
import { getStaticPage } from '~/lib/static-content'
import TemplateRenderer from '~/components/layouts/TemplateRenderer.vue'
import TemplateFrameRenderer from '~/components/layouts/TemplateFrameRenderer.vue'

const route = useRoute()

const locale = computed(() => {
  const value = Array.isArray(route.params.locale) ? route.params.locale[0] : route.params.locale
  return typeof value === 'string' && isSecondaryLocale(value) ? value : DEFAULT_LOCALE
})

const slug = computed(() => {
  const raw = route.params.slug
  const parts = Array.isArray(raw) ? raw : (typeof raw === 'string' && raw ? [raw] : [])
  return `/${parts.join('/')}`
})

const { data: siteData, error: siteError } = await useSite(locale)
const site = computed(() => siteData.value)

const key = computed(() => `page:${locale.value}:${slug.value}`)
const { data: pageData, error: pageError } = await useAsyncData<PageContent | null>(
  key,
  () => Promise.resolve(getStaticPage(slug.value, locale.value)),
  { watch: [locale, slug] },
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
