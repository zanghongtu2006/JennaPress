<script setup lang="ts">
import type { ContactBlock } from '~/types'

defineProps<{ block: ContactBlock }>()
</script>

<template>
  <section class="container section-card contact-panel">
    <h2 class="section-heading">{{ block.title }}</h2>
    <p v-if="block.description" class="section-lead">{{ block.description }}</p>

    <div class="contact-list">
      <div v-if="block.email">Email: <a :href="`mailto:${block.email}`">{{ block.email }}</a></div>
      <div v-if="block.phone">Phone: {{ block.phone }}</div>
      <div v-if="block.address">Address: {{ block.address }}</div>
    </div>
  </section>
</template>
