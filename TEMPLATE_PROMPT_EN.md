# AI Prompt for Generating a Nuxt Site Kit Template

Use this prompt when asking an AI coding assistant to generate a **new site template** for the current Nuxt Site Kit CMS project.

This prompt is designed for the current project architecture. The AI should generate output that can be dropped into the project with minimal or no manual restructuring.

---

## Prompt

You are generating a **production-oriented template package** for an existing Nuxt-based static-first CMS called **Nuxt Site Kit CMS**.

Your task is **not** to generate a standalone website from scratch.  
Your task is to generate a **template implementation that fits the existing project conventions exactly**.

The project already has a stable framework layer. Future users should mainly edit:

- `content/*`
- `templates/<template-name>/*`
- `public/template-assets/<template-name>/*`

So your output must follow the current template conventions and must not redesign the framework.

---

## Project assumptions

The CMS works like this:

### Content layer
- `content/site.md` stores site-level settings such as `defaultTemplate`
- `content/pages/*.md` stores general pages
- `content/posts/*.md` stores blog posts
- all content is Markdown-based

### Routing layer
The route system already exists and should not be changed:

- `/` -> homepage
- `/<slug>` -> general page
- `/blog` -> blog home
- `/blog/:category` -> category page
- `/blog/:category/:slug` -> post detail page

There is no `/blog/:slug`.

### Template layer
Each template lives in:

- `templates/<template-name>/`
- `public/template-assets/<template-name>/`

A template should provide:

- `TemplateShell.vue`
- `blog/BlogHome.vue`
- `blog/BlogCategory.vue`
- `blog/BlogPost.vue`
- `blog/blog.config.ts`
- `blog/modules/*`
- `template.css`

The active template is selected through:

```yaml
defaultTemplate: "<template-name>"
```

in `content/site.md`.

---

## Category-module rule

This CMS uses `category` not only as content taxonomy, but also as a **module-template selector**.

That means:

- `cases` can use one category module template
- `products` can use another category module template
- `events` can use another category module template

The mapping must be defined inside:

```ts
templates/<template-name>/blog/blog.config.ts
```

Example structure:

```ts
export default {
  home: BlogHome,
  categoryTemplates: {
    default: DefaultCategory,
    cases: CasesCategory,
    products: ProductsCategory,
    events: EventsCategory
  },
  postTemplates: {
    default: DefaultPost,
    cases: CasesPost,
    products: ProductsPost,
    events: EventsPost
  }
}
```

Do not hardcode all category rendering logic into one giant component.

---

## Input sources you may receive

The user may provide any of the following as input:

- a written business description
- a structured requirements list
- a landing-page brief
- an existing HTML page
- a design screenshot
- a Figma export description
- a wireframe image
- multiple content sections with intended hierarchy

You must convert that input into a template package that fits this CMS.

---

## Your output target

Generate a new template named:

```text
<template-name>
```

Your output must be organized around these files:

```text
templates/<template-name>/
  TemplateShell.vue
  template.css
  blog/
    BlogHome.vue
    BlogCategory.vue
    BlogPost.vue
    blog.config.ts
    modules/
      DefaultCategory.vue
      DefaultPost.vue
      CasesCategory.vue
      CasesPost.vue
      ProductsCategory.vue
      ProductsPost.vue
      EventsCategory.vue
      EventsPost.vue

public/template-assets/<template-name>/
  (placeholder asset paths only if necessary)
```

If some modules are not needed, still provide a clear default fallback structure.

---

## Rendering rules you must follow

### 1. Keep the framework untouched
Do not redesign:
- route structure
- API structure
- content schema
- generic page framework

Only generate the template layer.

### 2. Keep template code self-contained
All visual decisions should be inside:
- `TemplateShell.vue`
- `template.css`
- `blog/*`
- `blog/modules/*`

### 3. Keep category-specific rendering modular
If `cases`, `products`, and `events` require different visual structures, create separate module components and register them in `blog.config.ts`.

### 4. Use default fallbacks
Always provide:
- `DefaultCategory.vue`
- `DefaultPost.vue`

So unmapped categories still render correctly.

### 5. Respect static-first principles
Do not add unnecessary runtime complexity.
Do not depend on a CMS backend.
Do not introduce client-only data fetching for basic rendering.

### 6. Keep content-driven rendering
Assume all actual page and post content comes from Markdown files.
Your template should render structured content cleanly, not hardcode business copy.

### 7. Allow asset replacement
Use asset paths that can be replaced through:

```text
/public/template-assets/<template-name>/
```

### 8. Prefer maintainability over cleverness
Do not generate over-engineered abstractions.
Use readable Vue components and simple styles.

---

## What to infer from user requirements

When converting the user's design or brief into a template, infer and define:

- homepage hero structure
- section rhythm and spacing
- card/list style
- typography hierarchy
- CTA style
- footer style
- blog home style
- blog category style
- post detail style
- category-specific module differences if needed

If the input implies multiple content module types, map them to blog categories when appropriate.

---

## Expected output format

Your answer must be implementation-oriented and ready for integration.

Return:

1. a short explanation of the chosen visual system
2. the full file tree
3. full code for each required file
4. any assumptions clearly stated
5. no unrelated marketing explanation
6. no framework redesign proposal unless explicitly requested

When outputting code, prefer complete files instead of snippets.

---

## Quality rules

The generated template must be:

- clean
- realistic
- easy to modify
- suitable for company websites
- aligned with the Nuxt Site Kit CMS template contract
- usable with minimal manual adjustment

Avoid output that requires the user to manually reorganize all files afterward.

---

## If the user provides HTML

If the user gives an existing HTML page:

- preserve the visual intent
- convert repeated structures into reusable Vue template sections
- move theme styling into `template.css`
- adapt the layout into the Nuxt Site Kit template structure
- do not simply paste raw HTML without restructuring

---

## If the user provides an image or screenshot

If the user provides a screenshot or mockup:

- infer layout blocks and section hierarchy
- recreate the visual style in Vue + CSS
- keep assets replaceable
- generate a maintainable approximation instead of pixel-perfect spaghetti code

---

## If the user provides only a verbal brief

If the user gives only a text description:

- infer a professional company-site structure
- produce a reasonable homepage + blog template system
- use restrained, editable defaults
- do not leave major template files blank

---

## Final instruction

Generate the template so that a future user only needs to:

- switch `defaultTemplate`
- upload assets to `public/template-assets/<template-name>/`
- edit Markdown under `content/`

and does **not** need to rewrite route pages or restructure the project.

Now generate the full template package.
