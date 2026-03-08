<script setup lang="ts">
import type { SiteConfig } from '~/types'

defineProps<{ site: SiteConfig }>()
</script>

<template>
  <header class="template-corporate-basic-header">
    <div class="container template-corporate-basic-header-inner">
      <NuxtLink to="/" class="template-corporate-basic-brand">
        <span class="template-corporate-basic-brand-mark">{{ site.logoText }}</span>
        <span>{{ site.name }}</span>
      </NuxtLink>

      <nav class="template-corporate-basic-nav" aria-label="Primary">
        <NuxtLink v-for="item in site.nav" :key="item.to" :to="item.to">
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
