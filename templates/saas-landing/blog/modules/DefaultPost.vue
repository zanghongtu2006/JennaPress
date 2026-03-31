<script setup lang="ts">
import type { BlogPostContent, SiteConfig } from '~/types'
defineProps<{ site: SiteConfig; locale?: string; defaultLocale?: string; post: BlogPostContent | null }>()
const p = (path) => (props.locale && props.locale !== props.defaultLocale) ? `/${props.locale}${path}` : path
</script>

<template>
  <article v-if="post" class="page-stack template-blog template-blog-saas">
    <header class="container section-card saas-blog-hero template-post-hero" :class="`is-${post.categoryMeta.slug}`">
      <div class="template-breadcrumbs">
        <NuxtLink  :to="p('/blog')">Blog</NuxtLink>
        <span>/</span>
        <NuxtLink :to="p(`/blog/${post.categoryMeta.slug}`)">{{ post.categoryMeta.label }}</NuxtLink>
      </div>
      <span class="template-post-pill">{{ post.categoryMeta.label }}</span>
      <h1 class="template-blog-title">{{ post.title }}</h1>
      <p class="template-blog-description">{{ post.summary }}</p>
    </header>
    <div class="container"><BlockRenderer :blocks="post.body" /></div>
  </article>
</template>
