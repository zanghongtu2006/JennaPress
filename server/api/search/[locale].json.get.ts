import { getStaticSearchIndex } from '~/lib/static-content'

export default defineEventHandler((event) => {
  return getStaticSearchIndex(event.context.params?.locale)
})
