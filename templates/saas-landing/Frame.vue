<script setup lang="ts">
import type { SiteConfig } from '~/types'
import '~/templates/saas-landing/template.css'
import HeaderBar from '~/templates/saas-landing/components/HeaderBar.vue'
import FooterBar from '~/templates/saas-landing/components/FooterBar.vue'
import StageSection from '~/templates/saas-landing/components/StageSection.vue'

const props = defineProps<{ site: SiteConfig }>()

const { theme } = useTheme({
  themes: props.site.themes,
  defaultTheme: props.site.defaultTheme
})
</script>

<template>
  <div class="template-saas-frame" :data-theme="theme">
    <HeaderBar :site="site" />
    <StageSection>
      <slot />
    </StageSection>
    <FooterBar :site="site" />
  </div>
</template>
