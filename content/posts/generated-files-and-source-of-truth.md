---
slug: generated-files-and-source-of-truth
title: Generated Files and Source of Truth
summary: How Jenna Press treats generated files and why markdown content remains the source of truth.
publishedAt: "2026-03-18"
category: Project
tags:
  - jenna-press
  - project
author:
  name: Jenna Press
seo:
  title: Generated Files and Source of Truth | Jenna Press
  description: Understand why generated files exist and how to treat them safely.
  canonical: https://example.com/blog/project/generated-files-and-source-of-truth
bodyTitle: Generated is allowed, but generated is not editable truth
bodyBlocks:
  - type: cta-banner
    title: Continue reading inside Jenna Press
    description: Use the blog categories to move between project background and practical usage guidance.
    action:
      label: Back to blog
      to: /blog
---
A generated file may exist in Jenna Press because static publishing still needs a practical bridge between source content and runtime rendering. That does not make the generated file the place where editors should work.

The source of truth remains the markdown content and the generation logic that transforms it. Generated output may be committed for convenience, but it should be treated as output, reviewed as output, and regenerated when the real source changes.

This distinction matters because it protects both authoring clarity and code review clarity.
