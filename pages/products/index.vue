<script setup lang="ts">
import type { BlogCategory, Product } from '~/types'
import { DEFAULT_LOCALE, isSecondaryLocale } from '~/lib/i18n'
import { getStaticProductCategories, getStaticProducts } from '~/lib/static-content'
import TemplateFrameRenderer from '~/components/layouts/TemplateFrameRenderer.vue'
import TemplateProductRenderer from '~/components/layouts/TemplateProductRenderer.vue'

const route = useRoute()
const locale = computed(() => {
  const value = Array.isArray(route.params.locale) ? route.params.locale[0] : route.params.locale
  return typeof value === 'string' && isSecondaryLocale(value) ? value : DEFAULT_LOCALE
})

const { data: siteData, error: siteError } = await useSite(locale)
const site = computed(() => siteData.value)

const categoriesKey = computed(() => `products:${locale.value}:categories`)
const productsKey = computed(() => `products:${locale.value}:products`)

const { data: categoriesData, error: categoriesError } = await useAsyncData<BlogCategory[]>(
  categoriesKey,
  () => Promise.resolve(getStaticProductCategories(locale.value)),
  { watch: [locale] },
)
const { data: productsData, error: productsError } = await useAsyncData<Product[]>(
  productsKey,
  () => Promise.resolve(getStaticProducts(locale.value)),
  { watch: [locale] },
)

if (siteError.value) throw createError({ statusCode: 500, statusMessage: siteError.value.statusMessage || 'Failed to load site config' })
if (categoriesError.value) throw createError({ statusCode: 500, statusMessage: categoriesError.value.statusMessage || 'Failed to load categories' })
if (productsError.value) throw createError({ statusCode: 500, statusMessage: productsError.value.statusMessage || 'Failed to load products' })

const categories = computed(() => categoriesData.value ?? [])
const products = computed(() => productsData.value ?? [])
const sections = computed(() => categories.value.map(category => ({
  category,
  products: products.value.filter(product => product.category === category.key),
})).filter(section => section.products.length > 0))

useSeoMeta({
  title: () => `${site.value?.name || 'Site'} Products`,
  description: 'Browse our product catalog.',
  ogTitle: () => `${site.value?.name || 'Site'} Products`,
  ogDescription: 'Browse our product catalog.',
})
</script>

<template>
  <TemplateFrameRenderer v-if="site" :template="site.defaultTemplate" :site="site">
    <TemplateProductRenderer
      :template="site.defaultTemplate"
      :site="site"
      mode="home"
      :categories="categories"
      :sections="sections"
      :products="products"
      :locale="locale"
      :defaultLocale="DEFAULT_LOCALE"
    />
  </TemplateFrameRenderer>
</template>
