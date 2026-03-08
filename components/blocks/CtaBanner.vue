<script setup lang="ts">
import type { CtaBannerBlock } from '~/types'

defineProps<{ block: CtaBannerBlock }>()
</script>

<template>
  <section class="container section-card cta-banner">
    <div>
      <h2 class="section-heading" style="margin-bottom: 10px">{{ block.title }}</h2>
      <div v-if="block.description" class="cta-copy">{{ block.description }}</div>
    </div>

    <NuxtLink :to="block.action.to" class="btn btn-primary">
      {{ block.action.label }}
    </NuxtLink>
  </section>
</template>
