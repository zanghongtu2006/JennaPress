<script setup lang="ts">
import type { PageContent } from '~/types'
import '~/templates/product-showcase/template.css'

const props = defineProps<{ page: PageContent }>()

const heroBlocks = computed(() => props.page.blocks.filter(block => block.type === 'hero').slice(0, 1))
const bodyBlocks = computed(() => props.page.blocks.filter((block, index) => !(index === 0 && block.type === 'hero')))
</script>

<template>
  <div class="product-showcase-page">
    <section v-if="heroBlocks.length" class="product-showcase-hero-band">
      <BlockRenderer :blocks="heroBlocks" />
    </section>

    <section class="product-showcase-page-body">
      <BlockRenderer :blocks="bodyBlocks" />
    </section>
  </div>
</template>
