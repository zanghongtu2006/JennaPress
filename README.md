# JennaPress

![Project Name](https://img.shields.io/badge/Project-JennaPress-8A2BE2?style=for-the-badge)
![Framework](https://img.shields.io/badge/Framework-Nuxt_3-00DC82?style=for-the-badge&logo=nuxt.js)
![Strategy](https://img.shields.io/badge/Strategy-Static_First-blue?style=for-the-badge)
![Design](https://img.shields.io/badge/Design-Template_Driven-FF69B4?style=for-the-badge)

This codebase was created through prompt engineering and a ChatGPT AI programming assistant.

JennaPress is a lightweight, static-first CMS starter built with Nuxt. It is designed for company websites, landing pages, and category-driven content sites that need template switching without introducing a heavy backend.

The main goal of this project is simple:

- future users should mainly modify `content/*`
- future users should mainly modify `templates/*`
- routing and rendering should stay generic and stable
- category-specific modules should be configurable instead of hardcoded

This open-source project includes TEMPLATE_PROMPT, which can be used with AI assistance to easily generate template modules that meet the requirements with a single click.

---

## 1. What this project is for

This project is designed for websites such as:

- company websites
- SaaS landing sites
- product showcase sites
- event / campaign pages
- content marketing sites
- simple multi-module CMS sites

The system is static-first:

- content is stored in Markdown
- site-level settings are stored in Markdown
- templates are selected by configuration
- blog categories can render through different module templates
- `public/template-assets` stores template-specific public assets

This keeps deployment simple and makes the project suitable for static hosting.

---

## 2. Core idea

This CMS has two main editable layers:

### A. Content layer
Users provide and update content in:

- `content/site.md`
- `content/pages/*.md`
- `content/posts/*.md`

### B. Template layer
Users control appearance and module rendering in:

- `templates/<template-name>/*`
- `public/template-assets/<template-name>/*`

The framework layer should stay mostly unchanged.

---

## 3. Project structure

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
  skk-corporate/
    ...

public/
  template-assets/
    corporate-basic/
    saas-landing/
    skk-corporate/
```

---

## 4. Main routing rules

This project intentionally keeps routing simple.

### Static pages
- `/` -> homepage or page content resolved from `content/pages`
- `/<slug>` -> general content pages

### Blog pages
- `/blog` -> blog home
- `/blog/:category` -> category page
- `/blog/:category/:slug` -> post detail page

There is no `/blog/:slug` layer.

This is intentional. Every blog post belongs to one category.

---

## 5. Content rules

## 5.1 `content/site.md`

This file stores site-level settings.

Typical fields include:

```yaml
title: "Nuxt Site Kit"
description: "A static-first CMS starter"
defaultTemplate: "corporate-basic"
siteUrl: "https://example.com"
```

### Important
`defaultTemplate` controls which folder inside `templates/` is active.

If you change:

```yaml
defaultTemplate: "saas-landing"
```

the site will render using:

```text
templates/saas-landing/
public/template-assets/saas-landing/
```

---

## 5.2 `content/pages/*.md`

These are normal site pages.

Typical front matter:

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

These are blog posts.

Typical front matter:

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

### Required rule
Every post must have a `category`.

This project assumes:

- a category groups content
- a category also selects the module template

---

## 6. Category-driven module templates

This is the key design rule of this CMS.

A blog `category` is not only a taxonomy field.  
It is also a module-template selector.

Example:

- `cases` -> case module
- `products` -> product module
- `events` -> event module

This allows different category pages to behave like different content modules while still sharing the same `/blog` routing system.

---

## 7. Where category-template mapping is configured

The mapping is maintained inside the active template.

For each template, use:

```text
templates/<template-name>/blog/blog.config.ts
```

Example structure:

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

### Meaning

- `categoryTemplates` controls `/blog/:category`
- `postTemplates` controls `/blog/:category/:slug`

If a category is not explicitly configured, the system should fall back to `default`.

---

## 8. Recommended module design

Inside a template, blog modules should stay simple and explicit.

Recommended structure:

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

### Recommended rule
Avoid putting many `if (category === ...)` branches inside one big component.

Instead:

- create one module component per module type
- register it in `blog.config.ts`
- let the generic wrapper component resolve it

This keeps the project maintainable.

---

## 9. How template switching works

Template switching is controlled by `content/site.md`.

Example:

```yaml
defaultTemplate: "corporate-basic"
```

When changed to:

```yaml
defaultTemplate: "saas-landing"
```

the site should automatically use the rendering logic from:

```text
templates/saas-landing/
```

and public assets from:

```text
public/template-assets/saas-landing/
```

### Recommended boundary
- `templates/*` = component structure and rendering rules
- `public/template-assets/*` = images, icons, background assets, static theme files

---

## 10. How to add a new category module

Example: add `news`

### Step 1
Create module components in the active template:

```text
templates/<template-name>/blog/modules/NewsCategory.vue
templates/<template-name>/blog/modules/NewsPost.vue
```

### Step 2
Register them in `blog.config.ts`

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

### Step 3
Add posts in `content/posts/*.md`

```yaml
category: "news"
```

That is enough.

No route changes are needed.

---

## 11. How to add a new site template

Example: add `industrial-dark`

### Step 1
Create a new template folder:

```text
templates/industrial-dark/
```

### Step 2
Copy the required shell and blog files:

```text
TemplateShell.vue
blog/
  blog.config.ts
  BlogHome.vue
  BlogCategory.vue
  BlogPost.vue
  modules/
```

### Step 3
Add public assets:

```text
public/template-assets/industrial-dark/
```

### Step 4
Switch in `content/site.md`

```yaml
defaultTemplate: "industrial-dark"
```

---

## 12. What future users usually need to change

Most future users should only need to change these places.

### Content editors
- `content/site.md`
- `content/pages/*.md`
- `content/posts/*.md`

### Template designers
- `templates/<template-name>/*`
- `public/template-assets/<template-name>/*`

### Usually not needed
- `pages/*`
- `server/api/*`
- `server/utils/*`

Those should remain stable framework code.

---

## 13. YAML front matter rules

When editing Markdown front matter, quote values if they contain:

- `:`
- long SEO text
- date-like strings
- special punctuation

Example:

```yaml
seo:
  title: "Why static corporate sites are a strong default | Example"
  description: "This is exactly the product direction the demo is validating: static-first, template-driven, and narrow by design."
```

This avoids YAML parsing errors.

---

## 14. Authoring guideline for posts

Recommended post fields:

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

### Recommended content rule
Keep `category` stable and lowercase.

Examples:

- `cases`
- `products`
- `events`
- `news`

Avoid mixing:

- `Cases`
- `case`
- `CASES`

Choose one canonical slug and keep using it.

---

## 15. Simple maintenance workflow

### Change content only
Edit Markdown files in `content/`

### Change visual style only
Edit files in `templates/<template-name>/` and `public/template-assets/<template-name>/`

### Change category-specific page style
Create or edit module components in:

```text
templates/<template-name>/blog/modules/
```

and update:

```text
templates/<template-name>/blog/blog.config.ts
```

---

## 16. Design goal summary

This project is intentionally opinionated:

- static-first
- content in Markdown
- template-driven rendering
- category-driven blog modules
- stable routes
- minimal backend logic
- future users should mainly edit `content` and `templates`

That is the intended CMS model.

---

## 17. Suggested editing order for new users

If you are using this project for the first time, follow this order:

1. edit `content/site.md`
2. choose or switch `defaultTemplate`
3. upload assets into `public/template-assets/<template-name>/`
4. edit `content/pages/*.md`
5. edit `content/posts/*.md`
6. if needed, create category modules in `templates/<template-name>/blog/modules/`
7. register them in `templates/<template-name>/blog/blog.config.ts`

---

## 18. Final note

This project is meant to stay simple.

If you find yourself frequently changing route files or server API code for normal content work, that usually means the content or template abstraction should be improved instead.
