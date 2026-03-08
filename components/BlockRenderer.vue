<script setup lang="ts">
import type { Block } from '~/types'

const props = defineProps<{
  blocks: Block[]
}>()

const blockMap = {
  hero: resolveComponent('BlocksHero'),
  'feature-grid': resolveComponent('BlocksFeatureGrid'),
  'rich-text': resolveComponent('BlocksRichText'),
  'cta-banner': resolveComponent('BlocksCtaBanner'),
  stats: resolveComponent('BlocksStats'),
  contact: resolveComponent('BlocksContact')
} as const

function getComponent(type: Block['type']) {
  return blockMap[type]
}
</script>

<template>
  <div class="page-stack">
    <component
      :is="getComponent(block.type)"
      v-for="(block, index) in props.blocks"
      :key="`${block.type}-${index}`"
      :block="block"
    />
  </div>
</template>
