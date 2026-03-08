<script setup lang="ts">
import type { FeatureGridBlock } from '~/types'

defineProps<{ block: FeatureGridBlock }>()
</script>

<template>
  <section class="container section-card feature-grid">
    <h2 class="section-heading">{{ block.title }}</h2>
    <p v-if="block.description" class="section-lead">{{ block.description }}</p>

    <div class="grid-3">
      <article v-for="item in block.items" :key="item.title" class="feature-item">
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </article>
    </div>
  </section>
</template>
