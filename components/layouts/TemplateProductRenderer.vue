<script setup lang="ts">
import { computed } from 'vue'
import type { BlogCategory, Product, SiteConfig } from '~/types'
import { resolveProductComponent } from '~/lib/template-registry'

const props = defineProps<{
  template: string
  site: SiteConfig
  mode: 'home' | 'category' | 'product'
  locale?: string
  defaultLocale?: string
  categories?: BlogCategory[]
  category?: BlogCategory | null
  products?: Product[]
  sections?: Array<{ category: BlogCategory; products: Product[] }>
  product?: Product | null
}>()

const activeComponent = computed(() => resolveProductComponent(props.template || 'corporate-basic', props.mode))

// Fallback when template doesn't provide a product component for this mode
const showFallback = computed(() => !activeComponent.value)
</script>

<template>
  <!-- Fallback: render a minimal generic product display when template has no dedicated product component -->
  <div v-if="showFallback" class="product-fallback container mx-auto px-4 py-8">
    <template v-if="mode === 'home' && products?.length">
      <h1 class="text-3xl font-bold mb-6">Products</h1>
      <div v-for="section in sections" :key="section.category.key" class="mb-8">
        <h2 class="text-xl font-semibold mb-4">{{ section.category.label }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="product in section.products"
            :key="product.slug"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <img v-if="product.coverImage" :src="product.coverImage" :alt="product.title" class="w-full aspect-video object-cover rounded mb-3">
            <h3 class="font-semibold">{{ product.title }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ product.description }}</p>
            <NuxtLink
              :to="`/products/${product.categoryMeta.slug}/${product.slug}`"
              class="inline-block mt-2 text-primary hover:underline text-sm"
            >
              View Details →
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="mode === 'category' && category">
      <h1 class="text-3xl font-bold mb-6">{{ category.label }}</h1>
      <p v-if="category.description" class="text-gray-600 mb-6">{{ category.description }}</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="product in products"
          :key="product.slug"
          class="border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <img v-if="product.coverImage" :src="product.coverImage" :alt="product.title" class="w-full aspect-video object-cover rounded mb-3">
          <h3 class="font-semibold">{{ product.title }}</h3>
          <p class="text-sm text-gray-600 mt-1">{{ product.description }}</p>
          <NuxtLink
            :to="`/products/${product.categoryMeta.slug}/${product.slug}`"
            class="inline-block mt-2 text-primary hover:underline text-sm"
          >
            View Details →
          </NuxtLink>
        </div>
      </div>
    </template>

    <template v-else-if="mode === 'product' && product">
      <div class="max-w-4xl mx-auto">
        <NuxtLink to="/products" class="text-primary hover:underline text-sm mb-4 inline-block">← Back to Products</NuxtLink>
        <div v-if="category" class="mb-2 text-sm text-gray-500">
          <NuxtLink :to="`/products/${category.slug}`" class="hover:underline">{{ category.label }}</NuxtLink>
        </div>
        <h1 class="text-3xl font-bold mb-4">{{ product.title }}</h1>
        <img v-if="product.coverImage" :src="product.coverImage" :alt="product.title" class="w-full max-h-96 object-cover rounded-lg mb-6">
        <p class="text-gray-600 mb-6">{{ product.description }}</p>
        <div class="flex gap-4 items-center">
          <span class="text-2xl font-bold">{{ product.isFree ? 'Free' : `$${product.price}` }}</span>
          <a v-if="product.downloadUrl" :href="product.downloadUrl" class="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
            {{ product.isFree ? 'Download Free' : 'Purchase' }}
          </a>
        </div>
      </div>
    </template>

    <template v-else>
      <p class="text-gray-500">No products available.</p>
    </template>
  </div>

  <component
    v-else
    :is="activeComponent"
    :site="site"
    :locale="locale"
    :defaultLocale="defaultLocale"
    :categories="categories || []"
    :category="category || null"
    :products="products || []"
    :sections="sections || []"
    :product="product || null"
  />
</template>
