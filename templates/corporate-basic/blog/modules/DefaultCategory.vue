<script setup lang="ts">
import type { BlogCategory, BlogPostSummary, SiteConfig } from '~/types'
const props = defineProps<{ site: SiteConfig; locale?: string; baseUrl?: string; categories: BlogCategory[]; category: BlogCategory | null; posts: BlogPostSummary[] }>()
const p = (path: string) => `${props.locale ? `/${props.locale}` : ''}${path}`
</script>

<template>
  <div v-if="category" class="page-stack template-blog template-blog-corporate">
    <section class="container section-card template-blog-hero" :class="`is-${category.slug}`">
      <div class="hero-kicker">{{ category.label }}</div>
      <h1 class="template-blog-title">{{ category.listTitle }}</h1>
      <p class="template-blog-description">{{ category.description }}</p>
      <nav class="template-blog-tabs" aria-label="Blog categories">
        <NuxtLink :to="p('/blog')" class="template-blog-tab">All</NuxtLink>
        <NuxtLink v-for="item in categories" :key="item.slug" :to="p(`/blog/${item.slug}`)" class="template-blog-tab" :class="{ 'is-active': item.slug === category.slug }">{{ item.label }}</NuxtLink>
      </nav>
    </section>

    <section class="container template-post-grid template-post-grid-full">
      <article v-for="post in posts" :key="`${post.categoryMeta.slug}:${post.slug}`" class="section-card template-post-card" :class="`is-${post.categoryMeta.slug}`">
        <div class="template-post-top">
          <span class="template-post-pill">{{ post.categoryMeta.label }}</span>
          <span class="template-post-date">{{ new Date(post.publishedAt).toLocaleDateString('en-CA') }}</span>
        </div>
        <h2 class="template-post-card-title"><NuxtLink :to="p(`/blog/${post.categoryMeta.slug}/${post.slug}`)">{{ post.title }}</NuxtLink></h2>
        <p class="template-post-card-summary">{{ post.summary }}</p>
        <div v-if="post.tags?.length" class="tag-list"><span v-for="tag in post.tags" :key="tag" class="tag-chip">{{ tag }}</span></div>
      </article>
    </section>
  </div>
</template>
