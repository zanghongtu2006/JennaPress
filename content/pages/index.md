---
slug: /
title: Home
summary: Nuxt static corporate homepage
seo:
  title: Jenna Press | Build fast and ship globally
  description: A minimal Nuxt-based static corporate site demo with template-driven content blocks and a growing blog model.
  canonical: https://example.com/
blocks:
  - type: hero
    kicker: Nuxt SiteKit v0.0.8
    title: A static site framework for corporate websites and content pages
    description: This version moves page and post content into markdown, so future updates are much friendlier than editing large JSON files.
    primaryAction:
      label: Read the blog
      to: /blog
    secondaryAction:
      label: Contact us
      to: /contact
    panelTitle: What changed in v0.0.8
    panelLines:
      - Markdown content files for pages
      - Markdown content files for blog posts
      - Front matter plus markdown body
  - type: feature-grid
    title: Why this architecture scales better than one-off websites
    description: The goal is not to recreate WordPress. The goal is to give a small team a stable contract for reusing templates and shipping static websites faster.
    items:
      - title: Template-driven pages
        description: Public pages stay simple. Pick one global template, then keep editing markdown files.
      - title: Markdown-first content
        description: Front matter handles metadata, while the body stays readable and pleasant for humans.
      - title: Cloudflare-friendly output
        description: The structure stays static-first and ready for low-ops deployment once the demo is hardened further.
  - type: stats
    title: The current demo boundary
    description: This still aims to be a narrow framework for official websites and content pages, not a general-purpose app builder.
    items:
      - value: '2'
        label: page templates
        note: Corporate basic and SaaS landing.
      - value: '2'
        label: content models
        note: Pages and posts now evolve independently.
      - value: '0'
        label: backend panels
        note: Still fully file-driven and static-first.
  - type: cta-banner
    title: The next natural step is richer collections
    description: From here you can extend toward products, FAQs, docs, or multi-language content without changing the core idea.
    action:
      label: Browse blog posts
      to: /blog
bodyTitle: Why markdown matters
---
Even for developers, updating a large JSON document is not very pleasant. Markdown gives you a much better default authoring experience.

You can now keep **SEO metadata and structured blocks** in front matter, while writing the real page copy in normal markdown.

That means this project can stay narrow and static-first, but the day-to-day content editing becomes much more humane.
