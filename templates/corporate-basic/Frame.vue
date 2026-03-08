<script setup lang="ts">
import type { SiteConfig } from '~/types'
import '~/templates/corporate-basic/template.css'
import HeaderBar from '~/templates/corporate-basic/components/HeaderBar.vue'
import FooterBar from '~/templates/corporate-basic/components/FooterBar.vue'
import SectionRail from '~/templates/corporate-basic/components/SectionRail.vue'

defineProps<{ site: SiteConfig }>()
</script>

<template>
  <div class="template-corporate-basic-frame">
    <HeaderBar :site="site" />
    <SectionRail>
      <slot />
    </SectionRail>
    <FooterBar :site="site" />
  </div>
</template>
