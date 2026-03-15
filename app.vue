<script setup lang="ts">
import { DEFAULT_LOCALE, isSecondaryLocale, prefixPathForLocale, stripLocalePrefixFromPath } from '~/lib/i18n'

const STORAGE_KEY = 'site-language'

if (import.meta.client) {
  const route = useRoute()
  const router = useRouter()
  const config = useRuntimeConfig()

  onMounted(async () => {
    try {
      const savedLanguage = window.localStorage.getItem(STORAGE_KEY)
      if (!isSecondaryLocale(savedLanguage)) {
        return
      }

      const parsed = stripLocalePrefixFromPath(route.path)
      const baseURL = (config.app.baseURL || '/').replace(/\/+$/, '') || ''
      const normalizedPath = route.path.replace(/\/+$/, '') || '/'

      const isBaseRoot =
        normalizedPath === '/'
        || normalizedPath === baseURL
        || normalizedPath === `${baseURL}`

      const isDefaultLocaleRoot =
        parsed.locale === DEFAULT_LOCALE
        && parsed.path === '/'
        && isBaseRoot

      if (!isDefaultLocaleRoot) {
        return
      }

      const targetPath = prefixPathForLocale('/', savedLanguage)
      if (targetPath !== parsed.path && targetPath !== route.path) {
        await router.replace({
          path: targetPath,
          query: route.query,
          hash: route.hash
        })
      }
    } catch {
      // ignore
    }
  })
}
</script>

<template>
  <NuxtPage />
</template>