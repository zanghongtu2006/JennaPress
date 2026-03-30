---
slug: generated-files-and-source-of-truth
title: 生成文件与真实源头
summary: 解释 Jenna Press 如何看待生成文件，以及为什么 markdown 内容才是 source of truth。
publishedAt: "2026-03-18"
category: Project
tags:
  - jenna-press
  - project
author:
  name: Jenna Press
seo:
  title: 生成文件与真实源头 | Jenna Press
  description: 理解生成文件为什么存在，以及应该如何正确对待它们。
  canonical: https://www.jennapress.com/blog/project/generated-files-and-source-of-truth
bodyTitle: 允许生成文件存在，但它们不是真正可编辑的真源
bodyBlocks:
  - type: cta-banner
    title: 继续在 Jenna Press 中阅读
    description: 通过博客类目在项目背景与实际使用说明之间继续阅读。
    action:
      label: 返回博客
      to: /blog
---
在 Jenna Press 中，生成文件可以存在，因为静态发布依然需要一层从源内容到运行时渲染之间的桥梁。但这并不意味着生成文件应该成为编辑者工作的地方。

真正的 source of truth 仍然是 markdown 内容，以及把这些内容转换成产物的生成逻辑。生成结果可以为了开发便利而进入仓库，但它应该被当成产物来对待、当成产物来 review，并在真实源头变化后重新生成。

这个区分很重要，因为它同时保护了内容编辑的清晰性和代码审查的清晰性。
