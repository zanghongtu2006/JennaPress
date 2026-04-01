---
slug: getting-started-with-jennapress-and-prompts
title: 如何用 GitHub Fork + AI Prompt 快速搭建 JennaPress 网站
summary: 即使你完全不懂代码，只要会用 GitHub 和 ChatGPT，也能通过 JennaPress 提供的 AI Prompt 快速生成并维护一个完整的多语言网站。
publishedAt: "2026-04-01"
category: Usage
tags:
  - jennapress
  - getting-started
  - ai-prompt
  - github
author:
  name: Jenna Press
seo:
  title: 如何用 GitHub Fork + AI Prompt 快速搭建 JennaPress 网站 | Jenna Press
  description: 即使你完全不懂代码，只要会用 GitHub 和 ChatGPT，也能通过 JennaPress 提供的 AI Prompt 快速生成并维护一个完整的多语言网站。
  canonical: https://www.example.com/blog/usage/getting-started-with-jennapress-and-prompts
bodyTitle: 用 AI 把网站搭建速度提升 10 倍
bodyBlocks:
  - type: cta-banner
    title: 查看 Prompt 文件
    description: TEMPLATE_PROMPT 和 CONTENT_PROMPT 是本教程的核心工具。
    action:
      label: 在 GitHub 查看
      to: https://github.com/zanghongtu2006/JennaPress
---
JennaPress 的设计初衷就是让非技术用户也能快速拥有一个专业级多语言网站。配合 GitHub Fork 和 AI 工具，整个过程可以压缩到约三十分钟。

本文介绍的就是这套方法的完整流程。

## 你需要准备什么

- 一个 GitHub 账号（免费即可）
- 一个 ChatGPT（或任何支持长上下文的 AI 助手）
- 约 30 分钟的空闲时间

不需要懂代码。不需要装 Node.js。不需要懂 Git 命令行。

## 第一步：Fork 项目

打开 JennaPress 的 GitHub 仓库，点击右上角的 Fork 按钮，将仓库复制到你自己的 GitHub 账户下。

Fork 完成后，你就有了一个完全独立的项目副本，可以在浏览器里直接修改。

## 第二步：认识最重要的两个文件

进入你的 Fork 仓库后，找到根目录下的两个文件：

CONTENT_PROMPT_ZH.md 告诉 AI 如何写网站内容：页面结构、博客文章怎么写、多语言怎么处理、SEO 字段怎么填。

TEMPLATE_PROMPT_ZH.md 告诉 AI 如何生成和修改网站模板：模板文件怎么组织、Header 怎么写、主题 CSS 怎么写。

## 第三步：用 AI 生成网站内容

打开 ChatGPT，把你的需求告诉它，并让 AI 参照 CONTENT_PROMPT_ZH.md 的规则来生成内容。

## 第四步：推送并自动部署

GitHub Actions 会自动检测你对内容的修改。提交更改后，GitHub 会在几分钟内自动完成构建和部署。

## 第五步：用 AI 修改模板

如果默认的模板样式不符合你的需求，同样可以用 TEMPLATE_PROMPT_ZH.md 来让 AI 帮你换一个外观。

## JennaPress 的设计哲学

让内容创作者专注于内容，把技术细节交给系统和 AI。
