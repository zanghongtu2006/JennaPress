# JennaPress Template Maintenance Rules

Use this prompt when an AI creates, replaces, or maintains a JennaPress template. JennaPress sites are maintained through `templates/`, `content/`, and `public/`. Template tasks must stay strictly inside those directories.

---

## Highest-Priority Boundary

For template maintenance tasks, AI may only modify:

- `templates/<template-name>/**`
- `public/template-assets/<template-name>/**`
- `content/**`

AI must never modify:

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
- root app entry files such as `app.vue` and `error.vue`
- any framework-level route, type, schema, shared component, build config, or dependency config

If a requirement cannot be completed within the allowed directories, stop and explain that framework development is required. Do not modify framework directories to make a template work.

---

## Template Capability Boundary

JennaPress currently supports three page families:

- `page`: company pages, homepages, about pages, marketing pages
- `blog`: blog home, category pages, post detail pages
- `product`: product referral home, category pages, product detail pages

Product sites are display-and-referral only. Templates may show prices, tags, authors, images, and external purchase buttons, but must not implement carts, payments, orders, accounts, login, or inventory.

---

## Standard Template Structure

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

Not every template must support blog and product, but if `template.meta.json` claims support, the matching files must exist.

Static assets:

```text
public/template-assets/<template-name>/
  cover.svg
  product-image.webp
  preview.mp4
```

Content:

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

Strict rules:

- `name` must match the template folder name.
- `supportedPageTypes` may only use `page`, `blog`, and `product`.
- `supportedBlocks` may only use framework-registered blocks.
- Do not add new block types.
- Every theme listed here must be implemented in `template.css`.

---

## Frame And Page Template

`Frame.vue` is the site shell. It receives `site: SiteConfig`.

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

`Template.vue` renders normal page content. It receives `page: PageContent`.

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

Rules:

- You may use global `<BlockRenderer>`.
- You may import types from `~/types`.
- Do not copy, move, or modify framework components from `components/`.
- Business copy should come from `content`, not be hardcoded into reusable template files.

---

## Blog Template Contract

If blog is supported, provide:

- `blog/BlogHome.vue`
- `blog/BlogCategory.vue`
- `blog/BlogPost.vue`

Props:

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

Internal links must use a locale helper:

```ts
const p = (path: string) =>
  props.locale && props.locale !== props.defaultLocale ? `/${props.locale}${path}` : path
```

---

## Product Template Contract

If product is supported, provide:

- `product/ProductHome.vue`
- `product/ProductCategory.vue`
- `product/ProductDetail.vue`

Props:

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

Product template rules:

- Product detail CTA must use a normal `<a>` pointing to `product.downloadUrl`.
- External links must include `target="_blank"` and `rel="noopener noreferrer"`.
- Product-list internal links use `/products/<categorySlug>/<productSlug>` and must be passed through the locale helper.
- Do not implement carts, payments, orders, accounts, login, or inventory.
- Do not call external APIs for product data.
- All product data comes from `content/products/*.md`.

---

## Multilingual Link Rules

When template components receive `locale?: string` and `defaultLocale?: string`, use this helper for internal links:

```ts
const p = (path: string) =>
  props.locale && props.locale !== props.defaultLocale ? `/${props.locale}${path}` : path
```

Rules:

- `site.nav` is handled by the framework and may be rendered directly.
- Handwritten internal links inside templates must use `p('/path')`.
- External links do not get locale prefixes.
- Do not modify route files to handle languages.

---

## CSS Rules

All template CSS must live in:

```text
templates/<template-name>/template.css
```

Rules:

- Use a template-name prefix to avoid leaking styles into other templates.
- Do not modify `assets/main.css`.
- Do not depend on Tailwind unless the project already provides that dependency for this template.
- Card radius should usually be 8px or less unless the design has a clear reason.
- Implement themes with CSS variables scoped to the template root class or `html[data-theme='name']`.
- Do not implement theme logic in JavaScript.

Example:

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

## Content Companion Rules

Template tasks may also update `content/site*.md`, `content/pages/**`, `content/posts/**`, and `content/products/**` to provide previewable sample content.

Strict rules:

- Do not modify framework schema to fit the template.
- Content fields must match the existing schema.
- Product content must use external `downloadUrl` values.
- Images must live in `public/template-assets/<template-name>/`.
- `site.md` may switch `defaultTemplate` to the new template, but localized `site.<locale>.md` files must also be considered.

---

## Forbidden Actions

AI must never:

1. Modify `components/`, `pages/`, `composables/`, `lib/`, `types/`, or `assets/`.
2. Modify `nuxt.config.ts`, `package.json`, or `.github/**`.
3. Add npm dependencies.
4. Add route files.
5. Add block types.
6. Modify global schema or types to fit a template.
7. Implement runtime CMS behavior, backend APIs, in-site payments, carts, or login.
8. Put template assets in the root of `public/`.
9. Make a template depend on private components outside its own template folder.
10. Generate `\`\`\`javascript` code blocks inside content Markdown.

If any of these actions appear necessary, stop and explain why.

---

## Final Checklist

After template maintenance, AI must check:

- Changes are limited to `templates/<template-name>/**`, `public/template-assets/<template-name>/**`, and `content/**`.
- `template.meta.json` name matches the folder name.
- If product support is declared, all three product components exist.
- If blog support is declared, all three blog components exist.
- Internal links support the locale helper.
- Product CTAs point to external URLs.
- CSS does not leak into other templates.
- Sample content fits the existing content schema.
