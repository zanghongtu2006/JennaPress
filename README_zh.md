# JennaPress\n\n[![Website](https://img.shields.io/badge/Website-www.jennapress.com-blue)](https://www.jennapress.com)\n
![Project Name](https://img.shields.io/badge/Project-JennaPress-8A2BE2?style=for-the-badge)
![Framework](https://img.shields.io/badge/Framework-Nuxt_3-00DC82?style=for-the-badge&logo=nuxt.js)
![Strategy](https://img.shields.io/badge/Strategy-Static_First-blue?style=for-the-badge)
![Design](https://img.shields.io/badge/Design-Template_Driven-FF69B4?style=for-the-badge)

本代码由提示词工程（Prompt Engineering）与 ChatGPT AI 编程助手共同实现。

JennaPress 是一个轻量级、静态优先的 Nuxt CMS 起步工程，适合公司官网、落地页、分类内容站，以及需要通过切换模板来快速适配不同业务外观的网站。

本工程的核心目标很明确：

- 未来使用者主要修改 `content/*`
- 未来使用者主要修改 `templates/*`
- 路由层和数据读取层尽量保持稳定
- 不同 `category` 对应不同模块模板，并通过配置维护，而不是写死在页面里

本开源项目附带TEMPLATE_PROMPT，可以使用AI 辅助，简单一键生成符合要求的模板模块

---

## 1. 这个工程适合做什么

这个工程适合下列场景：

- 公司官网
- SaaS 落地页
- 产品展示站
- 活动 / Campaign 页面
- 内容营销型官网
- 简单的多模块 CMS 网站

整个系统是静态优先的：

- 内容使用 Markdown
- 站点配置使用 Markdown
- 模板通过配置切换
- blog 的 category 可以映射到不同模块模板
- `public/template-assets` 用于存放模板自己的公共静态资源

这样可以保持部署简单，也很适合静态托管。

---

## 2. 核心设计思想

这个 CMS 主要有两个可编辑层：

### A. 内容层
用户主要在以下位置提供和更新内容：

- `content/site.md`
- `content/pages/*.md`
- `content/posts/*.md`

### B. 模板层
用户主要在以下位置控制样式和模块渲染方式：

- `templates/<template-name>/*`
- `public/template-assets/<template-name>/*`

框架层代码应尽量保持不变。

---

## 3. 工程结构

```text
content/
  site.md
  pages/
    *.md
  posts/
    *.md

pages/
  index.vue
  [...slug].vue
  blog/
    index.vue
    [category]/
      index.vue
      [slug].vue

server/
  api/
    site/
    pages/
    posts/
  utils/
    content.ts

templates/
  corporate-basic/
    TemplateShell.vue
    blog/
      blog.config.ts
      BlogHome.vue
      BlogCategory.vue
      BlogPost.vue
      modules/
        DefaultCategory.vue
        DefaultPost.vue
        CasesCategory.vue
        ...
  saas-landing/
    ...

public/
  template-assets/
    corporate-basic/
    saas-landing/
```

---

## 4. 路由规则

本工程有意保持路由简单。

### 普通页面
- `/` -> 首页，或者来自 `content/pages` 的首页内容
- `/<slug>` -> 普通内容页

### Blog 页面
- `/blog` -> blog 首页
- `/blog/:category` -> 某个分类页
- `/blog/:category/:slug` -> 某篇文章详情页

本工程**没有** `/blog/:slug` 这一层。

这是刻意设计：每篇 blog 文章都必须属于一个 category。

---

## 5. 内容规则

## 5.1 `content/site.md`

这个文件保存站点级配置。

典型字段如下：

```yaml
title: "Nuxt Site Kit"
description: "A static-first CMS starter"
defaultTemplate: "corporate-basic"
siteUrl: "https://example.com"
```

### 重要说明
`defaultTemplate` 用来决定当前启用哪个模板目录。

例如你改成：

```yaml
defaultTemplate: "saas-landing"
```

那么系统会使用：

```text
templates/saas-landing/
public/template-assets/saas-landing/
```

来渲染站点。

---

## 5.2 `content/pages/*.md`

这里放普通站点页面。

典型 front matter 示例：

```yaml
slug: "about"
title: "About"
summary: "About our team and business"
publishedAt: "2026-03-08"
seo:
  title: "About | Example"
  description: "Learn more about our company"
```

---

## 5.3 `content/posts/*.md`

这里放 blog 文章。

典型 front matter 示例：

```yaml
slug: "acme-rollout"
title: "ACME rollout case"
summary: "How ACME improved delivery speed"
category: "cases"
publishedAt: "2026-03-08"
seo:
  title: "ACME rollout case | Example"
  description: "A customer case about delivery improvement"
```

### 必须遵守的规则
每篇文章都必须有 `category`。

本工程假设：

- `category` 用来组织内容
- `category` 也用来选择模块模板

---

## 6. category 驱动的模块模板

这是本 CMS 最关键的规则之一。

blog 的 `category` 不只是一个分类字段，  
它同时也是一个**模块模板选择器**。

例如：

- `cases` -> 案例模块模板
- `products` -> 产品模块模板
- `events` -> 活动模块模板

这样一来，不同分类页虽然都在 `/blog` 路由体系下，但它们实际上可以表现成不同模块。

---

## 7. category 到模板的映射配置放在哪里

映射关系由当前模板自己维护。

每个模板都使用：

```text
templates/<template-name>/blog/blog.config.ts
```

例如结构可以是：

```ts
import BlogHome from './BlogHome.vue'
import DefaultCategory from './modules/DefaultCategory.vue'
import DefaultPost from './modules/DefaultPost.vue'
import CasesCategory from './modules/CasesCategory.vue'
import EventsCategory from './modules/EventsCategory.vue'

export default {
  home: BlogHome,
  categoryTemplates: {
    default: DefaultCategory,
    cases: CasesCategory,
    events: EventsCategory,
    products: DefaultCategory
  },
  postTemplates: {
    default: DefaultPost,
    cases: DefaultPost,
    events: DefaultPost,
    products: DefaultPost
  }
}
```

### 含义说明

- `categoryTemplates` 控制 `/blog/:category`
- `postTemplates` 控制 `/blog/:category/:slug`

如果某个分类没有显式配置，系统应该自动回退到 `default`。

---

## 8. 推荐的模块组织方式

在每个模板内部，blog 模块应尽量简单、明确。

推荐结构如下：

```text
templates/<template-name>/blog/
  blog.config.ts
  BlogHome.vue
  BlogCategory.vue
  BlogPost.vue
  modules/
    DefaultCategory.vue
    DefaultPost.vue
    CasesCategory.vue
    EventsCategory.vue
    ProductsCategory.vue
    ProductsPost.vue
```

### 推荐规则
不要把大量 `if (category === ...)` 判断塞进一个大组件里。

而应该这样做：

- 每个模块类型单独写一个组件
- 在 `blog.config.ts` 里注册它
- 通用包装组件只负责按配置解析并渲染

这样后期维护会清晰很多。

---

## 9. 模板切换机制

模板切换由 `content/site.md` 控制。

例如：

```yaml
defaultTemplate: "corporate-basic"
```

如果改成：

```yaml
defaultTemplate: "saas-landing"
```

那么系统应该自动使用：

```text
templates/saas-landing/
```

中的渲染逻辑，以及：

```text
public/template-assets/saas-landing/
```

中的公共静态资源。

### 推荐边界
- `templates/*` = 组件结构和渲染规则
- `public/template-assets/*` = 图片、图标、背景资源、静态主题文件

---

## 10. 如何新增一个 category 模块

例如：新增 `news`

### 第一步
在当前启用模板中创建模块组件：

```text
templates/<template-name>/blog/modules/NewsCategory.vue
templates/<template-name>/blog/modules/NewsPost.vue
```

### 第二步
在 `blog.config.ts` 中注册：

```ts
categoryTemplates: {
  default: DefaultCategory,
  news: NewsCategory
},
postTemplates: {
  default: DefaultPost,
  news: NewsPost
}
```

### 第三步
在 `content/posts/*.md` 中添加内容：

```yaml
category: "news"
```

这样就够了。

**不需要改路由。**

---

## 11. 如何新增一个站点模板

例如：新增 `industrial-dark`

### 第一步
新建模板目录：

```text
templates/industrial-dark/
```

### 第二步
复制需要的壳层和 blog 文件：

```text
TemplateShell.vue
blog/
  blog.config.ts
  BlogHome.vue
  BlogCategory.vue
  BlogPost.vue
  modules/
```

### 第三步
补充静态资源：

```text
public/template-assets/industrial-dark/
```

### 第四步
在 `content/site.md` 中切换：

```yaml
defaultTemplate: "industrial-dark"
```

---

## 12. 未来使用者通常需要改哪些地方

大多数未来使用者应该只需要改这些位置。

### 内容编辑者
- `content/site.md`
- `content/pages/*.md`
- `content/posts/*.md`

### 模板设计者
- `templates/<template-name>/*`
- `public/template-assets/<template-name>/*`

### 一般不需要动
- `pages/*`
- `server/api/*`
- `server/utils/*`

这些应该尽量作为稳定的框架层代码保留。

---

## 13. YAML front matter 编写规则

编辑 Markdown 的 front matter 时，只要值中包含以下内容，建议加引号：

- `:`
- 较长 SEO 文案
- 类似日期的字符串
- 特殊标点

例如：

```yaml
seo:
  title: "Why static corporate sites are a strong default | Example"
  description: "This is exactly the product direction the demo is validating: static-first, template-driven, and narrow by design."
```

这样可以避免 YAML 解析错误。

---

## 14. 文章字段建议

推荐文章至少包含这些字段：

```yaml
slug: "string"
title: "string"
summary: "string"
category: "cases"
publishedAt: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"
coverImage: "/template-assets/..."
seo:
  title: "string"
  description: "string"
```

### 推荐规则
`category` 应保持稳定，并统一用小写。

例如：

- `cases`
- `products`
- `events`
- `news`

不要混用：

- `Cases`
- `case`
- `CASES`

请选定一个规范 slug 并持续使用。

---

## 15. 最简单的维护流程

### 只改内容
修改 `content/` 下的 Markdown 文件

### 只改视觉样式
修改 `templates/<template-name>/` 和 `public/template-assets/<template-name>/`

### 改某个 category 的页面风格
在：

```text
templates/<template-name>/blog/modules/
```

中新增或修改模块组件，然后更新：

```text
templates/<template-name>/blog/blog.config.ts
```

---

## 16. 本工程的设计目标总结

这个工程是有明确取向的：

- 静态优先
- 内容 Markdown 化
- 模板驱动渲染
- blog 模块按 category 分发
- 路由稳定
- 后端逻辑最小化
- 未来使用者主要编辑 `content` 和 `templates`

这就是本 CMS 的预期使用模型。

---

## 17. 新用户建议的修改顺序

如果你是第一次使用这个工程，建议按下面顺序进行：

1. 修改 `content/site.md`
2. 选择或切换 `defaultTemplate`
3. 上传资源到 `public/template-assets/<template-name>/`
4. 修改 `content/pages/*.md`
5. 修改 `content/posts/*.md`
6. 如有需要，在 `templates/<template-name>/blog/modules/` 中新增分类模块
7. 在 `templates/<template-name>/blog/blog.config.ts` 中注册模块映射

---

## 18. 最后说明

这个项目的目标是保持简单。

如果你发现自己在日常内容维护时，经常需要去改路由文件或服务端 API 文件，通常说明应该继续优化内容抽象或模板抽象，而不是继续堆业务逻辑到框架层。
