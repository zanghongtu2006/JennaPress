<script setup lang="ts">
import type { StatsBlock } from '~/types'

defineProps<{ block: StatsBlock }>()
</script>

<template>
  <section class="container section-card stats-grid">
    <h2 class="section-heading">{{ block.title }}</h2>
    <p v-if="block.description" class="section-lead">{{ block.description }}</p>

    <div class="stat-list">
      <article v-for="item in block.items" :key="`${item.label}-${item.value}`" class="stat-item">
        <div class="stat-value">{{ item.value }}</div>
        <div><strong>{{ item.label }}</strong></div>
        <div v-if="item.note" class="stat-note">{{ item.note }}</div>
      </article>
    </div>
  </section>
</template>
