<script setup lang="ts">

import { computed } from 'vue'

import type { BlogCategory, BlogPostSummary, SiteConfig } from '~/types'

import blogConfig from './blog.config'



const props = defineProps<{ site: SiteConfig; categories: BlogCategory[]; category: BlogCategory | null; posts: BlogPostSummary[] }>()



const activeComponent = computed(() => {

  const key = props.category?.accent || 'default'

  return blogConfig.categoryTemplates[key as keyof typeof blogConfig.categoryTemplates] || blogConfig.categoryTemplates.default

})

</script>



<template>

  <component
    :is="activeComponent"
    :site="site"
    :locale="locale"
    :defaultLocale="defaultLocale"
    :categories="categories"
    :category="category"
    :posts="posts"
  />

</template>

