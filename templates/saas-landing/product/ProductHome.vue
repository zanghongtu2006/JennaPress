<script setup lang="ts">
import type { Product, SiteConfig } from '~/types'

const props = defineProps<{
  site: SiteConfig
  categories: string[]
  sections: Array<{ category: string; products: Product[] }>
  locale?: string
  defaultLocale?: string
}>()

const p = (path: string) =>
  (props.locale && props.locale !== props.defaultLocale) ? ('/' + props.locale + path) : path
</script>

<template>
  <div class="page-stack template-product template-product-saas">

    <section class="container section-card saas-product-hero">
      <div class="hero-kicker">Digital Products</div>
      <h1 class="template-product-title">Discover premium resources</h1>
      <p class="template-product-description">Browse our collection of templates, plugins, and digital assets.</p>
      <nav class="template-product-tabs" aria-label="Product categories">
        <NuxtLink :to="p('/products')" class="template-product-tab is-active">All Products</NuxtLink>
        <NuxtLink v-for="cat in categories" :key="cat" :to="p(`/products/${cat}`)" class="template-product-tab">{{ cat }}</NuxtLink>
      </nav>
    </section>

    <section v-for="section in sections" :key="section.category" class="container saas-category-wrap" :class="`is-${section.category}`">
      <div class="saas-category-head">
        <div>
          <div class="hero-kicker">{{ section.category }}</div>
          <h2 class="template-category-title">{{ section.category }} Collection</h2>
        </div>
      </div>

      <div class="template-product-grid">
        <article v-for="product in section.products.slice(0, 3)" :key="product.slug" class="section-card product-card">
          <div class="product-card-image">
            <img :src="product.coverImage" :alt="product.title" loading="lazy" />
          </div>
          <h3 class="product-card-title"><NuxtLink :to="p(`/products/${product.category}/${product.slug}`)">{{ product.title }}</NuxtLink></h3>
          <p class="product-card-summary">{{ product.description }}</p>
          <div class="product-card-footer">
            <span :class="['product-price', { 'is-free': product.isFree }]">
              {{ product.isFree ? 'Free' : `$${product.price}` }}
            </span>
            <span class="product-downloads">{{ product.downloadCount.toLocaleString() }} downloads</span>
          </div>
            <NuxtLink :to="p(`/products/${product.category}/${product.slug}`)" class="btn btn-secondary">View Details</NuxtLink>
        </article>
      </div>
    </section>

  </div>
</template>
