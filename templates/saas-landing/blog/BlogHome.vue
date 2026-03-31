<script setup lang="ts">

import type { BlogCategory, BlogPostSummary, SiteConfig } from '~/types'

defineProps<{ site: SiteConfig; categories: BlogCategory[]; sections: Array<{ category: BlogCategory; posts: BlogPostSummary[] }> }>()

</script>



<template>

  <div class="page-stack template-blog template-blog-saas">

    <section class="container section-card saas-blog-hero">

      <div class="hero-kicker">Template-driven blog</div>

      <h1 class="template-blog-title">One route, multiple category experiences</h1>

      <p class="template-blog-description">Users only edit markdown content and the active template folder. The route layer stays generic.</p>

      <nav class="template-blog-tabs" aria-label="Blog categories">

        <NuxtLink :to="p('/blog')" class="template-blog-tab is-active">All modules</NuxtLink>

        <NuxtLink v-for="item in categories" :key="item.slug" :to="`/blog/${item.slug}`" class="template-blog-tab">{{ item.label }}</NuxtLink>

      </nav>

    </section>



    <section v-for="section in sections" :key="section.category.slug" class="container saas-category-wrap" :class="`is-${section.category.slug}`">

      <div class="saas-category-head">

        <div>

          <div class="hero-kicker">{{ section.category.label }}</div>

          <h2 class="template-category-title">{{ section.category.listTitle }}</h2>

        </div>

        <p class="template-category-description">{{ section.category.description }}</p>

      </div>

      <div class="template-post-grid">

        <article v-for="post in section.posts.slice(0, 3)" :key="`${post.categoryMeta.slug}:${post.slug}`" class="section-card template-post-card saas-post-card" :class="`is-${post.categoryMeta.slug}`">

          <span class="template-post-pill">{{ post.categoryMeta.label }}</span>

          <h3 class="template-post-card-title"><NuxtLink :to="p(`/blog/${post.categoryMeta.slug}/${post.slug}`)">{{ post.title }}</NuxtLink></h3>

          <p class="template-post-card-summary">{{ post.summary }}</p>

          <NuxtLink :to="p(`/blog/${post.categoryMeta.slug}`)" class="btn btn-secondary">Browse {{ post.categoryMeta.label }}</NuxtLink>

        </article>

      </div>

    </section>

  </div>

</template>

