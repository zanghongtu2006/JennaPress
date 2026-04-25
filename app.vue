<script setup lang="ts">
import { DEFAULT_LOCALE, isSecondaryLocale, prefixPathForLocale, stripLocalePrefixFromPath } from '~/lib/i18n'
import OpenSourceFooterAttribution from '~/components/shared/OpenSourceFooterAttribution.vue'

const STORAGE_KEY = 'site-language'

if (import.meta.client) {
  const route = useRoute()
  const router = useRouter()

  onMounted(async () => {
    try {
      const savedLanguage = window.localStorage.getItem(STORAGE_KEY)
      if (!isSecondaryLocale(savedLanguage)) {
        return
      }

      const parsed = stripLocalePrefixFromPath(route.path)
      if (parsed.locale !== DEFAULT_LOCALE) {
        return
      }

      const targetPath = prefixPathForLocale(parsed.path, savedLanguage)
      if (targetPath !== route.path) {
        await router.replace({
          path: targetPath,
          query: route.query,
          hash: route.hash,
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
  <div class="jennapress-global-attribution">
    <OpenSourceFooterAttribution />
  </div>
</template>

<style scoped>
.jennapress-global-attribution {
  display: flex;
  justify-content: center;
  padding: 16px 20px 24px;
}
</style>