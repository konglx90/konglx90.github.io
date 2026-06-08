# konglx90.github.io — 个人博客项目

## 项目概述

基于 **Jekyll + GitHub Pages** 的个人博客，使用 **kramdown** (GFM) 作为 Markdown 处理器，**rouge** 作为语法高亮工具。

## 目录结构

```
├── _config.yml          # Jekyll 配置（标题、URL、permalink 等）
├── _layouts/            # 页面模板
│   ├── default.html     # 基础 HTML 框架（header/footer）
│   ├── home.html        # 首页/分类页布局（带分类切换动画）
│   ├── post.html        # 文章详情页（含侧栏、目录导航）
│   └── page.html        # 普通页面
├── _posts/              # 文章内容（按分类存放）
│   ├── blog/            # 技术博客
│   ├── opinion/         # 观点随笔
│   └── project/         # 项目记录
├── css/
│   ├── default.css      # 主样式表
│   └── css3-ani.css     # CSS3 动画演示示例
├── js/
│   ├── jquery-1.7.1.min.js  # jQuery（版本较旧）
│   ├── post.js               # 文章页脚本（目录生成、外链处理、代码高亮）
│   └── prettify/             # Google Code Prettify（已弃用，应迁移至 rouge）
├── images/              # 图片资源
├── index.md             # 博客首页
├── opinion/index.md     # 观点分类页
├── project/index.md     # 项目分类页
├── 404.html             # 404 页面
├── webapp/              # 历史 Web 应用（ici 词典、地图等）
└── resume/              # 简历页面
```

## 文章分类

| 分类 | 目录 | 说明 |
|------|------|------|
| blog | `_posts/blog/` | 技术文章（JavaScript、CSS、算法等） |
| opinion | `_posts/opinion/` | 观点随笔 |
| project | `_posts/project/` | 项目记录 |

## 本地开发

```bash
# 如果使用 GitHub Pages 原生构建，无需本地 Jekyll
# 需要本地预览时：
gem install jekyll bundler
bundle exec jekyll serve --watch
```

> 本项目主要在 GitHub Pages 上自动构建，本地无需运行 Jekyll。

## 注意事项

1. **Comment**: 原 Disqus/多说评论系统已不再维护，发表新文章时注意评论方案
2. **jQuery**: 当前使用 1.7.1（2011年），如有新功能建议升级
3. **Syntax Highlighting**: 已配置 `rouge` 高亮，但 post.js 仍加载 `prettify.js`，建议统一
4. **Pagination**: 文章数量超过 20 篇时建议开启分页
5. **GitHub Actions**: 可配置自动构建部署流程
6. **Posts naming**: 严格遵循 `YYYY-MM-DD-title.md` 格式
7. **Drafts**: `_posts/` 下带 `_` 前缀的文件不会被 Jekyll 编译
