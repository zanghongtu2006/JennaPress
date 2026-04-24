<script setup lang="ts">
import type { BlogCategory, Product, SiteConfig } from '~/types'
import '~/templates/product-showcase/template.css'

const props = defineProps<{
  site: SiteConfig
  locale?: string
  defaultLocale?: string
  category: BlogCategory | null
  product: Product | null
}>()

const p = (path: string) =>
  props.locale && props.locale !== props.defaultLocale ? `/${props.locale}${path}` : path

const formatPrice = (product: Product) => product.isFree ? 'Free' : `$${product.price.toFixed(0)}`
</script>

<template>
  <article v-if="product" class="product-showcase-detail">
    <section class="product-showcase-detail-hero">
      <div class="container product-showcase-detail-grid">
        <div class="product-showcase-detail-copy">
          <div class="product-showcase-breadcrumbs">
            <NuxtLink :to="p('/products')">Catalog</NuxtLink>
            <span>/</span>
            <NuxtLink v-if="category" :to="p(`/products/${category.slug}`)">{{ category.label }}</NuxtLink>
          </div>
          <p class="product-showcase-eyebrow">{{ product.categoryMeta?.label || product.category }}</p>
          <h1>{{ product.title }}</h1>
          <p>{{ product.description }}</p>
          <div class="product-showcase-tags">
            <span v-for="tag in product.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>

        <aside class="product-showcase-buy-box">
          <div class="product-showcase-price">{{ formatPrice(product) }}</div>
          <a
            :href="product.downloadUrl"
            class="product-showcase-button product-showcase-button-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Continue to seller
          </a>
          <dl>
            <div>
              <dt>Signals</dt>
              <dd>{{ product.downloadCount.toLocaleString('en-US') }}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{{ product.updatedAt }}</dd>
            </div>
            <div>
              <dt>Author</dt>
              <dd><a :href="product.authorUrl" target="_blank" rel="noopener noreferrer">{{ product.author }}</a></dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>

    <section class="container product-showcase-detail-media">
      <img :src="product.coverImage" :alt="product.title">
    </section>

    <section v-if="product.previewImages.length" class="container product-showcase-preview-grid">
      <img v-for="image in product.previewImages" :key="image" :src="image" :alt="`${product.title} preview`">
    </section>

    <section v-if="product.blocks?.length" class="product-showcase-detail-blocks">
      <BlockRenderer :blocks="product.blocks" />
    </section>
  </article>
</template>
