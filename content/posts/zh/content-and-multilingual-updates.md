---
slug: content-and-multilingual-updates
title: 如何持续更新 JennaPress 网站内容——从单语言到五语言
summary: 通过 GitHub 浏览器编辑器和 AI 配合，你可以在不懂代码的情况下持续更新网站内容，并支持五种语言的无缝切换。
publishedAt: "2026-04-01"
category: Usage
tags:
  - jennapress
  - content-management
  - multilingual
  - github
author:
  name: Jenna Press
seo:
  title: 如何持续更新 JennaPress 网站内容 | Jenna Press
  description: 通过 GitHub 浏览器编辑器和 AI 配合，你可以在不懂代码的情况下持续更新网站内容，并支持五种语言的无缝切换。
  canonical: https://www.example.com/blog/usage/content-and-multilingual-updates
bodyTitle: 内容管理和多语言更新的实用流程
bodyBlocks:
  - type: cta-banner
    title: 准备好了吗？
    description: 开始用 AI 配合 GitHub 编辑器管理你的 JennaPress 网站。
    action:
      label: 开始操作
      to: /blog
---
上一篇文章介绍了如何用 Fork 加 AI 搭建网站。本文介绍如何在网站上持续更新内容，以及如何正确处理多语言内容。

## 用 GitHub 浏览器编辑器直接修改

Fork 项目后，你不需要安装任何工具。GitHub 提供了完整的浏览器内编辑器。找到你想修改的文件，点击编辑按钮，直接修改内容，然后提交即可。每次提交后，GitHub Actions 会自动重新构建并部署网站。

## AI 辅助写内容的正确方式

让 AI 帮你写内容时，关键是给出清晰的上下文。把 CONTENT_PROMPT_ZH.md 的内容发给 ChatGPT，然后明确告诉 AI 你要写什么。AI 会按照规则生成标准格式的内容，你只需要复制粘贴。

## 如何正确添加多语言内容

JennaPress 支持五种语言：英语（默认）、德语、中文、希腊语、西班牙语。

添加新语言页面的方法是：在 `content/pages/` 下创建对应的语言子目录（如 `de/`），然后放入翻译后的页面文件。front matter 里的 `slug` 必须和英文版本完全相同。

## 写作时的注意事项

每个页面和博客文章都有固定的 front matter 结构。最容易出错的几个字段：slug 必须唯一且只含小写字母和连字符；publishedAt 必须使用 ISO 格式；canonical 必须包含完整 URL（含 https://）。

## 总结

整个更新流程不需要任何技术背景：写内容让 AI 参照 CONTENT_PROMPT 生成，换外观让 AI 参照 TEMPLATE_PROMPT 生成，改配置直接编辑 content/site.md，提交在 GitHub 浏览器编辑器里点几下就完成，部署完全自动无需人工干预。

JennaPress 的核心目标就是：让内容创作者专注于内容，把技术细节交给系统和 AI。
