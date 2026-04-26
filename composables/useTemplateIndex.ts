import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { DEFAULT_LOCALE } from '~/lib/i18n'
import type { TemplateIndexManifest, TemplateIndexPayload } from '~/types'

function resolveLocale(locale?: string | null) {
  return locale || DEFAULT_LOCALE
}

export async function fetchTemplateIndexManifest() {
  return await $fetch<TemplateIndexManifest>('/template-index.json', { cache: 'no-cache' })
}

export async function fetchTemplateIndex(locale?: string | null) {
  const resolvedLocale = resolveLocale(locale)
  const manifest = await fetchTemplateIndexManifest()
  const entry = manifest.locales?.[resolvedLocale] || manifest.locales?.[manifest.defaultLocale]

  if (!entry?.index) {
    throw new Error(`Template index is not available for locale: ${resolvedLocale}`)
  }

  return await $fetch<TemplateIndexPayload>(entry.index, { cache: 'force-cache' })
}

export function useTemplateIndex(locale: MaybeRefOrGetter<string> = DEFAULT_LOCALE) {
  const resolvedLocale = computed(() => toValue(locale) || DEFAULT_LOCALE)

  return useAsyncData<TemplateIndexPayload>(
    () => `template-index:${resolvedLocale.value}`,
    () => fetchTemplateIndex(resolvedLocale.value),
    {
      server: false,
      watch: [resolvedLocale],
    },
  )
}
