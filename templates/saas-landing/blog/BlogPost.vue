<script setup lang="ts">
import { computed } from 'vue'
import type { BlogPostContent, SiteConfig } from '~/types'
import blogConfig from './blog.config'

const props = defineProps<{ site: SiteConfig; post: BlogPostContent | null }>()

const activeComponent = computed(() => {
  const key = props.post?.categoryMeta.accent || 'default'
  return blogConfig.postTemplates[key as keyof typeof blogConfig.postTemplates] || blogConfig.postTemplates.default
})
</script>

<template>
  <component :is="activeComponent" :site="site" :post="post" />
</template>
