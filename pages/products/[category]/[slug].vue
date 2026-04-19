<script setup lang="ts">
import type { Product } from '~/types'
import { DEFAULT_LOCALE, isSecondaryLocale } from '~/lib/i18n'
import { getStaticProduct } from '~/lib/static-content'
import TemplateFrameRenderer from '~/components/layouts/TemplateFrameRenderer.vue'
import TemplateProductRenderer from '~/components/layouts/TemplateProductRenderer.vue'

const route = useRoute()
const category = computed(() => String(route.params.category || ''))
const slug = computed(() => String(route.params.slug || ''))
const locale = computed(() => {
  const value = Array.isArray(route.params.locale) ? route.params.locale[0] : route.params.locale
  return typeof value === 'string' && isSecondaryLocale(value) ? value : DEFAULT_LOCALE
})

const { data: siteData, error: siteError } = await useSite(locale)
const site = computed(() => siteData.value)

const productKey = computed(() => `products:${locale.value}:product:${category.value}:${slug.value}`)
const { data: productData, error: productError } = await useAsyncData<Product | null>(
  productKey,
  () => Promise.resolve(getStaticProduct(category.value, slug.value, locale.value)),
  { watch: [locale, category, slug] },
)

if (siteError.value) throw createError({ statusCode: 500, statusMessage: siteError.value.statusMessage || 'Failed to load site config' })
if (productError.value || !productData.value) throw createError({ statusCode: 404, statusMessage: 'Product not found' })

const product = computed(() => productData.value!)
const categoryMeta = computed(() => product.value.categoryMeta ?? null)

useSeoMeta({
  title: () => product.value.title,
  description: () => product.value.description,
  ogTitle: () => product.value.title,
  ogDescription: () => product.value.description,
})

useHead(() => ({
  link: product.value.seo?.canonical ? [{ rel: 'canonical', href: product.value.seo.canonical }] : [],
}))
</script>

<template>
  <TemplateFrameRenderer v-if="site" :template="site.defaultTemplate" :site="site">
    <TemplateProductRenderer
      :template="site.defaultTemplate"
      :site="site"
      mode="product"
      :product="product"
      :category="categoryMeta"
      :locale="locale"
      :defaultLocale="DEFAULT_LOCALE"
    />
  </TemplateFrameRenderer>
</template>
