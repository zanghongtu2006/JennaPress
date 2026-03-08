<script setup lang="ts">
import type { BlogCategory, BlogPostSummary, SiteConfig } from '~/types'
defineProps<{ site: SiteConfig; categories: BlogCategory[]; category: BlogCategory | null; posts: BlogPostSummary[] }>()
</script>

<template>
  <div v-if="category" class="page-stack template-blog template-blog-saas">
    <section class="container section-card saas-blog-hero" :class="`is-${category.slug}`">
      <div class="hero-kicker">{{ category.label }}</div>
      <h1 class="template-blog-title">{{ category.listTitle }}</h1>
      <p class="template-blog-description">{{ category.description }}</p>
      <nav class="template-blog-tabs" aria-label="Blog categories">
        <NuxtLink to="/blog" class="template-blog-tab">All modules</NuxtLink>
        <NuxtLink v-for="item in categories" :key="item.slug" :to="`/blog/${item.slug}`" class="template-blog-tab" :class="{ 'is-active': item.slug === category.slug }">{{ item.label }}</NuxtLink>
      </nav>
    </section>

    <section class="container template-post-grid template-post-grid-full">
      <article v-for="post in posts" :key="`${post.categoryMeta.slug}:${post.slug}`" class="section-card template-post-card saas-post-card" :class="`is-${post.categoryMeta.slug}`">
        <span class="template-post-pill">{{ post.categoryMeta.label }}</span>
        <h2 class="template-post-card-title"><NuxtLink :to="`/blog/${post.categoryMeta.slug}/${post.slug}`">{{ post.title }}</NuxtLink></h2>
        <p class="template-post-card-summary">{{ post.summary }}</p>
      </article>
    </section>
  </div>
</template>
