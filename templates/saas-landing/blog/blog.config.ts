import BlogHome from './BlogHome.vue'
import DefaultCategory from './modules/DefaultCategory.vue'
import CasesCategory from './modules/CasesCategory.vue'
import DefaultPost from './modules/DefaultPost.vue'

export default {
  home: BlogHome,
  categoryTemplates: {
    default: DefaultCategory,
    cases: CasesCategory,
    products: DefaultCategory,
    events: DefaultCategory
  },
  postTemplates: {
    default: DefaultPost,
    cases: DefaultPost,
    products: DefaultPost,
    events: DefaultPost
  }
}
