# JennaPress 内容维护准则（中文）

本准则用于让 AI 维护 JennaPress 站点内容。JennaPress 是一个 Nuxt 静态站点框架，站点的页面、博客、商品引流内容和静态资源应通过 `content/`、`public/`、`templates/` 三个目录维护。

本文件只定义内容维护任务。若任务是设计或开发模板，请使用 `TEMPLATE_PROMPT_ZH.md`。

---

## 最高优先级边界

AI 在内容维护任务中只允许修改：

- `content/**`
- `public/template-assets/**`

AI 在内容维护任务中禁止修改：

- `templates/**`
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
- 任何框架层配置、路由、类型、共享组件或构建逻辑

如果用户要求修改上述禁止目录，AI 必须停止并说明：该请求超出内容维护边界，应改用模板维护任务或框架开发任务。

---

## 内容目录结构

```text
content/
  site.md                 默认语言站点配置
  site.<locale>.md        非默认语言站点配置
  l18n.ts                 语言列表和默认语言
  pages/
    index.md              首页
    about.md              普通页面
    <locale>/
      index.md            本地化首页
  posts/
    my-post.md            默认语言博客文章
    <locale>/
      my-post.md          本地化博客文章
  products/
    product-slug.md       默认语言商品引流内容
    <locale>/
      product-slug.md     本地化商品内容，可选
```

```text
public/
  template-assets/
    <template-name>/
      image.svg
      product-cover.webp
      video.mp4
```

---

## 站点配置规则

`content/site.md` 和 `content/site.<locale>.md` 控制站点名称、导航、模板、主题和页脚。

```yaml
---
name: Example Store
logoText: ES
siteUrl: https://www.example.com
defaultTemplate: product-showcase
defaultTheme: light
themes:
  - light
  - night
tagline: Curated products for faster launches.
nav:
  - label: Products
    to: /products
  - label: Blog
    to: /blog
footerText: Static product discovery, external checkout.
contactEmail: hello@example.com
socialLinks:
  - label: GitHub
    to: https://github.com/example
---
```

严格规则：

- `defaultTemplate` 必须等于 `templates/<template-name>/` 的目录名。
- 内容任务可以切换 `defaultTemplate`，但不能修改模板代码。
- `defaultTheme` 必须在 `themes` 数组中。
- `nav.to` 只能指向已存在的静态路由，例如 `/`、`/about`、`/blog`、`/products`、`/products/<category>`。
- 默认语言不要加语言前缀。
- 非默认语言的 `site.<locale>.md` 中，导航可以写本地化路径，例如 `/zh/products`，但要保持和实际路由一致。
- 如果新增商品站，至少在 nav 中加入 `/products`。

---

## 多语言规则

`content/l18n.ts` 只允许在内容维护任务中修改语言列表，不允许修改文件结构之外的 TypeScript 逻辑。

```ts
export const locales = [
  { code: 'en', label: 'English', isDefault: true },
  { code: 'zh', label: '中文' },
]
```

严格规则：

- 必须且只能有一个 `isDefault: true`。
- 默认语言没有 URL 前缀。
- 非默认语言使用 `/<locale>/` 前缀。
- 本地化页面、文章、商品应使用相同 `slug`。
- 如果某个本地化文件缺失，框架会 fallback 到默认语言内容。

---

## Page 内容规则

页面文件位于 `content/pages/`。

```yaml
---
slug: /about
title: About
summary: Short page summary.
seo:
  title: About | Example Store
  description: SEO description.
  canonical: https://www.example.com/about/
blocks:
  - type: hero
    kicker: About
    title: A focused static site
    description: Clear copy for a static-first site.
    primaryAction:
      label: View products
      to: /products
  - type: feature-grid
    title: Why it works
    items:
      - title: Static
        description: Fast hosting and predictable SEO.
---

Markdown body can be added here. It becomes a rich text block.
```

页面支持的 block 类型：

- `hero`
- `feature-grid`
- `rich-text`
- `cta-banner`
- `stats`
- `contact`

禁止新增自定义 block 类型，因为 block 注册属于框架层。

---

## Blog 内容规则

博客文章位于 `content/posts/`。

```yaml
---
slug: product-selection-guide
title: Product Selection Guide
summary: A practical guide for comparing product resources.
publishedAt: "2026-04-24"
updatedAt: "2026-04-24"
category: Usage
tags:
  - guide
  - products
author:
  name: Example Store
seo:
  title: Product Selection Guide | Example Store
  description: Learn how to compare product resources.
  canonical: https://www.example.com/blog/usage/product-selection-guide/
bodyBlocks:
  - type: cta-banner
    title: Browse products
    action:
      label: Open catalog
      to: /products
---

Write normal Markdown body here.
```

严格规则：

- `publishedAt` 和 `updatedAt` 使用 `"YYYY-MM-DD"`。
- `slug` 使用小写英文、数字和连字符。
- `category` 会自动转换为 URL slug，例如 `Product Note` 变为 `product-note`。
- 不要在 Markdown 正文中生成 `\`\`\`javascript` 代码块。需要代码示例时优先使用行内代码或 `\`\`\`bash`。

---

## Product 内容规则

商品内容位于 `content/products/`。商品不能站内成交，只能引流到外部成交页面。

```yaml
---
slug: conversion-landing-kit
title: Conversion Landing Kit
description: A polished landing page kit for paid traffic and launch campaigns.
seo:
  title: Conversion Landing Kit | Example Store
  description: A static-friendly landing page kit for product launches.
  canonical: https://www.example.com/products/landing-kits/conversion-landing-kit/
coverImage: /template-assets/product-showcase/conversion-landing-kit.svg
previewImages:
  - /template-assets/product-showcase/conversion-landing-kit.svg
price: 49
isFree: false
downloadUrl: https://example.com/checkout/conversion-landing-kit
author: Example Studio
authorUrl: https://www.example.com
category: Landing Kits
categorySlug: landing-kits
categoryLabel: Landing Kits
categoryDescription: Ready-to-adapt product pages for lead capture and launch campaigns.
categoryListTitle: Landing kits that can ship quickly
categoryAccent: product-note
tags:
  - landing-page
  - campaign
downloadCount: 2840
createdAt: "2026-04-01"
updatedAt: "2026-04-18"
blocks:
  - type: feature-grid
    title: What is included
    items:
      - title: Hero sections
        description: Conversion-focused above-the-fold sections.
      - title: FAQ sections
        description: Blocks for objections, proof, and comparison.
  - type: cta-banner
    title: Continue to seller
    action:
      label: Open seller page
      to: https://example.com/checkout/conversion-landing-kit
---
```

必填字段：

- `slug`
- `title`
- `description`
- `coverImage`
- `previewImages`
- `price`
- `isFree`
- `downloadUrl`
- `author`
- `authorUrl`
- `category`
- `tags`
- `downloadCount`
- `createdAt`
- `updatedAt`

推荐字段：

- `seo`
- `categorySlug`
- `categoryLabel`
- `categoryDescription`
- `categoryListTitle`
- `categoryAccent`
- `blocks`

商品规则：

- `downloadUrl` 必须是外部成交、下载或详情页面。
- 禁止写站内支付、购物车、订单、库存、登录等逻辑。
- 商品图片必须放在 `public/template-assets/<template-name>/`。
- 图片引用必须使用 `/template-assets/<template-name>/<file>`。
- `categorySlug` 推荐显式填写，避免多语言 category 自动 slug 差异。
- 多语言商品应保持相同 `slug` 和 `categorySlug`。

---

## 静态资源规则

AI 可以新增、替换或删除：

- `public/template-assets/<template-name>/**`

AI 不允许修改：

- `public/favicon.svg`
- `public/robots.txt`
- 搜索引擎验证文件
- `public/` 根目录下与站点验证、SEO 验证相关的文件

资源命名规则：

- 使用小写英文、数字、连字符。
- 不使用空格。
- 商品图建议使用 `.webp`、`.jpg`、`.png`、`.svg`。
- 视频可使用 `.mp4`，但必须考虑静态托管体积。

---

## SEO 规则

页面、博客、商品都应提供 `seo`：

```yaml
seo:
  title: Page Title | Site Name
  description: Search-result-ready description.
  canonical: https://www.example.com/path/
```

严格规则：

- `canonical` 必须是完整 URL，包含 `https://`。
- 默认语言 canonical 指向自身。
- 本地化内容 canonical 通常指向默认语言版本。
- 不要在正文中到处硬编码站点域名，优先在 `seo.canonical` 中集中表达。

---

## 最终检查清单

AI 完成内容维护后必须检查：

- 只改了 `content/**` 和必要的 `public/template-assets/**`。
- 没有修改框架层目录。
- 所有 Markdown front matter 字段完整。
- 所有内部链接对应真实路由。
- 所有图片路径以 `/template-assets/<template-name>/` 开头。
- 商品 `downloadUrl` 指向外部页面。
- 多语言文件使用相同 `slug`。
- 没有新增未注册 block 类型。
