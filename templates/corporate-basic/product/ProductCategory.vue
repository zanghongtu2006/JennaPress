<script setup lang="ts">
import type { BlogCategory, Product, SiteConfig } from '~/types'

const props = defineProps<{ site: SiteConfig; categories: BlogCategory[]; category: BlogCategory | null; products: Product[]; locale?: string; defaultLocale?: string }>()

const p = (path: string) =>
  (props.locale && props.locale !== props.defaultLocale) ? ('/' + props.locale + path) : path
</script>


<template>
  <div class="page-stack template-blog template-blog-corporate">

    <section class="container section-card template-blog-hero">

      <div class="hero-kicker">{{ category ? category.label : 'Products' }}</div>

      <h1 class="template-blog-title">{{ category ? category.listTitle : 'All Products' }}</h1>

      <p v-if="category && category.description" class="template-blog-description">{{ category.description }}</p>

      <nav class="template-blog-tabs" aria-label="Product categories">

        <NuxtLink :to="p('/products')" class="template-blog-tab">All</NuxtLink>

        <NuxtLink v-for="item in categories" :key="item.slug" :to="p(`/products/${item.slug}`)" class="template-blog-tab" :class="{ 'is-active': item.slug === category?.slug }">{{ item.label }}</NuxtLink>

      </nav>

    </section>

    <div class="container">

      <div class="template-post-grid">

        <article v-for="product in products" :key="product.slug" class="section-card template-post-card" :class="category ? `is-${category.slug}` : ''">

          <div class="template-post-top">

            <span v-if="category" class="template-post-pill">{{ category.label }}</span>

            <span class="template-post-date">{{ new Date(product.createdAt).toLocaleDateString('en-CA') }}</span>

          </div>

          <h2 class="template-post-card-title"><NuxtLink :to="p(`/products/${category ? category.slug : 'all'}/${product.slug}`)">{{ product.title }}</NuxtLink></h2>

          <p class="template-post-card-summary">{{ product.description }}</p>

          <div class="template-product-meta">
            <div class="template-product-price">
              <span v-if="product.isFree" class="price-free">Free</span>
              <span v-else class="price-value">${{ product.price.toFixed(2) }}</span>
            </div>
            <span class="template-product-downloads">{{ product.downloadCount.toLocaleString() }} downloads</span>
          </div>

        </article>

      </div>

    </div>

  </div>
</template>
