<script setup lang="ts">
import type { BlogCategory, Product } from '~/types'
import { DEFAULT_LOCALE, isSecondaryLocale } from '~/lib/i18n'
import { getStaticProductCategories, getStaticProductCategoryPayload } from '~/lib/static-content'
import TemplateFrameRenderer from '~/components/layouts/TemplateFrameRenderer.vue'
import TemplateProductRenderer from '~/components/layouts/TemplateProductRenderer.vue'

const route = useRoute()
const category = computed(() => String(route.params.category || ''))
const locale = computed(() => {
  const value = Array.isArray(route.params.locale) ? route.params.locale[0] : route.params.locale
  return typeof value === 'string' && isSecondaryLocale(value) ? value : DEFAULT_LOCALE
})

const { data: siteData, error: siteError } = await useSite(locale)
const site = computed(() => siteData.value)

const categoriesKey = computed(() => `products:${locale.value}:categories`)
const categoryKey = computed(() => `products:${locale.value}:category:${category.value}`)

const { data: categoriesData, error: categoriesError } = await useAsyncData<BlogCategory[]>(
  categoriesKey,
  () => Promise.resolve(getStaticProductCategories(locale.value)),
  { watch: [locale] },
)
const { data: categoryData, error: categoryError } = await useAsyncData<{ category: BlogCategory, products: Product[] } | null>(
  categoryKey,
  () => Promise.resolve(getStaticProductCategoryPayload(category.value, locale.value)),
  { watch: [locale, category] },
)

if (siteError.value) throw createError({ statusCode: 500, statusMessage: siteError.value.statusMessage || 'Failed to load site config' })
if (categoriesError.value) throw createError({ statusCode: 500, statusMessage: categoriesError.value.statusMessage || 'Failed to load categories' })
if (categoryError.value || !categoryData.value) throw createError({ statusCode: 404, statusMessage: 'Category not found' })

const categories = computed(() => categoriesData.value ?? [])
const categoryMeta = computed(() => categoryData.value?.category ?? null)
const products = computed(() => categoryData.value?.products ?? [])

useSeoMeta({
  title: () => `${categoryMeta.value?.label || 'Category'} Products`,
  description: () => categoryMeta.value?.description || 'Product category.',
  ogTitle: () => `${categoryMeta.value?.label || 'Category'} Products`,
  ogDescription: () => categoryMeta.value?.description || 'Product category.',
})
</script>

<template>
  <TemplateFrameRenderer v-if="site && categoryMeta" :template="site.defaultTemplate" :site="site">
    <TemplateProductRenderer
      :template="site.defaultTemplate"
      :site="site"
      mode="category"
      :categories="categories"
      :category="categoryMeta"
      :products="products"
      :locale="locale"
      :defaultLocale="DEFAULT_LOCALE"
    />
  </TemplateFrameRenderer>
</template>
