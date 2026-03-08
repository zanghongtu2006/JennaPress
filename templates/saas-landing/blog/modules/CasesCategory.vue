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
    </section>

    <section class="container saas-cases-shell section-card">
      <div class="saas-cases-head">
        <div>
          <div class="saas-template-badge">Cases module</div>
          <h2 class="saas-cases-title">Pipeline-style customer stories</h2>
        </div>
        <p class="saas-cases-copy">This category is bound to its own module template. Switch the mapping in blog.config.ts without touching routes.</p>
      </div>
      <div class="saas-cases-grid">
        <article v-for="(post, index) in posts" :key="`${post.categoryMeta.slug}:${post.slug}`" class="saas-case-card" :class="{ 'is-featured': index === 0 }">
          <div class="saas-case-step">0{{ index + 1 }}</div>
          <div class="saas-case-track"></div>
          <div class="saas-case-body">
            <span class="template-post-pill">{{ post.categoryMeta.label }}</span>
            <h2 class="template-post-card-title"><NuxtLink :to="`/blog/${post.categoryMeta.slug}/${post.slug}`">{{ post.title }}</NuxtLink></h2>
            <p class="template-post-card-summary">{{ post.summary }}</p>
            <div v-if="post.tags?.length" class="tag-list"><span v-for="tag in post.tags" :key="tag" class="tag-chip">{{ tag }}</span></div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
