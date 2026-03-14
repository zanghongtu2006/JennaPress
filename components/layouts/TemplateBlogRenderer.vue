<script setup lang="ts">
import { computed } from 'vue'
import type { BlogCategory, BlogPostContent, BlogPostSummary, SiteConfig } from '~/types'
import CorporateBasicBlogHome from '~/templates/corporate-basic/blog/BlogHome.vue'
import CorporateBasicBlogCategory from '~/templates/corporate-basic/blog/BlogCategory.vue'
import CorporateBasicBlogPost from '~/templates/corporate-basic/blog/BlogPost.vue'
import SaasLandingBlogHome from '~/templates/saas-landing/blog/BlogHome.vue'
import SaasLandingBlogCategory from '~/templates/saas-landing/blog/BlogCategory.vue'
import SaasLandingBlogPost from '~/templates/saas-landing/blog/BlogPost.vue'

const props = defineProps<{
  template: string
  site: SiteConfig
  mode: 'home' | 'category' | 'post'
  categories?: BlogCategory[]
  category?: BlogCategory | null
  posts?: BlogPostSummary[]
  sections?: Array<{ category: BlogCategory; posts: BlogPostSummary[] }>
  post?: BlogPostContent | null
}>()

const blogMap = {
  'corporate-basic': {
    home: CorporateBasicBlogHome,
    category: CorporateBasicBlogCategory,
    post: CorporateBasicBlogPost
  },
  'saas-landing': {
    home: SaasLandingBlogHome,
    category: SaasLandingBlogCategory,
    post: SaasLandingBlogPost
  }
} as const

const activeComponent = computed(() => {
  const name = props.template || 'corporate-basic'
  const resolved = blogMap[name as keyof typeof blogMap] || blogMap['corporate-basic']
  return resolved[props.mode]
})
</script>

<template>
  <component
    :is="activeComponent"
    :site="site"
    :categories="categories || []"
    :category="category || null"
    :posts="posts || []"
    :sections="sections || []"
    :post="post || null"
  />
</template>
