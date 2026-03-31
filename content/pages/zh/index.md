---
slug: /
title: 首页
summary: Jenna Press 首页
seo:
  title: Jenna Press | 一个 static-first 内容框架
  description: Jenna Press 是一个面向项目官网、说明型页面和博客发布的 static-first 多语言框架。
  canonical: https://www.jennapress.com/
blocks:
  - type: hero
    kicker: Jenna Press
    title: 一个面向项目网站的 static-first 框架，强调清晰结构与快速交付
    description: Jenna Press 把内容、模板和框架规则分开，让小团队可以发布多语言网站，而不必把一个简单官网慢慢做成依赖服务端的复杂应用。
    primaryAction:
      label: 阅读博客
      to: /zh/blog
    secondaryAction:
      label: 了解项目
      to: /zh/about
    panelTitle: 当前已经支持的内容
    panelLines:
      - 静态页面与博客发布
      - 英语默认，外加德语、中文、西班牙语和希腊语
      - 浏览器内 theme 与语言记忆
  - type: feature-grid
    title: 为什么会有这个项目
    description: Jenna Press 面向的是那些希望拥有稳定静态发布流程，而不是再接一个模糊全能 CMS 承诺的团队。
    items:
      - title: 静态优先交付
        description: 这个项目面向纯静态部署、良好 SEO 和低运维复杂度。
      - title: 内容与模板分离
        description: 内容编辑主要在 markdown 中完成，视觉变化留在模板里，而不是渗透到每一个页面文件。
      - title: 多语言从结构层设计
        description: 英语是默认版本，德语、中文、西班牙语和希腊语是同等级内容版本，而不是事后补丁。
  - type: stats
    title: 当前支持程度
    description: 这个框架有意保持边界收敛，但对项目官网来说已经具备实用性。
    items:
      - value: '5'
        label: 语言版本
        note: 英语、德语、中文、西班牙语、希腊语采用同一套发布模型。
      - value: '2'
        label: 博客类目
        note: Project 与 Usage 让信息结构保持紧凑。
      - value: '0'
        label: 运行时 API
        note: 按项目规则，框架坚持 static-only。
  - type: cta-banner
    title: 先看官方页面，再去博客深入阅读
    description: 首页给总览，About 讲背景，Principles 讲规则，博客负责展开项目与使用主题。
    action:
      label: 查看项目文章
      to: /zh/blog/project
bodyTitle: Jenna Press 想证明什么
---
Jenna Press 建立在一个很简单的判断上：一个项目网站完全可以在 **快速、多语言、可维护** 的前提下存在，而不必演变成一个依赖服务端的平台。

这个框架刻意把三条边界分清。

- **内容** 放在 markdown 里。
- **模板** 负责表现层。
- **框架规则** 负责路由、持久化和校验。

正因为这种分离，项目才能保持克制，同时又具备实际价值。
