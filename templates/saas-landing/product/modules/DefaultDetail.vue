<script setup lang="ts">
import type { Product, SiteConfig } from '~/types'

const props = defineProps<{ site: SiteConfig; product: Product | null; locale?: string; defaultLocale?: string }>()

const p = (path: string) =>
  (props.locale && props.locale !== props.defaultLocale) ? ('/' + props.locale + path) : path
</script>


<template>
  <article v-if="product" class="page-stack template-blog template-blog-saas">
    <header class="container section-card saas-blog-hero template-post-hero" :class="`is-${product.category}`">
      <div class="template-breadcrumbs">
        <NuxtLink :to="p('/products')">Products</NuxtLink>
        <span>/</span>
        <NuxtLink :to="p(`/products/${product.category}`)">{{ product.category }}</NuxtLink>
      </div>
      <span class="template-post-pill">{{ product.category }}</span>
      <h1 class="template-blog-title">{{ product.title }}</h1>
      <p class="template-blog-description">{{ product.description }}</p>
    </header>

    <div class="container product-detail-layout">
      <div class="product-detail-main">
        <div class="product-cover-image">
          <img :src="product.coverImage" :alt="product.title" />
        </div>

        <div v-if="product.previewImages && product.previewImages.length" class="product-preview-images">
          <img v-for="(img, idx) in product.previewImages" :key="idx" :src="img" :alt="`Preview ${idx + 1}`" />
        </div>

        <div v-if="product.blocks && product.blocks.length" class="product-blocks">
          <BlockRenderer :blocks="product.blocks" />
        </div>
      </div>

      <aside class="product-detail-sidebar">
        <div class="product-purchase-card section-card">
          <div class="product-price-display">
            <span v-if="product.isFree" class="product-price-large is-free">Free</span>
            <span v-else class="product-price-large">${{ product.price.toFixed(2) }}</span>
          </div>

          <a :href="product.downloadUrl" class="btn btn-primary product-download-btn">
            {{ product.isFree ? 'Download Free' : 'Purchase & Download' }}
          </a>

          <div class="product-stats">
            <div class="product-stat">
              <span class="product-stat-label">Downloads</span>
              <span class="product-stat-value">{{ product.downloadCount.toLocaleString() }}</span>
            </div>
            <div class="product-stat">
              <span class="product-stat-label">Released</span>
              <span class="product-stat-value">{{ new Date(product.createdAt).toLocaleDateString() }}</span>
            </div>
            <div class="product-stat">
              <span class="product-stat-label">Updated</span>
              <span class="product-stat-value">{{ new Date(product.updatedAt).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>

        <div class="product-author-card section-card">
          <div class="product-author-label">Author</div>
          <a :href="product.authorUrl" class="product-author-link">{{ product.author }}</a>
        </div>

        <div v-if="product.tags && product.tags.length" class="product-tags-card section-card">
          <div class="product-tags-label">Tags</div>
          <div class="tag-list">
            <span v-for="tag in product.tags" :key="tag" class="tag-chip">{{ tag }}</span>
          </div>
        </div>
      </aside>
    </div>
  </article>
</template>
