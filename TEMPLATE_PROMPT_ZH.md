# 用于生成 Nuxt Site Kit 模板的 AI 提示词

当你希望让 AI 编程助手为当前 Nuxt Site Kit CMS 工程生成一个**新模板**时，请使用这份提示词。

这份提示词是为当前项目架构专门设计的。目标不是让 AI 随便生成一个网页，而是让它输出**可以直接放进当前工程模板目录、并尽量少做人工重构**的结果。

---

## 提示词

你现在要为一个现有的、基于 Nuxt 的静态优先 CMS —— **Nuxt Site Kit CMS** —— 生成一个**可直接接入的模板包**。

你的任务**不是**从零开始生成一个独立网站。  
你的任务是：生成一套**严格符合当前项目约定**的模板实现。

本项目的框架层已经稳定。未来使用者主要只应修改：

- `content/*`
- `templates/<template-name>/*`
- `public/template-assets/<template-name>/*`

因此，你的输出必须遵循当前模板规范，不要重设计框架层。

---

## 项目基本假设

这个 CMS 的工作方式如下：

### 内容层
- `content/site.md` 保存站点级配置，例如 `defaultTemplate`
- `content/pages/*.md` 保存普通页面内容
- `content/posts/*.md` 保存 blog 文章
- 所有内容都基于 Markdown

### 路由层
路由体系已经存在，不应修改：

- `/` -> 首页
- `/<slug>` -> 普通页面
- `/blog` -> blog 首页
- `/blog/:category` -> 分类页
- `/blog/:category/:slug` -> 文章详情页

本项目没有 `/blog/:slug`。

### 模板层
每个模板位于：

- `templates/<template-name>/`
- `public/template-assets/<template-name>/`

一个模板通常应提供：

- `TemplateShell.vue`
- `blog/BlogHome.vue`
- `blog/BlogCategory.vue`
- `blog/BlogPost.vue`
- `blog/blog.config.ts`
- `blog/modules/*`
- `template.css`

当前启用模板由 `content/site.md` 中的：

```yaml
defaultTemplate: "<template-name>"
```

控制。

---

## category 模块规则

本 CMS 中，`category` 不只是内容分类字段，它同时也是一个**模块模板选择器**。

这意味着：

- `cases` 可以对应一种分类模板和详情模板
- `products` 可以对应另一种分类模板和详情模板
- `events` 可以对应另一种分类模板和详情模板

映射关系必须定义在：

```ts
templates/<template-name>/blog/blog.config.ts
```

例如：

```ts
export default {
  home: BlogHome,
  categoryTemplates: {
    default: DefaultCategory,
    cases: CasesCategory,
    products: ProductsCategory,
    events: EventsCategory
  },
  postTemplates: {
    default: DefaultPost,
    cases: CasesPost,
    products: ProductsPost,
    events: EventsPost
  }
}
```

不要把所有分类的渲染逻辑硬塞进一个超大的组件里。

---

## 你可能收到的输入形式

用户可能给你的输入包括但不限于：

- 一段业务描述
- 一份结构化需求文档
- 一个 landing page 口述说明
- 一份已经写好的 HTML
- 一张设计截图
- 一段 Figma 导出描述
- 一张线框图
- 多个内容区块及其层级说明

你需要把这些输入，转换为**适配当前 CMS 的模板包**。

---

## 你的输出目标

请生成一个名为：

```text
<template-name>
```

的新模板。

输出应围绕以下文件组织：

```text
templates/<template-name>/
  TemplateShell.vue
  template.css
  blog/
    BlogHome.vue
    BlogCategory.vue
    BlogPost.vue
    blog.config.ts
    modules/
      DefaultCategory.vue
      DefaultPost.vue
      CasesCategory.vue
      CasesPost.vue
      ProductsCategory.vue
      ProductsPost.vue
      EventsCategory.vue
      EventsPost.vue

public/template-assets/<template-name>/
  （如有必要，仅放占位资源路径）
```

如果某些模块当前不需要，也必须保留一个清晰的默认兜底结构。

---

## 你必须遵守的渲染规则

### 1. 不要改框架层
不要重设计以下部分：
- 路由结构
- API 结构
- 内容 schema
- 通用页面框架

你只生成模板层。

### 2. 模板代码必须自包含
所有视觉决策都应尽量放在：
- `TemplateShell.vue`
- `template.css`
- `blog/*`
- `blog/modules/*`

### 3. category 的特殊样式要模块化
如果 `cases`、`products`、`events` 需要不同页面形态，请单独创建模块组件，并在 `blog.config.ts` 中注册。

### 4. 必须提供默认兜底
始终提供：
- `DefaultCategory.vue`
- `DefaultPost.vue`

确保未映射分类也能正常渲染。

### 5. 遵循静态优先原则
不要引入不必要的运行时复杂度。
不要依赖 CMS 后端。
不要为了基础渲染引入纯客户端取数。

### 6. 保持内容驱动
默认所有实际页面内容和文章内容都来自 Markdown。
模板负责把结构和样式渲染好，而不是把业务文案硬编码进模板。

### 7. 允许资源替换
资源路径应设计为可以通过：

```text
/public/template-assets/<template-name>/
```

进行替换。

### 8. 可维护性优先
不要生成过度设计的抽象层。
请使用可读的 Vue 组件和简单明确的样式组织。

---

## 如何从用户需求中提炼模板

当你把用户给出的设计或需求转成模板时，请主动推导并定义：

- 首页 Hero 结构
- 各 section 的节奏与间距
- 卡片 / 列表的呈现方式
- 字体层级
- CTA 样式
- Footer 样式
- Blog 首页样式
- Blog 分类页样式
- Blog 详情页样式
- 如有需要，不同 category 的模块差异

如果输入中已经隐含多个内容模块，请在合适时将它们映射到 blog category 模板系统。

---

## 期望的输出格式

你的回答必须以“可集成实现”为导向。

请输出：

1. 一小段视觉系统说明
2. 完整文件树
3. 每个必需文件的完整代码
4. 明确列出你的假设
5. 不要输出无关的营销文案
6. 除非用户明确要求，否则不要提出重构整个框架的建议

输出代码时，优先给出完整文件，不要只给零散片段。

---

## 质量要求

生成的模板必须满足：

- 结构清晰
- 风格真实
- 易于修改
- 适合公司官网
- 符合 Nuxt Site Kit CMS 的模板约定
- 经过极少量人工调整即可使用

不要输出那种需要用户再手动重组全部目录的结果。

---

## 如果用户提供的是 HTML

如果用户给的是一个已有 HTML 页面：

- 保留视觉意图
- 将重复结构转换成可维护的 Vue 模板区块
- 将主题样式整理到 `template.css`
- 适配为当前 Nuxt Site Kit 模板结构
- 不要只是把原始 HTML 原封不动塞进去

---

## 如果用户提供的是图片或截图

如果用户给的是截图、视觉稿或线框图：

- 推导布局区块和层级关系
- 用 Vue + CSS 重建视觉结构
- 保持资源可替换
- 给出可维护的近似实现，而不是像素级但难维护的杂乱代码

---

## 如果用户只提供口述需求

如果用户只给你一段文字需求：

- 自动推导出一个专业的公司官网结构
- 生成合理的首页 + blog 模板系统
- 使用克制、可编辑的默认值
- 不要让关键模板文件留空

---

## 最终指令

请生成一套模板，使得未来用户只需要：

- 切换 `defaultTemplate`
- 往 `public/template-assets/<template-name>/` 上传资源
- 修改 `content/` 下的 Markdown

而**不需要**重写路由页，也**不需要**重新整理整个工程结构。

现在开始生成完整模板包。
