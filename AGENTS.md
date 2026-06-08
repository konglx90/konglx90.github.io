# konglx90.github.io — 个人博客

## 项目概述

基于 **Astro + React** 的静态博客，托管在 GitHub Pages，通过 GitHub Actions 自动构建部署。

## 快速开始

```bash
npm install        # 安装依赖
npm run dev        # 本地开发 (http://localhost:4321)
npm run build      # 构建到 dist/
npm run preview    # 预览构建结果
```

## 目录结构

```
├── src/
│   ├── content/
│   │   ├── config.ts       # 内容集合 schema（title, description, category, pubDate）
│   │   └── posts/          # 所有文章 (Markdown)
│   ├── layouts/
│   │   ├── BaseLayout.astro  # 基础 HTML 框架 + 导航 + 页脚
│   │   └── PostLayout.astro  # 文章详情页布局
│   ├── pages/
│   │   ├── index.astro       # 首页（Blog 分类）
│   │   ├── opinion.astro     # Opinion 分类
│   │   ├── project.astro     # Project 分类
│   │   ├── [...slug].astro   # 文章详情页（动态路由）
│   │   └── 404.astro         # 404 页面
│   └── components/           # React 组件（预留）
├── public/
│   ├── images/               # 图片资源
│   ├── webapp/               # 历史 Web 应用
│   ├── resume/               # 简历
│   ├── favicon.ico
│   └── CNAME
├── .github/workflows/deploy.yml  # GitHub Actions 自动部署
├── astro.config.mjs              # Astro 配置
├── package.json
└── AGENTS.md
```

## 写作

在 `src/content/posts/` 下创建 `YYYY-MM-DD-title.md`，frontmatter 格式：

```yaml
---
title: 文章标题
description: 文章简介
category: blog        # blog | opinion | project
pubDate: 2024-01-01   # 发布日期
---
```

## 部署

push 到 `main` 分支后，GitHub Actions 自动：
1. `npm ci && npm run build`
2. 将 `dist/` 部署到 GitHub Pages

需要配置：Settings → Pages → Source = **GitHub Actions**

## 注意事项

- 无需本地 Jekyll，纯 Node.js 构建
- 自动暗色模式（跟随系统）
- 文章 slug 使用完整文件名（含日期前缀）
- 如需保持旧博客 `:title` 格式的 URL，需添加重定向
