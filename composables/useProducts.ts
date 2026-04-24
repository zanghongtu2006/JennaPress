import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { fetchProductContent, fetchProductsContent } from '~/composables/useContentData'
import { DEFAULT_LOCALE } from '~/lib/i18n'
import type { Product } from '~/types'

export function useProducts(locale: MaybeRefOrGetter<string> = DEFAULT_LOCALE) {
  const resolvedLocale = computed(() => toValue(locale) || DEFAULT_LOCALE)
  const { data } = useAsyncData<Product[]>(
    () => `products:${resolvedLocale.value}:items`,
    () => fetchProductsContent(resolvedLocale.value),
    { watch: [resolvedLocale] },
  )

  return computed(() => data.value ?? [])
}

export function useProduct(slug: string, category: string, locale: MaybeRefOrGetter<string> = DEFAULT_LOCALE) {
  const resolvedLocale = computed(() => toValue(locale) || DEFAULT_LOCALE)
  const normalizedSlug = slug.replace(/^\//, '')
  const { data } = useAsyncData<Product | null>(
    () => `products:${resolvedLocale.value}:product:${category}:${normalizedSlug}`,
    () => fetchProductContent(category, normalizedSlug, resolvedLocale.value),
    { watch: [resolvedLocale] },
  )

  return computed(() => data.value)
}
