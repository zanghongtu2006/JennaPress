<script setup lang="ts">
import type { SiteConfig } from '~/types'

defineProps<{ site: SiteConfig }>()
</script>

<template>
  <header class="template-saas-header">
    <div class="container template-saas-header-inner">
      <NuxtLink to="/" class="template-saas-brand">
        <span class="template-saas-brand-mark">{{ site.logoText }}</span>
        <span>{{ site.name }}</span>
      </NuxtLink>

      <nav class="template-saas-nav" aria-label="Primary">
        <NuxtLink v-for="item in site.nav" :key="item.to" :to="item.to">
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
