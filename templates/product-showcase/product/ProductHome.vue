<script setup lang="ts">
import type { BlogCategory, Product, SiteConfig } from '~/types'
import '~/templates/product-showcase/template.css'

const props = defineProps<{
  site: SiteConfig
  locale?: string
  defaultLocale?: string
  categories: BlogCategory[]
  products: Product[]
  sections: Array<{ category: BlogCategory; products: Product[] }>
}>()

const p = (path: string) =>
  props.locale && props.locale !== props.defaultLocale ? `/${props.locale}${path}` : path

const formatPrice = (product: Product) => product.isFree ? 'Free' : `$${product.price.toFixed(0)}`
const productPath = (product: Product) => p(`/products/${product.categoryMeta?.slug || 'general'}/${product.slug}`)
const featuredProducts = computed(() => props.products.slice(0, 3))
const totalDownloads = computed(() => props.products.reduce((sum, product) => sum + product.downloadCount, 0))
</script>

<template>
  <div class="product-showcase-catalog">
    <section class="product-showcase-hero">
      <div class="container product-showcase-hero-grid">
        <div class="product-showcase-hero-copy">
          <div class="product-showcase-kicker">Curated product stack</div>
          <h1>{{ site.name }} product picks for faster launches</h1>
          <p>
            Browse focused product resources, compare categories, and continue to the external seller page when you are ready.
          </p>
          <div class="product-showcase-hero-actions">
            <NuxtLink :to="p('/products')" class="product-showcase-button product-showcase-button-primary">
              View catalog
            </NuxtLink>
            <a
              v-if="site.contactEmail"
              :href="`mailto:${site.contactEmail}`"
              class="product-showcase-button product-showcase-button-secondary"
            >
              Ask for advice
            </a>
          </div>
        </div>

        <div class="product-showcase-hero-panel" aria-label="Catalog stats">
          <div>
            <span>{{ products.length }}</span>
            <small>Products</small>
          </div>
          <div>
            <span>{{ categories.length }}</span>
            <small>Categories</small>
          </div>
          <div>
            <span>{{ totalDownloads.toLocaleString('en-US') }}</span>
            <small>Buyer signals</small>
          </div>
        </div>
      </div>
    </section>

    <section class="container product-showcase-section" v-if="categories.length">
      <div class="product-showcase-section-head">
        <div>
          <p class="product-showcase-eyebrow">Categories</p>
          <h2>Choose by buying intent</h2>
        </div>
      </div>

      <div class="product-showcase-category-strip">
        <NuxtLink
          v-for="category in categories"
          :key="category.slug"
          :to="p(`/products/${category.slug}`)"
          class="product-showcase-category-pill"
        >
          <span>{{ category.label }}</span>
          <small>{{ category.description }}</small>
        </NuxtLink>
      </div>
    </section>

    <section class="container product-showcase-section" v-if="featuredProducts.length">
      <div class="product-showcase-section-head">
        <div>
          <p class="product-showcase-eyebrow">Featured</p>
          <h2>Useful starting points</h2>
        </div>
      </div>

      <div class="product-showcase-grid">
        <article v-for="product in featuredProducts" :key="product.slug" class="product-showcase-card">
          <NuxtLink :to="productPath(product)" class="product-showcase-card-media">
            <img :src="product.coverImage" :alt="product.title">
          </NuxtLink>
          <div class="product-showcase-card-body">
            <div class="product-showcase-card-meta">
              <span>{{ product.categoryMeta?.label || product.category }}</span>
              <strong>{{ formatPrice(product) }}</strong>
            </div>
            <h3>
              <NuxtLink :to="productPath(product)">{{ product.title }}</NuxtLink>
            </h3>
            <p>{{ product.description }}</p>
            <div class="product-showcase-card-footer">
              <span>{{ product.downloadCount.toLocaleString('en-US') }} signals</span>
              <NuxtLink :to="productPath(product)">Details</NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section
      v-for="section in sections"
      :key="section.category.slug"
      class="container product-showcase-section"
    >
      <div class="product-showcase-section-head">
        <div>
          <p class="product-showcase-eyebrow">{{ section.category.label }}</p>
          <h2>{{ section.category.listTitle }}</h2>
          <p>{{ section.category.description }}</p>
        </div>
        <NuxtLink :to="p(`/products/${section.category.slug}`)" class="product-showcase-text-link">
          View all
        </NuxtLink>
      </div>

      <div class="product-showcase-list">
        <article v-for="product in section.products" :key="product.slug" class="product-showcase-row">
          <img :src="product.coverImage" :alt="product.title">
          <div>
            <h3><NuxtLink :to="productPath(product)">{{ product.title }}</NuxtLink></h3>
            <p>{{ product.description }}</p>
          </div>
          <div class="product-showcase-row-action">
            <strong>{{ formatPrice(product) }}</strong>
            <NuxtLink :to="productPath(product)">Review</NuxtLink>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
