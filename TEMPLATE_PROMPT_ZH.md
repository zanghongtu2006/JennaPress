# JennaPress 模板维护准则（中文）

本准则用于让 AI 新增、替换或维护 JennaPress 模板。JennaPress 允许通过 `templates/`、`content/`、`public/` 三个目录维护站点样式、内容和静态资源。模板任务必须严格停留在这三个目录内。

---

## 最高优先级边界

AI 在模板维护任务中只允许修改：

- `templates/<template-name>/**`
- `public/template-assets/<template-name>/**`
- `content/**`

AI 禁止修改：

- `components/**`
- `pages/**`
- `composables/**`
- `lib/**`
- `types/**`
- `assets/**`
- `nuxt.config.ts`
- `package.json`
- `package-lock.json`
- `.github/**`
- 根目录应用入口文件，例如 `app.vue`、`error.vue`
- 任何框架层路由、类型、schema、共享组件、构建配置或依赖配置

如果需求无法在允许目录内完成，AI 必须停止并说明需要框架开发介入。禁止为了完成模板效果而改框架目录。

---

## 模板能力边界

JennaPress 当前支持三类页面：

- `page`：企业页、首页、关于页、营销页
- `blog`：博客首页、分类页、文章详情页
- `product`：商品引流首页、分类页、商品详情页

商品站只做展示和引流，不做站内成交。模板可以展示价格、标签、作者、商品图、外部购买按钮，但不能实现购物车、支付、订单、登录、库存等逻辑。

---

## 标准模板目录

```text
templates/<template-name>/
  template.meta.json
  template.css
  Frame.vue
  Template.vue
  blog/
    BlogHome.vue
    BlogCategory.vue
    BlogPost.vue
    blog.config.ts
    modules/
      DefaultCategory.vue
      DefaultPost.vue
  product/
    ProductHome.vue
    ProductCategory.vue
    ProductDetail.vue
```

不是每个模板都必须同时支持 blog 和 product，但如果 `template.meta.json` 声明支持，就必须提供对应文件。

静态资源目录：

```text
public/template-assets/<template-name>/
  cover.svg
  product-image.webp
  preview.mp4
```

内容目录：

```text
content/
  site.md
  site.<locale>.md
  pages/**
  posts/**
  products/**
```

---

## `template.meta.json`

```json
{
  "name": "product-showcase",
  "version": "0.1.0",
  "label": "Product Showcase",
  "description": "A static product referral template.",
  "supportedPageTypes": ["page", "blog", "product"],
  "supportedBlocks": [
    "hero",
    "feature-grid",
    "rich-text",
    "cta-banner",
    "stats",
    "contact"
  ],
  "themes": ["light", "night"]
}
```

严格规则：

- `name` 必须等于模板目录名。
- `supportedPageTypes` 只能使用 `page`、`blog`、`product`。
- `supportedBlocks` 只能使用框架已注册 block。
- 不允许新增 block 类型。
- `themes` 必须能在 `template.css` 中找到对应样式。

---

## Frame 和 Page 模板

`Frame.vue` 是全站外壳，接收 `site: SiteConfig`。

```vue
<script setup lang="ts">
import type { SiteConfig } from '~/types'
import '~/templates/<template-name>/template.css'

defineProps<{ site: SiteConfig }>()
</script>

<template>
  <div class="template-<template-name>-frame">
    <header>...</header>
    <main>
      <slot />
    </main>
    <footer>...</footer>
  </div>
</template>
```

`Template.vue` 是普通 page 渲染器，接收 `page: PageContent`。

```vue
<script setup lang="ts">
import type { PageContent } from '~/types'
import '~/templates/<template-name>/template.css'

defineProps<{ page: PageContent }>()
</script>

<template>
  <div class="template-<template-name>">
    <BlockRenderer :blocks="page.blocks" />
  </div>
</template>
```

规则：

- 可以使用全局 `<BlockRenderer>`。
- 可以从 `~/types` 导入类型。
- 禁止从 `components/` 复制、移动或修改框架组件。
- 模板内的业务文案应来自 `content`，不要硬编码具体客户业务内容。

---

## Blog 模板契约

如果支持 blog，必须提供：

- `blog/BlogHome.vue`
- `blog/BlogCategory.vue`
- `blog/BlogPost.vue`

Props：

```ts
// BlogHome.vue
{
  site: SiteConfig
  categories: BlogCategory[]
  sections: Array<{ category: BlogCategory; posts: BlogPostSummary[] }>
  posts: BlogPostSummary[]
  locale?: string
  defaultLocale?: string
}

// BlogCategory.vue
{
  site: SiteConfig
  categories: BlogCategory[]
  category: BlogCategory | null
  posts: BlogPostSummary[]
  locale?: string
  defaultLocale?: string
}

// BlogPost.vue
{
  site: SiteConfig
  post: BlogPostContent | null
  locale?: string
  defaultLocale?: string
}
```

内部链接必须使用 locale helper：

```ts
const p = (path: string) =>
  props.locale && props.locale !== props.defaultLocale ? `/${props.locale}${path}` : path
```

---

## Product 模板契约

如果支持 product，必须提供：

- `product/ProductHome.vue`
- `product/ProductCategory.vue`
- `product/ProductDetail.vue`

Props：

```ts
// ProductHome.vue
{
  site: SiteConfig
  categories: BlogCategory[]
  products: Product[]
  sections: Array<{ category: BlogCategory; products: Product[] }>
  locale?: string
  defaultLocale?: string
}

// ProductCategory.vue
{
  site: SiteConfig
  categories: BlogCategory[]
  category: BlogCategory | null
  products: Product[]
  locale?: string
  defaultLocale?: string
}

// ProductDetail.vue
{
  site: SiteConfig
  category: BlogCategory | null
  product: Product | null
  locale?: string
  defaultLocale?: string
}
```

商品模板规则：

- 商品详情 CTA 必须使用普通 `<a>` 指向 `product.downloadUrl`。
- 外部链接必须带 `target="_blank"` 和 `rel="noopener noreferrer"`。
- 商品列表内部链接使用 `/products/<categorySlug>/<productSlug>`，并通过 locale helper 加前缀。
- 不允许实现站内购物车、支付、订单、账户、库存。
- 不允许调用外部 API 获取商品数据。
- 所有商品数据来自 `content/products/*.md`。

---

## 多语言链接规则

模板组件收到 `locale?: string` 和 `defaultLocale?: string` 时，必须用 helper 生成内部链接：

```ts
const p = (path: string) =>
  props.locale && props.locale !== props.defaultLocale ? `/${props.locale}${path}` : path
```

规则：

- `site.nav` 已由框架处理，可直接渲染。
- 模板内部手写链接必须使用 `p('/path')`。
- 外部链接不加 locale。
- 不要修改路由文件来处理语言。

---

## CSS 规则

所有模板 CSS 必须放在：

```text
templates/<template-name>/template.css
```

规则：

- 使用模板名前缀，避免污染其他模板。
- 不修改 `assets/main.css`。
- 不依赖 Tailwind，除非项目已经明确为该模板提供了依赖。
- 卡片圆角建议不超过 8px，除非设计有明确理由。
- 主题用 CSS 变量实现，挂在模板根 class 或 `html[data-theme='name']` 下。
- 不在 JS 中实现主题系统。

示例：

```css
.template-product-showcase-frame {
  --surface: #ffffff;
  --text: #172026;
}

html[data-theme='night'] .template-product-showcase-frame {
  --surface: #14212a;
  --text: #f8fafc;
}
```

---

## Content 配套规则

模板任务可以同时更新 `content/site*.md`、`content/pages/**`、`content/posts/**`、`content/products/**`，用于让模板有可预览的示例内容。

严格规则：

- 不要为了模板效果修改框架 schema。
- 内容字段必须符合现有 schema。
- 商品内容必须使用外部 `downloadUrl`。
- 图片必须放到 `public/template-assets/<template-name>/`。
- `site.md` 中的 `defaultTemplate` 可以切换为新模板，但 localized `site.<locale>.md` 也要同步考虑。

---

## 禁止事项

AI 绝对禁止：

1. 修改 `components/`、`pages/`、`composables/`、`lib/`、`types/`、`assets/`。
2. 修改 `nuxt.config.ts`、`package.json`、`.github/**`。
3. 新增 npm 依赖。
4. 新增路由文件。
5. 新增 block 类型。
6. 修改全局 schema 或类型来适配模板。
7. 实现运行时 CMS、后端 API、站内支付、购物车或登录。
8. 把模板资源放到 `public/` 根目录。
9. 让模板依赖当前模板目录之外的私有组件。
10. 在内容 markdown 中生成 `\`\`\`javascript` 代码块。

如果以上任何事项看似必要，AI 必须停止并向用户说明原因。

---

## 最终检查清单

完成模板任务后必须检查：

- 修改仅发生在 `templates/<template-name>/**`、`public/template-assets/<template-name>/**`、`content/**`。
- `template.meta.json` 的 `name` 与目录名一致。
- 声明支持 product 时，三个 product 组件都存在。
- 声明支持 blog 时，三个 blog 组件都存在。
- 所有内部链接支持 locale helper。
- 商品 CTA 全部指向外部 URL。
- CSS 没有污染其他模板。
- 示例内容能通过现有 content schema。
