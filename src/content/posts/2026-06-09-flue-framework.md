---
title: "Flue — Agent Harness 框架：像写 Astro 一样构建 AI Agent"
description: "Flue 是一个 TypeScript 框架，让你用 Harness 驱动的架构构建自主 AI Agent，一次编写、随处部署。"
category: project
pubDate: 2026-06-09
---

> 如果你知道怎么用 Claude Code（或 Codex、OpenCode 等编程 Agent），那你已经知道怎么用 Flue 构建 Agent 了。

## 什么是 Flue？

[Flue](https://flueframework.com/) 是一个基于 TypeScript 的 **Agent Harness 框架**，由 Astro 团队开发，于 2026 年 2 月开源（Apache 2.0），目前在 GitHub 上已有 4800+ Star。

传统上我们构建 AI Agent 的方式是写脚本——把模型的每一步调用硬编码进去。Flue 换了个思路：你不需要"脚本化"Agent 的行为，而是给它一个 **Harness（操作环境）**，填充上下文、工具、技能、文件系统访问、MCP 服务器等，然后指向一个模型，告诉它"去解决问题"。模型在 Harness 中自主行动，就像 Claude Code 在你终端里工作一样。

核心公式很简单：

```
Agent = Model + Harness
```

## 为什么需要 Harness？

没有 Harness 的 Agent 其实不是真正的 Agent——它被你为它写的 API 调用限制得死死的。

Harness 赋予了 Agent 真正的自主能力：

- **会话（Sessions）**：持续对话，而非单次问答
- **工具调用（Tools）**：可以执行 shell 命令、读写文件
- **技能（Skills）**：通过 Markdown 定义的领域知识
- **沙箱（Sandboxes）**：安全的执行环境（虚拟沙箱 / 本地沙箱 / 远程沙箱）
- **文件系统**：可以搜索、读取、写入工作区文件

这些能力让 Agent 能像人类开发者一样浏览代码、运行命令、调试问题。

## Flue 的三个设计原则

### 🔧 Harness-first

这是 Flue 最核心的理念。你不需要编排 Agent 的每一步，只需填充 Harness 的上下文，然后让模型自己搞定。Agent 的"逻辑"大量存在于 Markdown 中——技能文件、上下文说明、`AGENTS.md`——而不是代码里。

### 🔓 Open by default

Flue 在每一层都是开放的：

- **模型**：支持 Anthropic、OpenRouter 等任何 LLM 提供商
- **沙箱**：内置虚拟沙箱（基于 just-bash），或接入 Docker 容器等远程沙箱
- **部署**：Node.js、Cloudflare、GitHub Actions、GitLab CI/CD，一次编写随处运行

### 🤖 AI-first

Flue 本身就是设计给**你和你的编程 Agent 一起用**的。搭建项目、生成代码等工作流，都假设你有 Codex 或 Claude Code 这样的编程 Agent 帮你完成。最快的上手方式就是让编程 Agent 读 Flue 的文档，然后边写边学。

## 快速上手

### 安装

```bash
npm install @flue/runtime
npm install --save-dev @flue/cli
npx flue init --target node   # 或 --target cloudflare
```

### 写一个 Agent

创建 `agents/hello-world.ts`：

```ts
import { createAgent } from '@flue/runtime';

export default createAgent(() => ({
  model: 'anthropic/claude-sonnet-4-6',
  instructions: '讲一个搞笑的 "hello world" 工程师笑话。',
}));
```

### 运行

```bash
npx flue connect hello-world local
```

就这么简单。你有了一个可以对话的 Agent。

## 实际用例

Flue 官方给出了几个很实用的场景：

**翻译 Agent**：创建 Workflow，Agent 接收文本和目标语言，返回结构化的翻译结果（含置信度评分）。

**客服 Agent**：在 Cloudflare Workers 上运行，Agent 自动搜索知识库文件（通过内置的 `grep`、`glob`、`read` 工具），然后生成回答。

**Issue 分类（CI）**：当 GitHub Issue 被创建时自动触发，Agent 可以直接访问 `gh`、`git`、`npm` 等工具，分析 Issue 严重级别、是否可复现、甚至直接应用修复。

## 总结

Flue 是一个让人眼前一亮的新框架。它把 Claude Code 这类编程 Agent 的架构抽象成一个可编程的 TypeScript 框架，让开发者可以构建自己的自主 Agent，而不需要从零开始造轮子。

如果你熟悉 Astro 的开发体验，Flue 给你的感觉会很相似——约定优于配置、一次编写随处部署、以开发者体验为中心。只不过这次，你构建的不再是网站，而是 AI Agent。

> 官网：[flueframework.com](https://flueframework.com/)
> GitHub：[github.com/withastro/flue](https://github.com/withastro/flue)
> 许可证：Apache 2.0
