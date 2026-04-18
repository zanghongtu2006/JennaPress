<script setup lang="ts">
import type { BlogCategory, Product, SiteConfig } from '~/types'

const props = defineProps<{ site: SiteConfig; categories: BlogCategory[]; category: BlogCategory | null; products: Product[]; locale?: string; defaultLocale?: string }>()

const p = (path: string) =>
  (props.locale && props.locale !== props.defaultLocale) ? ('/' + props.locale + path) : path
</script>


<template>
  <div v-if="category" class="page-stack template-blog template-blog-saas">
    <section class="container section-card saas-blog-hero" :class="`is-${category.slug}`">
      <div class="hero-kicker">{{ category.label }}</div>
      <h1 class="template-blog-title">{{ category.listTitle }}</h1>
      <p class="template-blog-description">{{ category.description }}</p>
      <nav class="template-blog-tabs" aria-label="Product categories">
        <NuxtLink :to="p('/products')" class="template-blog-tab">All products</NuxtLink>
        <NuxtLink v-for="item in categories" :key="item.slug" :to="p(`/products/${item.slug}`)" class="template-blog-tab" :class="{ 'is-active': item.slug === category.slug }">{{ item.label }}</NuxtLink>
      </nav>
    </section>

    <section class="container template-post-grid template-post-grid-full">
      <article v-for="product in products" :key="`${product.category}:${product.slug}`" class="section-card template-post-card saas-post-card" :class="`is-${category.slug}`">
        <div class="product-card-image">
          <img :src="product.coverImage" :alt="product.title" />
        </div>
        <span class="template-post-pill">{{ category.label }}</span>
        <h2 class="template-post-card-title"><NuxtLink :to="p(`/products/${product.category}/${product.slug}`)">{{ product.title }}</NuxtLink></h2>
        <p class="template-post-card-summary">{{ product.description }}</p>
        <div class="product-card-footer">
          <span class="product-price" :class="{ 'is-free': product.isFree }">
            {{ product.isFree ? 'Free' : `$${product.price.toFixed(2)}` }}
          </span>
          <span class="product-downloads">{{ product.downloadCount.toLocaleString() }} downloads</span>
        </div>
      </article>
    </section>
  </div>
</template>
