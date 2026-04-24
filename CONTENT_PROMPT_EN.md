# JennaPress Content Maintenance Rules

Use this prompt when an AI maintains JennaPress site content. JennaPress is a static Nuxt site framework. Site pages, blog posts, product referral content, and static assets must be maintained through `content/`, `public/`, and `templates/`.

This file is for content work only. For template design or template implementation, use `TEMPLATE_PROMPT_EN.md`.

---

## Highest-Priority Boundary

For content maintenance tasks, AI may only modify:

- `content/**`
- `public/template-assets/**`

For content maintenance tasks, AI must never modify:

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
- any framework-level routing, schema, shared component, type, or build logic

If the user asks to modify a forbidden path, stop and explain that the request is outside the content-maintenance boundary. It should be handled as a template-maintenance task or framework-development task.

---

## Content Structure

```text
content/
  site.md                 default-locale site config
  site.<locale>.md        localized site config
  l18n.ts                 locale list and default locale
  pages/
    index.md              homepage
    about.md              regular page
    <locale>/
      index.md            localized homepage
  posts/
    my-post.md            default-locale blog post
    <locale>/
      my-post.md          localized blog post
  products/
    product-slug.md       default-locale product referral content
    <locale>/
      product-slug.md     localized product content, optional
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

## Site Config Rules

`content/site.md` and `content/site.<locale>.md` control site identity, navigation, active template, themes, and footer text.

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

Strict rules:

- `defaultTemplate` must match a folder under `templates/<template-name>/`.
- Content tasks may switch `defaultTemplate`, but must not edit template code.
- `defaultTheme` must exist in the `themes` array.
- `nav.to` must point to a real static route, such as `/`, `/about`, `/blog`, `/products`, `/products/<category>`.
- Do not add a locale prefix for the default locale.
- Localized `site.<locale>.md` files may use localized paths such as `/zh/products`, but those paths must match real routes.
- For a product referral site, include `/products` in navigation.

---

## Locale Rules

`content/l18n.ts` may only be edited to maintain the locale list. Do not add unrelated TypeScript logic.

```ts
export const locales = [
  { code: 'en', label: 'English', isDefault: true },
  { code: 'zh', label: '中文' },
]
```

Strict rules:

- Exactly one locale must have `isDefault: true`.
- The default locale has no URL prefix.
- Non-default locales use `/<locale>/` prefixes.
- Localized pages, posts, and products should keep the same `slug`.
- Missing localized files fall back to the default-locale content.

---

## Page Rules

Pages live in `content/pages/`.

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

Supported page block types:

- `hero`
- `feature-grid`
- `rich-text`
- `cta-banner`
- `stats`
- `contact`

Do not invent new block types. Block registration belongs to the framework layer.

---

## Blog Rules

Blog posts live in `content/posts/`.

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

Strict rules:

- `publishedAt` and `updatedAt` use `"YYYY-MM-DD"`.
- `slug` uses lowercase letters, numbers, and hyphens.
- `category` is automatically slugified, for example `Product Note` becomes `product-note`.
- Do not create `\`\`\`javascript` code blocks in Markdown bodies. Prefer inline code or `\`\`\`bash` for examples.

---

## Product Rules

Products live in `content/products/`. Products cannot be purchased on the site. They must refer users to an external checkout, download, or seller page.

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

Required fields:

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

Recommended fields:

- `seo`
- `categorySlug`
- `categoryLabel`
- `categoryDescription`
- `categoryListTitle`
- `categoryAccent`
- `blocks`

Product rules:

- `downloadUrl` must point to an external checkout, download, or seller page.
- Do not create in-site payment, cart, order, inventory, account, or login behavior.
- Product images must live in `public/template-assets/<template-name>/`.
- Image paths must use `/template-assets/<template-name>/<file>`.
- Prefer explicit `categorySlug` to avoid locale-specific category slug differences.
- Localized products should keep the same `slug` and `categorySlug`.

---

## Static Asset Rules

AI may create, replace, or delete:

- `public/template-assets/<template-name>/**`

AI must not modify:

- `public/favicon.svg`
- `public/robots.txt`
- search-engine verification files
- root-level `public/` files related to site verification or SEO verification

Asset naming rules:

- Use lowercase letters, numbers, and hyphens.
- Do not use spaces.
- Product images should use `.webp`, `.jpg`, `.png`, or `.svg`.
- Videos may use `.mp4`, but static-hosting size must be considered.

---

## SEO Rules

Pages, posts, and products should provide `seo`:

```yaml
seo:
  title: Page Title | Site Name
  description: Search-result-ready description.
  canonical: https://www.example.com/path/
```

Strict rules:

- `canonical` must be a full URL with `https://`.
- Default-locale canonical points to itself.
- Localized content canonical usually points to the default-locale version.
- Avoid scattering hardcoded domains in body content. Prefer canonical URLs in front matter.

---

## Final Checklist

After content maintenance, AI must check:

- Only `content/**` and required `public/template-assets/**` files changed.
- No framework-level directory changed.
- All Markdown front matter fields are complete.
- All internal links point to real routes.
- All image paths start with `/template-assets/<template-name>/`.
- Product `downloadUrl` points to an external page.
- Localized files use matching `slug` values.
- No unregistered block type was introduced.
