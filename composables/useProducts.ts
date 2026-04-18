import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { DEFAULT_LOCALE } from '~/lib/i18n'
import { getStaticProducts, getStaticProduct } from '~/lib/static-content'
import type { Product } from '~/types'

export function useProducts(locale: MaybeRefOrGetter<string> = DEFAULT_LOCALE) {
  const resolvedLocale = computed(() => toValue(locale) || DEFAULT_LOCALE)

  return computed(() => getStaticProducts(resolvedLocale.value))
}

export function useProduct(slug: string, category: string, locale: MaybeRefOrGetter<string> = DEFAULT_LOCALE) {
  const resolvedLocale = computed(() => toValue(locale) || DEFAULT_LOCALE)
  const key = `${category}/${slug.replace(/^\//, '')}`

  return computed(() => getStaticProduct(category, slug, resolvedLocale.value))
}
