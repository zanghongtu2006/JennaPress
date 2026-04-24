<script setup lang="ts">
import type { BlogCategory, Product, SiteConfig } from '~/types'
import '~/templates/product-showcase/template.css'

const props = defineProps<{
  site: SiteConfig
  locale?: string
  defaultLocale?: string
  categories: BlogCategory[]
  category: BlogCategory | null
  products: Product[]
}>()

const p = (path: string) =>
  props.locale && props.locale !== props.defaultLocale ? `/${props.locale}${path}` : path

const formatPrice = (product: Product) => product.isFree ? 'Free' : `$${product.price.toFixed(0)}`
const productPath = (product: Product) => p(`/products/${product.categoryMeta?.slug || 'general'}/${product.slug}`)
</script>

<template>
  <div class="product-showcase-catalog">
    <section class="product-showcase-category-hero">
      <div class="container">
        <NuxtLink :to="p('/products')" class="product-showcase-breadcrumb">Catalog</NuxtLink>
        <p class="product-showcase-eyebrow">{{ site.name }}</p>
        <h1>{{ category?.label || 'Products' }}</h1>
        <p>{{ category?.description || 'Browse product recommendations.' }}</p>
      </div>
    </section>

    <section class="container product-showcase-section">
      <div class="product-showcase-category-strip">
        <NuxtLink
          v-for="item in categories"
          :key="item.slug"
          :to="p(`/products/${item.slug}`)"
          class="product-showcase-category-pill"
          :class="{ 'is-active': item.slug === category?.slug }"
        >
          <span>{{ item.label }}</span>
          <small>{{ item.description }}</small>
        </NuxtLink>
      </div>
    </section>

    <section class="container product-showcase-section">
      <div class="product-showcase-grid">
        <article v-for="product in products" :key="product.slug" class="product-showcase-card">
          <NuxtLink :to="productPath(product)" class="product-showcase-card-media">
            <img :src="product.coverImage" :alt="product.title">
          </NuxtLink>
          <div class="product-showcase-card-body">
            <div class="product-showcase-card-meta">
              <span>{{ product.categoryMeta?.label || product.category }}</span>
              <strong>{{ formatPrice(product) }}</strong>
            </div>
            <h2>
              <NuxtLink :to="productPath(product)">{{ product.title }}</NuxtLink>
            </h2>
            <p>{{ product.description }}</p>
            <div class="product-showcase-card-footer">
              <span>{{ product.downloadCount.toLocaleString('en-US') }} signals</span>
              <NuxtLink :to="productPath(product)">Read details</NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
