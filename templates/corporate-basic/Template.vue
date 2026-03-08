<script setup lang="ts">
import type { PageContent } from '~/types'
import '~/templates/corporate-basic/template.css'
import PageSurface from '~/templates/corporate-basic/components/PageSurface.vue'

defineProps<{ page: PageContent }>()
</script>

<template>
  <PageSurface>
    <BlockRenderer :blocks="page.blocks" />
  </PageSurface>
</template>
