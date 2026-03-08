import { getBlogCategories } from '~/server/utils/content'

export default defineEventHandler(() => getBlogCategories())
