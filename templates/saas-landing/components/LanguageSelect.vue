<script setup lang="ts">
import { computed } from 'vue'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, prefixPathForLocale, stripLocalePrefixFromPath } from '~/lib/i18n'

const STORAGE_KEY = 'site-language'
const route = useRoute()

const localeLabels: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
  zh: '中文'
}

const currentLocale = computed(() => stripLocalePrefixFromPath(route.path).locale)

const selectedLanguage = computed({
  get: () => currentLocale.value,
  set: async (value: string) => {
    const nextLocale = value || DEFAULT_LOCALE
    const parsed = stripLocalePrefixFromPath(route.path)
    const targetPath = prefixPathForLocale(parsed.path, nextLocale)

    if (import.meta.client) {
      try {
        window.localStorage.setItem(STORAGE_KEY, nextLocale)
      } catch {
        // ignore
      }
    }

    await navigateTo({
      path: targetPath,
      query: route.query,
      hash: route.hash
    })
  }
})
</script>

<template>
  <div class="theme-select">
    <div class="theme-select-wrap">
      <select
        id="saas-language-select"
        v-model="selectedLanguage"
        class="theme-select-control"
      >
        <option v-for="locale in SUPPORTED_LOCALES" :key="locale" :value="locale">
          {{ localeLabels[locale] || locale }}
        </option>
      </select>
    </div>
  </div>
</template>