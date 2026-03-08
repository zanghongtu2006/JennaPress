<script setup lang="ts">
import { computed } from 'vue'
import type { PageContent } from '~/types'
import TemplateCorporateBasic from '~/templates/corporate-basic/Template.vue'
import TemplateSaasLanding from '~/templates/saas-landing/Template.vue'

const props = defineProps<{
  template: string
  page: PageContent
}>()

const templateMap = {
  'corporate-basic': TemplateCorporateBasic,
  'saas-landing': TemplateSaasLanding
} as const

const activeTemplate = computed(() => {
  const name = props.template || 'corporate-basic'
  return templateMap[name as keyof typeof templateMap] || templateMap['corporate-basic']
})
</script>

<template>
  <component :is="activeTemplate" :page="page" />
</template>
