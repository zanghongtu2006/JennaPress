---
slug: /
title: Home
summary: Jenna Press homepage
seo:
  title: Jenna Press | A static-first content framework
  description: Jenna Press is a static-first multilingual framework for project sites, documentation-style pages, and blog publishing.
  canonical: https://example.com/
blocks:
  - type: hero
    kicker: Jenna Press
    title: A static-first framework for project websites that need clear structure and fast delivery
    description: Jenna Press separates content, templates, and framework rules so a small team can publish multilingual sites without turning a simple website into a server-heavy application.
    primaryAction:
      label: Read the blog
      to: /blog
    secondaryAction:
      label: About the project
      to: /about
    panelTitle: What this project already supports
    panelLines:
      - Static page and blog publishing
      - English as default, plus German and Chinese
      - Theme and language persistence in the browser
  - type: feature-grid
    title: Why this project exists
    description: Jenna Press was created for teams that want a reliable static publishing workflow instead of a vague all-in-one CMS promise.
    items:
      - title: Static-first delivery
        description: The project is designed for pure static deployment, strong SEO, and low operational complexity.
      - title: Content-template separation
        description: Editors work mainly in markdown, while visual changes stay inside templates instead of leaking into every page file.
      - title: Multilingual by structure
        description: English is the default version, while German and Chinese are first-class content variants rather than afterthoughts.
  - type: stats
    title: Current support level
    description: The framework is intentionally narrow, but the supported surface is already practical for project websites.
    items:
      - value: '3'
        label: languages
        note: English, German, and Chinese use the same publishing model.
      - value: '2'
        label: blog categories
        note: Project and Usage keep the information architecture compact.
      - value: '0'
        label: runtime APIs
        note: The framework is static-only by project rule.
  - type: cta-banner
    title: Start with the official pages, then continue in the blog
    description: Home gives the overview, About explains the background, Principles defines the rules, and the blog carries the deeper project and usage topics.
    action:
      label: Browse project articles
      to: /blog/project
bodyTitle: What Jenna Press is trying to prove
---
Jenna Press is built around a simple claim: a project website can stay **fast, multilingual, and maintainable** without growing into a server-dependent platform.

The framework keeps three boundaries clear.

- **Content** lives in markdown.
- **Templates** control presentation.
- **Framework rules** control routing, persistence, and validation.

That separation is the reason the project can remain small while still being practical.
