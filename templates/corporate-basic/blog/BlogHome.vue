<script setup lang="ts">
import type { BlogCategory, BlogPostSummary, SiteConfig } from '~/types'
const props = defineProps<{ site: SiteConfig; locale?: string; defaultLocale?: string; categories: BlogCategory[]; sections: Array<{ category: BlogCategory; posts: BlogPostSummary[] }> }>()
const p = (path: string) => (props.locale \&\& props.locale !== props.defaultLocale) ? `/${props.locale}${path}` : path
</script>

<template>
  <div class="page-stack template-blog template-blog-corporate">
    <section class="container section-card template-blog-hero">
      <div class="hero-kicker">Blog</div>
      <h1 class="template-blog-title">Category-first company blog</h1>
      <p class="template-blog-description">This blog is controlled by markdown content and the active template. Category sections can use different visual styles without changing route files.</p>
      <nav class="template-blog-tabs" aria-label="Blog categories">
        <NuxtLink :to="p('/blog')" class="template-blog-tab is-active">All</NuxtLink>
        <NuxtLink v-for="item in categories" :key="item.slug" :to="p(`/blog/${item.slug}`)" class="template-blog-tab">{{ item.label }}</NuxtLink>
      </nav>
    </section>

    <section v-for="section in sections" :key="section.category.slug" class="container section-card template-category-block" :class="`is-${section.category.slug}`">
      <div class="template-category-head">
        <div>
          <div class="hero-kicker">{{ section.category.label }}</div>
          <h2 class="template-category-title">{{ section.category.listTitle }}</h2>
        </div>
        <NuxtLink :to="p(`/blog/${section.category.slug}`)" class="btn btn-secondary">Open {{ section.category.label }}</NuxtLink>
      </div>
      <p class="template-category-description">{{ section.category.description }}</p>
      <div class="template-post-grid">
        <article v-for="post in section.posts.slice(0, 3)" :key="`${post.categoryMeta.slug}:${post.slug}`" class="section-card template-post-card" :class="`is-${post.categoryMeta.slug}`">
          <div class="template-post-top">
            <span class="template-post-pill">{{ post.categoryMeta.label }}</span>
            <span class="template-post-date">{{ new Date(post.publishedAt).toLocaleDateString('en-CA') }}</span>
          </div>
          <h3 class="template-post-card-title"><NuxtLink :to="p(`/blog/${post.categoryMeta.slug}/${post.slug}`)">{{ post.title }}</NuxtLink></h3>
          <p class="template-post-card-summary">{{ post.summary }}</p>
        </article>
      </div>
    </section>
  </div>
</template>
