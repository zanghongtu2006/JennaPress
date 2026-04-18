<script setup lang="ts">
import type { Product, SiteConfig } from '~/types'

const props = defineProps<{
  site: SiteConfig
  categories: string[]
  category: string | null
  products: Product[]
  locale?: string
  defaultLocale?: string
}>()

const p = (path: string) =>
  (props.locale && props.locale !== props.defaultLocale) ? ('/' + props.locale + path) : path
</script>

<template>
  <div v-if="category" class="page-stack template-product template-product-saas">
    <section class="container section-card saas-product-hero" :class="`is-${category}`">
      <div class="hero-kicker">{{ category }}</div>
      <h1 class="template-product-title">{{ category }} Products</h1>
      <p class="template-product-description">Browse our {{ category }} collection.</p>
      <nav class="template-product-tabs" aria-label="Product categories">
        <NuxtLink :to="p('/products')" class="template-product-tab">All Products</NuxtLink>
        <NuxtLink v-for="cat in categories" :key="cat" :to="p(`/products/${cat}`)" class="template-product-tab" :class="{ 'is-active': cat === category }">{{ cat }}</NuxtLink>
      </nav>
    </section>

    <section class="container template-product-grid-full">
      <article v-for="product in products" :key="product.slug" class="section-card product-card">
        <div class="product-card-image">
          <img :src="product.coverImage" :alt="product.title" loading="lazy" />
        </div>
        <h2 class="product-card-title"><NuxtLink :to="p(`/products/${product.category}/${product.slug}`)">{{ product.title }}</NuxtLink></h2>
        <p class="product-card-summary">{{ product.description }}</p>
        <div class="product-card-footer">
          <span :class="['product-price', { 'is-free': product.isFree }]">
            {{ product.isFree ? 'Free' : `$${product.price}` }}
          </span>
          <span class="product-downloads">{{ product.downloadCount.toLocaleString() }} downloads</span>
        </div>
      </article>
    </section>
  </div>
</template>
