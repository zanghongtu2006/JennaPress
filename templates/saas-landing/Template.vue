<script setup lang="ts">
import type { PageContent } from '~/types'
import '~/templates/saas-landing/template.css'
import StageBackground from '~/templates/saas-landing/components/StageBackground.vue'
import StageIntro from '~/templates/saas-landing/components/StageIntro.vue'
import BodyChips from '~/templates/saas-landing/components/BodyChips.vue'

const props = defineProps<{ page: PageContent }>()

const heroBlocks = computed(() => props.page.blocks.slice(0, 1))
const bodyBlocks = computed(() => props.page.blocks.slice(1))
</script>

<template>
  <div class="template-saas-landing">
    <section class="saas-stage">
      <StageBackground />
      <StageIntro />

      <div class="saas-hero-shell">
        <BlockRenderer :blocks="heroBlocks" />
      </div>
    </section>

    <section class="saas-body-shell" v-if="bodyBlocks.length > 0">
      <BodyChips />
      <BlockRenderer :blocks="bodyBlocks" />
    </section>
  </div>
</template>
