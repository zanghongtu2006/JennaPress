---
slug: prompt-files-and-their-roles
title: Prompt 文件及其职责
summary: 介绍仓库中的两个 prompt 文件，以及它们分别承担什么职责。
publishedAt: "2026-03-19"
category: Project
tags:
  - jenna-press
  - project
author:
  name: Jenna Press
seo:
  title: Prompt 文件及其职责 | Jenna Press
  description: 了解仓库中的 prompt 文件如何服务于模板生成与内容维护。
  canonical: https://www.jennapress.com/blog/project/prompt-files-and-their-roles
bodyTitle: Prompt 文件应该减少歧义，而不是制造歧义
bodyBlocks:
  - type: cta-banner
    title: 继续在 Jenna Press 中阅读
    description: 通过博客类目在项目背景与实际使用说明之间继续阅读。
    action:
      label: 返回博客
      to: /blog
---
Jenna Press 保留两个 prompt 文件，是因为“生成模板”和“维护内容”这两项工作有关联，但并不相同。模板 prompt 应该帮助 AI 产出兼容框架的结果；维护 prompt 应该帮助 AI 更新内容，同时避免顺手破坏结构。

把这两类职责拆开，会让指令更精确，也更有利于后续 review，因为每个 prompt 文件的意图都保持可见。

所以，prompt 文件本质上是一种协作工具。它应该编码边界、预期输出结构和 review 纪律。
