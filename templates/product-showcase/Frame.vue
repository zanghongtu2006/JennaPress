<script setup lang="ts">
import type { SiteConfig } from '~/types'
import '~/templates/product-showcase/template.css'

const props = defineProps<{ site: SiteConfig }>()

useTheme({
  themes: props.site.themes,
  defaultTheme: props.site.defaultTheme
})

const homePath = computed(() => props.site.nav.find(item => item.to === '/' || /^\/[a-z0-9-]+$/i.test(item.to))?.to || '/')
</script>

<template>
  <div class="product-showcase-frame">
    <header class="product-showcase-header">
      <div class="container product-showcase-header-inner">
        <NuxtLink :to="homePath" class="product-showcase-brand">
          <span class="product-showcase-brand-mark">{{ site.logoText }}</span>
          <span>{{ site.name }}</span>
        </NuxtLink>

        <nav class="product-showcase-nav" aria-label="Primary">
          <NuxtLink v-for="item in site.nav" :key="item.to" :to="item.to">
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="product-showcase-main">
      <slot />
    </main>

    <footer class="product-showcase-footer">
      <div class="container product-showcase-footer-inner">
        <div class="product-showcase-footer-copy">
          <strong>{{ site.name }}</strong>
          <span>{{ site.footerText }}</span>
        </div>

        <div class="product-showcase-footer-links">
          <a v-if="site.contactEmail" :href="`mailto:${site.contactEmail}`">{{ site.contactEmail }}</a>
          <a
            v-for="link in site.socialLinks || []"
            :key="link.to"
            :href="link.to"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ link.label }}
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
