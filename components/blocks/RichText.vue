<script setup lang="ts">
import type { RichTextBlock } from '~/types'

defineProps<{ block: RichTextBlock }>()
</script>

<template>
  <section class="container section-card rich-text-block">
    <h2 v-if="block.title" class="section-heading">{{ block.title }}</h2>
    <div class="rich-text" v-html="block.html" />
  </section>
</template>
