<script setup lang="ts">
import { computed } from 'vue'
import type { BlogCategory, BlogPostContent, BlogPostSummary, SiteConfig } from '~/types'
import { resolveBlogComponent } from '~/lib/template-registry'

const props = defineProps<{
  template: string
  site: SiteConfig
  mode: 'home' | 'category' | 'post'
  locale?: string
  defaultLocale?: string
  categories?: BlogCategory[]
  category?: BlogCategory | null
  posts?: BlogPostSummary[]
  sections?: Array<{ category: BlogCategory; posts: BlogPostSummary[] }>
  post?: BlogPostContent | null
}>()

const activeComponent = computed(() => resolveBlogComponent(props.template || 'corporate-basic', props.mode))
</script>

<template>
  <component
    :is="activeComponent"
    :site="site"
    :locale="locale"
    :defaultLocale="defaultLocale"
    :categories="categories || []"
    :category="category || null"
    :posts="posts || []"
    :sections="sections || []"
    :post="post || null"
  />
</template>
