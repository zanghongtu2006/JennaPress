---
slug: how-to-customize-a-template-safely
title: 如何安全地修改模板
summary: 说明如何在不破坏 theme、language 与框架行为的前提下做模板修改。
publishedAt: "2026-03-20"
category: Usage
tags:
  - jenna-press
  - usage
author:
  name: Jenna Press
seo:
  title: 如何安全地修改模板 | Jenna Press
  description: 一套适用于 Jenna Press 的安全模板修改流程。
  canonical: https://www.jennapress.com/blog/usage/how-to-customize-a-template-safely/
bodyTitle: 只有框架契约不被破坏，视觉自由才有意义
bodyBlocks:
  - type: cta-banner
    title: 继续在 Jenna Press 中阅读
    description: 通过博客类目在项目背景与实际使用说明之间继续阅读。
    action:
      label: 返回博客
      to: /zh/blog
---
模板修改应该留在 template 目录内部，而不应该悄悄改写框架规则。做视觉重设计当然可以，但把隐藏路由逻辑、theme 优先级 hack 或语言分支塞进模板里，就不合适了。

最安全的做法，是只修改模板真正拥有的内容：标记结构、表现层 CSS，以及模板本地组件。如果一个需求会影响持久化、路由结构或跨模板行为，那么它更可能属于框架层，而不是模板层。

这种区分能让模板保持表达力，同时不至于变得不可预测。
