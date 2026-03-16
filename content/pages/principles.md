---
slug: /principles
title: Principles
summary: The design principles behind Jenna Press
bodyTitle: Project rules that protect the framework
seo:
  title: Principles | Jenna Press
  description: Read the core rules that define Jenna Press as a static-first multilingual framework.
  canonical: https://example.com/principles
blocks:
  - type: feature-grid
    title: Core principles
    items:
      - title: Static-only by default
        description: Jenna Press does not rely on runtime APIs or a built-in server to render core page content.
      - title: Themes are equal citizens
        description: No template should encode a hidden priority order between dark, light, and pink. Theme logic belongs to shared framework rules.
      - title: Content is the source of truth
        description: Editors should modify markdown source files. Generated files may exist, but they are outputs rather than hand-written truth.
  - type: feature-grid
    title: Collaboration rules
    items:
      - title: Minimal code modification
        description: Code changes should stay narrow, traceable, and review-friendly rather than mixing fixes with opportunistic refactors.
      - title: Templates should stay isolated
        description: Template changes belong in template directories. Framework changes should not casually drift into content decisions.
      - title: Routing and persistence must stay predictable
        description: Language and theme persistence should feel stable across refreshes, internal navigation, and static deployment.
---
These principles exist to prevent a common failure mode: a project that starts simple, then slowly loses its boundaries.

In Jenna Press, a generated file is allowed, but it must be treated as generated. A template is allowed, but it must not quietly redefine the framework. A content file is editable, but it should not become a place to hide application logic.

The framework stays useful only if those lines remain visible.
