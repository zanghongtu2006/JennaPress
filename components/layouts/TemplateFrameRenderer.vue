<script setup lang="ts">
import { computed } from 'vue'
import type { SiteConfig } from '~/types'
import CorporateBasicFrame from '~/templates/corporate-basic/Frame.vue'
import SaasLandingFrame from '~/templates/saas-landing/Frame.vue'

const props = defineProps<{
  template: string
  site: SiteConfig
}>()

const frameMap = {
  'corporate-basic': CorporateBasicFrame,
  'saas-landing': SaasLandingFrame
} as const

const activeFrame = computed(() => {
  const name = props.template || 'corporate-basic'
  return frameMap[name as keyof typeof frameMap] || frameMap['corporate-basic']
})
</script>

<template>
  <component :is="activeFrame" :site="site">
    <slot />
  </component>
</template>
