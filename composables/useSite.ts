import type { SiteConfig } from '~/types'

export async function useSite() {
  return await useAsyncData<SiteConfig>(
    'site-config',
    () => $fetch('/api/site'),
    {
      getCachedData: () => undefined
    }
  )
}
