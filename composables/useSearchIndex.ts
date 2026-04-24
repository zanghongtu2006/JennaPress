import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { DEFAULT_LOCALE } from '~/lib/i18n'
import type { SearchCollection, SearchIndexEntry, SearchIndexPayload } from '~/types'

export async function fetchSearchIndex(locale?: string | null) {
  const resolvedLocale = locale || DEFAULT_LOCALE
  return await $fetch<SearchIndexPayload>(`/api/search/${encodeURIComponent(resolvedLocale)}.json`)
}

export function filterSearchEntries(
  entries: SearchIndexEntry[],
  query: string,
  collections?: SearchCollection[],
) {
  const normalizedQuery = query.trim().toLowerCase()
  const collectionSet = collections?.length ? new Set(collections) : null

  return entries.filter((entry) => {
    if (collectionSet && !collectionSet.has(entry.collection)) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    return [entry.title, entry.description, entry.text, entry.categoryLabel, ...(entry.tags || [])]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery)
  })
}

export async function useSearchIndex(locale: MaybeRefOrGetter<string> = DEFAULT_LOCALE) {
  const resolvedLocale = computed(() => toValue(locale) || DEFAULT_LOCALE)

  return await useAsyncData<SearchIndexPayload>(
    () => `search-index:${resolvedLocale.value}`,
    () => fetchSearchIndex(resolvedLocale.value),
    { watch: [resolvedLocale] },
  )
}
