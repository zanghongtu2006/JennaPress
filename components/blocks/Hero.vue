<script setup lang="ts">
import type { HeroBlock } from '~/types'

defineProps<{ block: HeroBlock }>()
</script>

<template>
  <section class="container section-card hero">
    <div class="hero-copy">
      <div v-if="block.kicker" class="hero-kicker">{{ block.kicker }}</div>
      <h1>{{ block.title }}</h1>
      <p>{{ block.description }}</p>

      <div class="hero-actions">
        <NuxtLink v-if="block.primaryAction" :to="block.primaryAction.to" class="btn btn-primary">
          {{ block.primaryAction.label }}
        </NuxtLink>
        <NuxtLink v-if="block.secondaryAction" :to="block.secondaryAction.to" class="btn btn-secondary">
          {{ block.secondaryAction.label }}
        </NuxtLink>
      </div>
    </div>

    <div class="hero-visual">
      <div class="hero-panel" v-if="block.panelTitle || block.panelLines?.length">
        <strong>{{ block.panelTitle }}</strong>
        <ul>
          <li v-for="line in block.panelLines || []" :key="line">{{ line }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
