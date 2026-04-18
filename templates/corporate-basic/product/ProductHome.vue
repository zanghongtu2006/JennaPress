<script setup lang="ts">
import type { BlogCategory, Product, SiteConfig } from '~/types'

const props = defineProps<{ site: SiteConfig; categories: BlogCategory[]; sections: Array<{ category: BlogCategory; products: Product[] }>; locale?: string; defaultLocale?: string }>()

const p = (path: string) =>
  (props.locale && props.locale !== props.defaultLocale) ? ('/' + props.locale + path) : path
</script>


<template>
  <div class="page-stack template-blog template-blog-corporate">

    <section class="container section-card template-blog-hero">

      <div class="hero-kicker">Products</div>

      <h1 class="template-blog-title">Category-first product showcase</h1>

      <p class="template-blog-description">Browse our products organized by category. Each section showcases featured items from different product categories.</p>

      <nav class="template-blog-tabs" aria-label="Product categories">

        <NuxtLink :to="p('/products')" class="template-blog-tab is-active">All</NuxtLink>

        <NuxtLink v-for="item in categories" :key="item.slug" :to="p(`/products/${item.slug}`)" class="template-blog-tab">{{ item.label }}</NuxtLink>

      </nav>

    </section>


    <section v-for="section in sections" :key="section.category.slug" class="container section-card template-category-block" :class="`is-${section.category.slug}`">

      <div class="template-category-head">

        <div>

          <div class="hero-kicker">{{ section.category.label }}</div>

          <h2 class="template-category-title">{{ section.category.listTitle }}</h2>

        </div>

        <NuxtLink :to="p(`/products/${section.category.slug}`)" class="btn btn-secondary">Open {{ section.category.label }}</NuxtLink>

      </div>

      <p class="template-category-description">{{ section.category.description }}</p>

      <div class="template-post-grid">

        <article v-for="product in section.products.slice(0, 3)" :key="product.slug" class="section-card template-post-card" :class="`is-${section.category.slug}`">

          <div class="template-post-top">

            <span class="template-post-pill">{{ section.category.label }}</span>

            <span class="template-post-date">{{ new Date(product.createdAt).toLocaleDateString('en-CA') }}</span>

          </div>

          <h3 class="template-post-card-title"><NuxtLink :to="p(`/products/${section.category.slug}/${product.slug}`)">{{ product.title }}</NuxtLink></h3>

          <p class="template-post-card-summary">{{ product.description }}</p>

          <div class="template-product-price">
            <span v-if="product.isFree" class="price-free">Free</span>
            <span v-else class="price-value">${{ product.price.toFixed(2) }}</span>
          </div>

        </article>

      </div>

    </section>

  </div>
</template>
