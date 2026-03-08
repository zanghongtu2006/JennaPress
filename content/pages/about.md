---
slug: /about
title: About
summary: About this demo framework
bodyTitle: Core design principles
seo:
  title: About | Jenna Press
  description: Learn the core ideas behind the Nuxt static corporate site demo.
  canonical: https://example.com/about
blocks:
  - type: feature-grid
    title: Current folder responsibilities
    items:
      - title: content/
        description: Stores site configuration and markdown content instances. In later versions, this can grow into posts, products, docs, or FAQ collections.
      - title: templates/
        description: Contains template-level renderers, private sections, styles, and footer/header structures.
      - title: lib/schema.ts
        description: Performs lightweight validation so content mistakes fail early instead of silently rendering broken pages.
---
This demo is intentionally narrow. It is not trying to replace WordPress, not trying to become a full website SaaS, and not trying to solve every CMS scenario.

The first goal is to prove that a corporate website can be produced from a stable contract: **template + content + schema**.

### Why this matters

Once the contract is stable, you can create new templates, add more content models, and later build a small visual editor on top of the same data structure.
