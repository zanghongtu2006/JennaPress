<script setup lang="ts">
import type { SiteConfig } from '~/types'

defineProps<{ site: SiteConfig }>()

const { app } = useRuntimeConfig()
const homeHref = computed(() => app.baseURL)
</script>

<template>
  <header class="template-corporate-basic-header">
    <div class="container template-corporate-basic-header-inner">
      <a :href="homeHref" class="template-corporate-basic-brand">
        <span class="template-corporate-basic-brand-mark">{{ site.logoText }}</span>
        <span>{{ site.name }}</span>
      </a>

      <nav class="template-corporate-basic-nav" aria-label="Primary">
        <NuxtLink v-for="item in site.nav" :key="item.to" :to="item.to">
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
