<script setup lang="ts">
import type { Product, SiteConfig } from '~/types'

const props = defineProps<{
  site: SiteConfig
  product: Product | null
  locale?: string
  defaultLocale?: string
}>()

const p = (path: string) =>
  (props.locale && props.locale !== props.defaultLocale) ? ('/' + props.locale + path) : path

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <article v-if="product" class="page-stack template-product template-product-saas">
    <header class="container section-card saas-product-hero template-product-hero">
      <div class="template-breadcrumbs">
        <NuxtLink :to="p('/products')">Products</NuxtLink>
        <span>/</span>
        <NuxtLink :to="p(`/products/${product.category}`)">{{ product.category }}</NuxtLink>
      </div>
      <div class="product-cover-image">
        <img :src="product.coverImage" :alt="product.title" />
      </div>
      <h1 class="template-product-title">{{ product.title }}</h1>
      <p class="template-product-description">{{ product.description }}</p>
      <div class="template-product-actions">
        <a v-if="product.isFree" :href="product.downloadUrl" class="btn btn-primary">Download Free</a>
        <a v-else :href="product.downloadUrl" class="btn btn-primary">Buy for ${{ product.price }}</a>
        <span class="product-downloads">{{ product.downloadCount.toLocaleString() }} downloads</span>
      </div>
    </header>

    <section class="container">
      <div class="product-detail-layout">
        <div class="product-detail-main">
          <div v-if="product.previewImages && product.previewImages.length" class="product-preview-images">
            <img v-for="(img, i) in product.previewImages" :key="i" :src="img" :alt="`${product.title} preview ${i + 1}`" loading="lazy" />
          </div>
          <div v-if="product.blocks && product.blocks.length" class="section-card product-blocks">
            <BlockRenderer :blocks="product.blocks" />
          </div>
        </div>
        <aside class="product-detail-sidebar">
          <div class="section-card product-purchase-card">
            <div class="product-price-display">
              <span :class="['product-price-large', { 'is-free': product.isFree }]">
                {{ product.isFree ? 'Free' : `$${product.price}` }}
              </span>
            </div>
            <a v-if="product.isFree" :href="product.downloadUrl" class="btn btn-primary product-download-btn">Download Free</a>
            <a v-else :href="product.downloadUrl" class="btn btn-primary product-download-btn">Buy Now</a>
            <div class="product-stats">
              <div class="product-stat">
                <span class="product-stat-label">Downloads</span>
                <span class="product-stat-value">{{ product.downloadCount.toLocaleString() }}</span>
              </div>
              <div class="product-stat">
                <span class="product-stat-label">Released</span>
                <span class="product-stat-value">{{ formatDate(product.createdAt) }}</span>
              </div>
              <div class="product-stat">
                <span class="product-stat-label">Updated</span>
                <span class="product-stat-value">{{ formatDate(product.updatedAt) }}</span>
              </div>
            </div>
          </div>

          <div class="section-card product-author-card">
            <div class="product-author-label">Author</div>
            <a :href="product.authorUrl" class="product-author-link">{{ product.author }}</a>
          </div>

          <div v-if="product.tags && product.tags.length" class="section-card product-tags-card">
            <div class="product-tags-label">Tags</div>
            <div class="tag-list">
              <span v-for="tag in product.tags" :key="tag" class="tag-chip">{{ tag }}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </article>
</template>
