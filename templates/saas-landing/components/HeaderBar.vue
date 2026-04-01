<script setup lang="ts">
import type { SiteConfig } from '~/types'
import LanguageSelect from '~/templates/saas-landing/components/LanguageSelect.vue'
import ThemeSelect from '~/templates/saas-landing/components/ThemeSelect.vue'

defineProps<{ site: SiteConfig }>()

const SECONDARY_LOCALES = ['de', 'zh', 'es', 'el']

const localeHome = computed(() => {
  if (typeof window === 'undefined') return '/'
  const path = window.location.pathname
  const lang = SECONDARY_LOCALES.find(l => path.startsWith('/' + l + '/') || path === '/' + l)
  return lang ? '/' + lang : '/'
})
</script>

<template>
  <header class="template-saas-header">
    <div class="container template-saas-header-inner">
      <a :href="localeHome" class="template-saas-brand">
        <span class="template-saas-brand-mark">{{ site.logoText }}</span>
        <span>{{ site.name }}</span>
      </a>

      <div class="template-saas-header-actions">
        <nav class="template-saas-nav" aria-label="Primary">
          <NuxtLink v-for="item in site.nav" :key="item.to" :to="item.to">
            {{ item.label }}
          </NuxtLink>
        </nav>

        <LanguageSelect />
        <ThemeSelect :themes="site.themes" :default-theme="site.defaultTheme" />
      </div>
    </div>
  </header>
</template>
