<script setup lang="ts">

import type { BlogCategory, BlogPostSummary, SiteConfig } from '~/types'

const props = defineProps<{ site: SiteConfig; categories: BlogCategory[]; category: BlogCategory | null; posts: BlogPostSummary[]; locale?: string; defaultLocale?: string }>()

const p = (path: string) => (props.locale && props.locale !== props.defaultLocale) ? ('/' + props.locale + path) : path

</script>



<template>

  <div v-if="category" class="page-stack template-blog template-blog-corporate">

    <section class="container section-card template-blog-hero" :class="`is-${category.slug}`">

      <div class="hero-kicker">{{ category.label }}</div>

      <h1 class="template-blog-title">{{ category.listTitle }}</h1>

      <p class="template-blog-description">{{ category.description }}</p>

      <nav class="template-blog-tabs" aria-label="Blog categories">

        <NuxtLink to="/blog" class="template-blog-tab">All</NuxtLink>

      </nav>

    </section>



    <section class="container corporate-cases-layout">

      <aside class="section-card corporate-cases-brief">

        <div class="hero-kicker">Case mode</div>

        <h2>Reference-style case archive</h2>

        <p>Use this module when a corporate site needs a formal case-study index with guidance content on the side.</p>

        <ul class="corporate-cases-points">

          <li>More conservative presentation</li>

          <li>Good fit for B2B references</li>

          <li>Easy to adapt for client, scope, result blocks</li>

        </ul>

      </aside>

      <div class="corporate-cases-list">

        <article v-for="(post, index) in posts" :key="`${post.categoryMeta.slug}:${post.slug}`" class="section-card corporate-case-card" :class="{ 'is-featured': index === 0 }">

          <div class="corporate-case-index">{{ String(index + 1).padStart(2, '0') }}</div>

          <div class="corporate-case-body">

            <div class="template-post-top">

              <span class="template-post-pill">{{ post.categoryMeta.label }}</span>

              <span class="template-post-date">{{ new Date(post.publishedAt).toLocaleDateString('en-CA') }}</span>

            </div>

            <h2 class="template-post-card-title"><NuxtLink :to="p(`/blog/${post.categoryMeta.slug}/${post.slug}`)">{{ post.title }}</NuxtLink></h2>

            <p class="template-post-card-summary">{{ post.summary }}</p>

            <div v-if="post.tags?.length" class="tag-list"><span v-for="tag in post.tags" :key="tag" class="tag-chip">{{ tag }}</span></div>

          </div>

        </article>

      </div>

    </section>

  </div>

</template>

