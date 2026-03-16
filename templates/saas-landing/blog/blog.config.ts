import BlogHome from './BlogHome.vue'
import DefaultCategory from './modules/DefaultCategory.vue'
import CasesCategory from './modules/CasesCategory.vue'
import DefaultPost from './modules/DefaultPost.vue'

export default {
  home: BlogHome,
  categoryTemplates: {
    default: DefaultCategory,
    'case-study': CasesCategory,
    'product-note': DefaultCategory,
    'event-promo': DefaultCategory
  },
  postTemplates: {
    default: DefaultPost,
    'case-study': DefaultPost,
    'product-note': DefaultPost,
    'event-promo': DefaultPost
  }
}
