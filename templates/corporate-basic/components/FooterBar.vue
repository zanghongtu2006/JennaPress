<script setup lang="ts">
import type { SiteConfig } from '~/types'
import OpenSourceFooterAttribution from '~/components/shared/OpenSourceFooterAttribution.vue'

defineProps<{ site: SiteConfig }>()
</script>

<template>
  <footer class="template-corporate-basic-footer">
    <div class="container template-corporate-basic-footer-inner">
      <div class="template-corporate-basic-footer-private">
        <div>
          <strong>{{ site.name }}</strong>
          <div>{{ site.footerText }}</div>
        </div>

        <div v-if="site.contactEmail">
          Contact: <a :href="`mailto:${site.contactEmail}`">{{ site.contactEmail }}</a>
        </div>
      </div>

      <div class="template-corporate-basic-footer-public">
        <OpenSourceFooterAttribution />
      </div>
    </div>
  </footer>
</template>
