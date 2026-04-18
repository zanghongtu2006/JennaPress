<script setup lang="ts">
import type { BlogCategory, Product, SiteConfig } from '~/types'

const props = defineProps<{ site: SiteConfig; product: Product | null; category: BlogCategory | null; locale?: string; defaultLocale?: string }>()

const p = (path: string) =>
  (props.locale && props.locale !== props.defaultLocale) ? ('/' + props.locale + path) : path
</script>


<template>
  <article v-if="product" class="page-stack template-blog template-blog-corporate">
    <header class="container section-card template-post-hero" :class="category ? `is-${category.slug}` : ''">
      <div class="template-breadcrumbs">
        <NuxtLink :to="p('/products')">Products</NuxtLink>
        <span>/</span>
        <NuxtLink :to="p(`/products/${category?.slug}`)">{{ category?.label || 'All' }}</NuxtLink>
      </div>
      <div class="template-post-top">
        <span v-if="category" class="template-post-pill">{{ category.label }}</span>
        <span class="template-post-date">{{ new Date(product.createdAt).toLocaleDateString('en-CA') }}</span>
      </div>
      <h1 class="template-blog-title">{{ product.title }}</h1>
      <p class="template-blog-description">{{ product.description }}</p>
      
      <div class="template-product-detail">
        <div class="template-product-price-large">
          <span v-if="product.isFree" class="price-free price-large">Free</span>
          <span v-else class="price-value price-large">${{ product.price.toFixed(2) }}</span>
        </div>
        
        <a :href="product.downloadUrl" class="btn btn-primary template-product-download">
          {{ product.isFree ? 'Download Free' : 'Purchase & Download' }}
        </a>
        
        <div class="template-product-stats">
          <span>{{ product.downloadCount.toLocaleString() }} downloads</span>
        </div>
      </div>
      
      <div v-if="product.tags?.length" class="tag-list"><span v-for="tag in product.tags" :key="tag" class="tag-chip">{{ tag }}</span></div>
    </header>
    
    <div v-if="product.coverImage" class="container">
      <div class="template-product-cover">
        <img :src="product.coverImage" :alt="product.title" class="cover-image" />
      </div>
    </div>
    
    <div class="container">
      <div class="template-product-author">
        <div class="author-info">
          <span class="author-label">Author:</span>
          <a :href="product.authorUrl" target="_blank" rel="noopener" class="author-name">{{ product.author }}</a>
        </div>
      </div>
    </div>
    
    <div v-if="product.blocks?.length" class="container">
      <BlockRenderer :blocks="product.blocks" />
    </div>
  </article>
</template>

<style scoped>
.template-product-detail {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  margin: 1.5rem 0;
}

.template-product-price-large {
  margin-bottom: 0.5rem;
}

.price-large {
  font-size: 2rem;
  font-weight: 700;
}

.template-product-download {
  padding: 0.75rem 2rem;
  font-size: 1.125rem;
}

.template-product-stats {
  font-size: 0.875rem;
  color: #6b7280;
}

.template-product-cover {
  margin: 2rem 0;
}

.cover-image {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.template-product-author {
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  margin: 1rem 0 2rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-label {
  color: #6b7280;
}

.author-name {
  font-weight: 600;
  color: #3b82f6;
  text-decoration: none;
}

.author-name:hover {
  text-decoration: underline;
}
</style>
