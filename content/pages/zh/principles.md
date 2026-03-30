---
slug: /principles
title: 设计原则
summary: Jenna Press 背后的设计原则
bodyTitle: 保护这个框架的项目规则
seo:
  title: 设计原则 | Jenna Press
  description: 阅读定义 Jenna Press 的 static-first、多语言与协作规则。
  canonical: https://www.jennapress.com/principles
blocks:
  - type: feature-grid
    title: 核心原则
    items:
      - title: 默认 static-only
        description: Jenna Press 不依赖运行时 API，也不依赖内建 server 来渲染核心页面内容。
      - title: Theme 必须平级
        description: 模板内部不允许暗藏 dark、light、pink 的优先级。Theme 逻辑必须回到共享框架规则中。
      - title: Content 才是 source of truth
        description: 日常编辑应该修改 markdown 源文件。生成文件可以存在，但它们是产物，不是手工真源。
  - type: feature-grid
    title: 协作规则
    items:
      - title: 代码改动最小化
        description: 代码修改应保持范围收敛、便于 review、可追踪，不能把修 bug 与顺手重构混在一起。
      - title: 模板修改必须隔离
        description: 模板变更应留在模板目录里，框架层不应该顺带吞掉内容层决策。
      - title: 路由与持久化必须稳定
        description: 语言和 theme 的记忆，在刷新、站内跳转和静态部署环境中都要表现一致。
---
这些原则存在的意义，是防止一个原本很简单的项目逐步失去边界。

在 Jenna Press 中，生成文件是允许存在的，但必须被视为生成物；模板是允许存在的，但不能偷偷改写框架；内容文件是允许编辑的，但不应该成为隐藏业务逻辑的地方。

只有这些线始终清楚，这个框架才会长期可用。
