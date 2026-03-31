<script setup lang="ts">
import type { BlogPostContent, SiteConfig } from '~/types'
const props = defineProps<{ site: SiteConfig; locale?: string; defaultLocale?: string; post: BlogPostContent | null }>()
const p = (path: string) => (props.locale \&\& props.locale !== props.defaultLocale) ? `/${props.locale}${path}` : path
</script>

<template>
  <article v-if="post" class="page-stack template-blog template-blog-corporate">
    <header class="container section-card template-post-hero" :class="`is-${post.categoryMeta.slug}`">
      <div class="template-breadcrumbs">
        <NuxtLink :to="p('/blog')">Blog</NuxtLink>
        <span>/</span>
        <NuxtLink :to="p(`/blog/${post.categoryMeta.slug}`)">{{ post.categoryMeta.label }}</NuxtLink>
      </div>
      <div class="template-post-top">
        <span class="template-post-pill">{{ post.categoryMeta.label }}</span>
        <span class="template-post-date">{{ new Date(post.publishedAt).toLocaleDateString('en-CA') }}</span>
      </div>
      <h1 class="template-blog-title">{{ post.title }}</h1>
      <p class="template-blog-description">{{ post.summary }}</p>
      <div v-if="post.tags?.length" class="tag-list"><span v-for="tag in post.tags" :key="tag" class="tag-chip">{{ tag }}</span></div>
    </header>
    <div class="container"><BlockRenderer :blocks="post.body" /></div>
  </article>
</template>
