<script setup lang="ts">
import type { SiteConfig } from '~/types'

defineProps<{ site: SiteConfig }>()
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <div class="container header-inner">
        <NuxtLink to="/" class="brand">
          <span class="brand-mark">{{ site.logoText }}</span>
          <span>{{ site.name }}</span>
        </NuxtLink>

        <nav class="nav-links">
          <NuxtLink v-for="item in site.nav" :key="item.to" :to="item.to">
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="site-main">
      <slot />
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <div>
          <strong>{{ site.name }}</strong>
          <div>{{ site.footerText }}</div>
        </div>

        <div v-if="site.contactEmail">
          Contact: <a :href="`mailto:${site.contactEmail}`">{{ site.contactEmail }}</a>
        </div>
      </div>
    </footer>
  </div>
</template>
