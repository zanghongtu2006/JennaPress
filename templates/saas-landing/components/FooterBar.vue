<script setup lang="ts">
import type { SiteConfig } from '~/types'
import OpenSourceFooterAttribution from '~/components/shared/OpenSourceFooterAttribution.vue'

defineProps<{ site: SiteConfig }>()
</script>

<template>
  <footer class="template-saas-footer">
    <div class="container template-saas-footer-inner">
      <div class="template-saas-footer-private">
        <div>
          <strong>{{ site.name }}</strong>
          <div>{{ site.footerText }}</div>
        </div>

        <div v-if="site.contactEmail">
          Contact: <a :href="`mailto:${site.contactEmail}`">{{ site.contactEmail }}</a>
        </div>
      </div>

      <div class="template-saas-footer-public">
        <OpenSourceFooterAttribution />
      </div>
    </div>
  </footer>
</template>
