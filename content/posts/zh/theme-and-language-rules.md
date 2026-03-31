---
slug: theme-and-language-rules
title: Theme 与 Language 规则
summary: 定义 Jenna Press 中 theme 平级、语言路由与浏览器持久化的预期规则。
publishedAt: "2026-03-21"
category: Usage
tags:
  - jenna-press
  - usage
author:
  name: Jenna Press
seo:
  title: Theme 与 Language 规则 | Jenna Press
  description: 阅读保证 theme 与 language 行为可预测的规则。
  canonical: https://www.jennapress.com/blog/usage/theme-and-language-rules/
bodyTitle: 持久化应该稳定、克制、没有惊喜
bodyBlocks:
  - type: cta-banner
    title: 继续在 Jenna Press 中阅读
    description: 通过博客类目在项目背景与实际使用说明之间继续阅读。
    action:
      label: 返回博客
      to: /zh/blog
---
在 Jenna Press 中，theme 必须是平级的。dark、light、pink 应该被视为同等级选项，而不是“一个真正主题 + 两个特殊分支”。这个原则很重要，因为隐藏优先级通常会直接制造刷新 bug 和维护混乱。

语言行为也必须同样可预测。英语是默认路由空间，德语和中文使用明确的 locale 前缀。浏览器持久化应该恢复用户选择，但不能反过来篡改路由模型本身。

简单说，路由属于框架，内容属于 content 文件，而持久化的职责，是支持这两者而不制造意外。
