---
title: "什么是 Harness——AI Agent 的操作环境"
description: "Harness 是 AI Agent 的操作环境,定义了 Agent 能做什么、能访问什么、以及如何安全地执行任务。本文系统梳理 Harness 的核心能力、设计原则与实践路径。"
category: blog
pubDate: 2026-06-09
---

> Harness 是 AI Agent 的操作环境——它定义了 Agent 能做什么、能访问什么、以及如何安全地执行任务。如果说模型是 Agent 的大脑,Harness 就是它的身体。

## 一、为什么需要 Harness?

在 AI Agent 的发展过程中,业界经历了一个重要的认知转变:**仅有强大的模型是不够的**。

早期的 Agent 实现大多采用"脚本化"方式——开发者为模型编写精细的调用链,每一步做什么都提前编排好。这种方式很快遇到了天花板:Agent 的行为被代码限制死了,无法像人类开发者一样灵活应对变化。

OpenAI 在 [Harness Engineering](https://openai.com/zh-Hans-CN/index/harness-engineering/) 一文中提出了一个核心理念:**工程重心应该从"编排 Agent 行为"转向"构建 Agent 操作环境"**。这个操作环境就是 Harness。

Anthropic 在 [Harness Design for Long-Running Apps](https://www.anthropic.com/engineering/harness-design-long-running-apps) 中进一步深化了这一理念,探讨了如何为需要长时间运行的 Agent 应用设计 Harness,重点关注可靠性、状态管理和故障恢复。

## 二、Harness 的核心能力

一个完整的 Harness 通常包含以下能力层:

### 🛡️ 安全沙箱

Agent 需要一个受控的执行环境,不能让它直接在宿主机上为所欲为。沙箱机制提供了:

- **文件系统隔离**:Agent 只能在指定目录读写
- **网络访问控制**:可限制 Agent 能访问的域名和端口
- **执行权限管理**:Agent 可以执行命令,但受限于预设的安全策略

### 🛠️ 工具系统

Agent 需要工具来与世界交互。Harness 负责工具的注册、发现和调用:

- **Shell 执行**:运行命令、脚本
- **文件操作**:读写、搜索文件
- **代码编辑**:创建和修改代码
- **浏览器控制**:打开页面、截图、点击、输入
- **MCP 集成**:通过 Model Context Protocol 连接外部服务

### 📝 上下文管理

Agent 需要持续了解它所处的环境。Harness 提供了:

- **项目上下文**:通过 `AGENTS.md` 等文件传递规范
- **技能系统**:通过 Markdown 文件定义的领域知识
- **会话状态**:跨多次调用保持一致的上下文

### 🔄 反馈循环

Harness 必须能够收集执行结果并反馈给 Agent:

- **截图和日志**:验证操作结果
- **错误捕获**:定位和报告问题
- **用例管理**:跟踪自测进度和结果

## 三、Harness vs. 传统架构

| 维度 | 传统脚本化 Agent | Harness-based Agent |
|------|------------------|---------------------|
| 行为定义 | 代码硬编码调用链 | 在 Harness 中自主决策 |
| 灵活性 | 低,需预判所有路径 | 高,模型自主探索 |
| 安全控制 | 分散在代码中 | Harness 统一管理 |
| 工具扩展 | 需修改 Agent 代码 | 注册工具即可 |
| 状态持久化 | 需自行实现 | Harness 内置支持 |
| 上下文管理 | 手动维护 | 自动继承项目上下文 |

## 四、Harness 的两个关键设计原则

### 1. 最小权限原则

Harness 只给 Agent 它需要的能力,不多给。比如:

- 一个文档翻译 Agent 不需要执行 shell 命令,它只需要文件读写
- 一个代码审查 Agent 可能需要 `git` 命令,但不需要网络访问
- 一个数据分析 Agent 需要 Python 执行环境,但不能访问生产数据库

### 2. Harness-first 设计

这是 Flue 框架(详见 [Flue — Agent Harness 框架](/posts/2026-06-09-flue-framework/))最核心的设计原则:**你不需要编排 Agent 的每一步,只需填充 Harness 的上下文,然后让模型自己搞定**。

Agent 的"逻辑"大量存在于 Markdown 中——技能文件、上下文说明、AGENTS.md——而不是代码里。

## 五、Harness 的落地实践:一个前端 Agent 调试案例

为了把抽象概念落地,我分享一个真实的前端 Agent 调试场景。在这个场景中,我们的目标是把"打开页面 → 执行用例 → 截图存档"这条工作流交给 Agent 自动完成,工程师只需要在最后看一眼结果。

### 调试场景的 Harness 组成

为了实现"在浏览器中调试 H5 页面"这个目标,Agent 的 Harness 需要具备以下能力:

- **容器模拟**:通过内部 JSBridge 调试插件,在浏览器中模拟客户端的 JSBridge 能力,避免依赖真实的 App 容器
- **用例驱动调试**:把自测用例写入 `CHECKLIST.md`,每条用例有截图、结果和备注
- **安全边界**:AI 自动化只测 dev 环境,pre 环境只生成 URL 供人工测试

### 调试工作流中的 Harness 层次

```
┌─────────────────────────────────────┐
│          Harness 编排层              │
│  前端开发 SOP:代码生成 → 调试 → 提交  │
├─────────────────────────────────────┤
│          工具层                       │
│  Chrome DevTools │ Shell │ Git │ RPC │
├─────────────────────────────────────┤
│          沙箱层                       │
│    文件系统隔离 │ 网络控制 │ 权限管理    │
├─────────────────────────────────────┤
│          上下文层                     │
│  AGENTS.md │ Skills │ CHECKLIST.md    │
└─────────────────────────────────────┘
```

这个分层结构里,**沙箱层 + 工具层**是通用能力,大部分项目可以直接复用;**上下文层**是项目特定知识,需要团队自己填充;**编排层**则是把上述所有能力按业务 SOP 串起来。

## 六、为什么 Harness 是 Agent 工程的未来

Harness Engineering 正在成为 AI 工程领域的新范式。它的价值体现在:

1. **关注点分离**:模型负责智能,Harness 负责环境,互不干扰
2. **可组合性**:同一套 Harness 可以切换不同模型,同一模型也可以部署到不同 Harness
3. **安全内置**:安全控制不是事后补丁,而是 Harness 的一等公民
4. **可观察性**:Agent 的每一步操作都在 Harness 中留下记录
5. **渐进式复杂度**:可以从一个简单的文件读写 Harness 开始,逐步加入更多能力

## 七、总结

Harness 不是一个具体的产品,而是一种**设计思维**——把构建 AI Agent 的重心从"写好脚本"转移到"建好环境"。这种思维转变让 Agent 开发变得更简洁、更安全、更容易扩展。

无论是 OpenAI 的 Harness Engineering、Anthropic 的长运行应用 Harness 设计,还是前端工程团队内部的 Agent 调试方案,都在验证同一个道理:**给 Agent 一个好的 Harness,它自然会交出好的结果。**

## 参考

- [OpenAI — Harness Engineering](https://openai.com/zh-Hans-CN/index/harness-engineering/)
- [Anthropic — Harness Design for Long-Running Apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Flue — Agent Harness 框架](/posts/2026-06-09-flue-framework/)
- [基于 Claude Code 构建业务 Harness](/posts/2026-06-09-claude-code-business-harness/)
