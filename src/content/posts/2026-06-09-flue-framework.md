---
title: "Flue — Agent Harness 框架:像写 Astro 一样构建 AI Agent"
description: "Flue 是一个 TypeScript 框架,让你用 Harness 驱动的架构构建自主 AI Agent,一次编写、随处部署。"
category: project
pubDate: 2026-06-09
---

> 如果你知道怎么用 Claude Code(或 Codex、OpenCode 等编程 Agent),那你已经知道怎么用 Flue 构建 Agent 了。

## 什么是 Flue?

[Flue](https://flueframework.com/) 是一个基于 TypeScript 的 **Agent Harness 框架**,由 Astro 团队开发,于 2026 年 2 月开源(Apache 2.0),目前在 GitHub 上已有 4800+ Star。

传统上我们构建 AI Agent 的方式是写脚本——把模型的每一步调用硬编码进去。Flue 换了个思路:你不需要"脚本化"Agent 的行为,而是给它一个 **Harness(操作环境)**,填充上下文、工具、技能、文件系统访问、MCP 服务器等,然后指向一个模型,告诉它"去解决问题"。模型在 Harness 中自主行动,就像 Claude Code 在你终端里工作一样。

核心公式很简单:

```
Agent = Model + Harness
```

## 为什么需要 Harness?

没有 Harness 的 Agent 其实不是真正的 Agent——它被你为它写的 API 调用限制得死死的。

Harness 赋予了 Agent 真正的自主能力:

- **会话(Sessions)**:持续对话,而非单次问答
- **工具调用(Tools)**:可以执行 shell 命令、读写文件
- **技能(Skills)**:通过 Markdown 定义的领域知识
- **沙箱(Sandboxes)**:安全的执行环境(虚拟沙箱 / 本地沙箱 / 远程沙箱)
- **文件系统**:可以搜索、读取、写入工作区文件

这些能力让 Agent 能像人类开发者一样浏览代码、运行命令、调试问题。

## Flue 的三个设计原则

### 🔧 Harness-first

这是 Flue 最核心的理念。你不需要编排 Agent 的每一步,只需填充 Harness 的上下文,然后让模型自己搞定。Agent 的"逻辑"大量存在于 Markdown 中——技能文件、上下文说明、`AGENTS.md`——而不是代码里。

### 🔓 Open by default

Flue 在每一层都是开放的:

- **模型**:支持 Anthropic、OpenRouter 等任何 LLM 提供商
- **沙箱**:内置虚拟沙箱(基于 just-bash),或接入 Docker 容器等远程沙箱
- **部署**:Node.js、Cloudflare、GitHub Actions、GitLab CI/CD,一次编写随处运行

### 🤖 AI-first

Flue 本身就是设计给**你和你的编程 Agent 一起用**的。搭建项目、生成代码等工作流,都假设你有 Codex 或 Claude Code 这样的编程 Agent 帮你完成。最快的上手方式就是让编程 Agent 读 Flue 的文档,然后边写边学。

## 快速上手

### 安装

```bash
npm install @flue/runtime
npm install --save-dev @flue/cli
npx flue init --target node   # 或 --target cloudflare
```

### 写一个 Agent

创建 `agents/hello-world.ts`:

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

Flue 官方给出了几个很实用的场景:

**翻译 Agent**:创建 Workflow,Agent 接收文本和目标语言,返回结构化的翻译结果(含置信度评分)。

**客服 Agent**:在 Cloudflare Workers 上运行,Agent 自动搜索知识库文件(通过内置的 `grep`、`glob`、`read` 工具),然后生成回答。

**Issue 分类(CI)**:当 GitHub Issue 被创建时自动触发,Agent 可以直接访问 `gh`、`git`、`npm` 等工具,分析 Issue 严重级别、是否可复现、甚至直接应用修复。

## Flue vs Claude Code vs Claude Agent SDK

如果你接触过 Anthropic 的生态,可能会好奇 Flue 和 Claude Code(前身为 Claude CLI)、Claude Agent SDK 之间的关系。它们都涉及"构建 Agent",但定位和抽象层级完全不同。

### 一句话概括

| 工具 | 一句话定位 |
|------|-----------|
| **Claude Code** | 终端里的 AI 编程搭档,开箱即用的产品 |
| **Claude Agent SDK** | 构建 Agent 应用的开发者工具包,给你更细的控制力 |
| **Flue** | Agent Harness 框架,让你搭建自己的 Agent 运行环境 |

### 详细对比

| 维度 | Claude Code | Claude Agent SDK | Flue |
|------|-------------|-------------------|------|
| **本质** | 终端产品 | 开发者 SDK | Harness 框架 |
| **使用者** | 终端用户 | 应用开发者 | 平台/框架开发者 |
| **模型锁定** | 仅 Claude | 仅 Claude | 任意 LLM(Anthropic、OpenRouter 等) |
| **可编程性** | 低(配置为主) | 高(代码控制) | 高(框架扩展) |
| **工具系统** | 内置(文件/Shell/Git) | 可自定义 | 可自定义 + MCP |
| **沙箱** | 内置终端沙箱 | 不提供 | 虚拟沙箱 / Docker / 远程沙箱 |
| **部署** | 本地终端 | 嵌入你的应用 | Node.js / Cloudflare / CI/CD |
| **会话管理** | 单次会话 | 需自行实现 | 内置 Sessions |
| **开源** | ❌ 闭源 | ❌ 闭源 SDK | ✅ Apache 2.0 |
| **编程语言** | — | Python / TypeScript | TypeScript(原生) |

### 怎么选

**选 Claude Code 当你的场景是:**
- 个人开发者,希望在终端里有个 AI 编程搭档
- 不需要自定义工具或模型
- "我直接跟 AI 对话,让它帮我写代码"

**选 Claude Agent SDK 当你的场景是:**
- 要在你的应用里嵌入 AI Agent 能力
- 需要 Python 生态支持
- 需要精细控制 Agent 的每一步行为
- "我要在代码里编排 Agent 的调用流程"

**选 Flue 当你的场景是:**
- 你想搭建自己的 Agent 运行环境,而不是用别人的产品
- 需要多模型支持,不想被锁定在单一供应商
- 要把 Agent 部署到服务器、CI/CD 或边缘计算上
- 你想要一个完整的 Harness(沙箱 + 工具 + 技能 + 文件系统),而不仅仅是 API 调用
- "我要给我的 Agent 一个家"

### 它们之间的关系

这三者不是竞争关系,而是**不同抽象层级的解决方案**:

```
┌─────────────────────────────────────┐
│           Claude Code               │  ← 终端产品,直接使用
│        (编程 Agent 产品)              │
├─────────────────────────────────────┤
│        Claude Agent SDK             │  ← 开发者 SDK,构建应用
│     (Agent 构建工具包)                │
├─────────────────────────────────────┤
│             Flue                    │  ← 基础框架,构建运行环境
│     (Agent Harness 框架)             │
└─────────────────────────────────────┘
```

Claude Code 在底层也使用了类似 Harness 的架构(沙箱、工具、上下文),只是作为产品暴露给用户的是一个完整的终端体验。Claude Agent SDK 则提供了构建 Agent 的编程接口,让你在应用中集成 AI 能力。而 Flue 让你拥有构建整个 Harness 的能力——从底层定义你的 Agent 应该在什么样的环境中运行。

如果你熟悉这个比喻:Claude Code 好比 macOS——开箱即用的完整系统;Claude Agent SDK 好比 SwiftUI——帮你构建应用的框架;Flue 好比 Linux 内核——让你从头搭建自己的操作系统。

## Flue 能否达到 Claude Code 的编码能力?

这个问题触及了 Harness 框架的核心命题:**一个好的 Harness 能在多大程度上弥补或放大模型的编码能力?**

### 拆解 Claude Code 的编码能力来源

Claude Code 之所以在编码场景表现优异,原因来自三个层面:

| 层面 | 贡献占比 | 说明 |
|------|---------|------|
| **模型能力** | ~60% | Claude 本身对代码的理解、生成、推理、长上下文处理能力 |
| **Harness 设计** | ~30% | 工具系统、沙箱、文件操作、上下文注入等运行环境 |
| **产品体验** | ~10% | 终端交互、错误展示、进度反馈等用户体验细节 |

"Harness 设计"这一层(占 ~30%)正是 Flue 在做的事情。Flue 的架构理念与 Claude Code 内部的 Harness 设计高度一致:都是给 Agent 提供工具、沙箱、文件系统和上下文,让它自主行动。

### Harness 的放大效应

一个好的 Harness 可以显著放大模型的能力,具体体现在:

**工具弥补知识不足**
模型可能不知道某个特定框架的 API,但 Harness 可以给它提供搜索代码库、读取文档、执行命令的能力。模型不需要"记住"所有东西,它只需要知道怎么用工具。

```typescript
// Flue 中可以注册工程相关的工具
import { createAgent } from '@flue/runtime';

export default createAgent(() => ({
  model: 'pi/model-v1',        // 或其他模型
  tools: [
    'file-search',             // 搜索代码
    'shell-exec',              // 执行命令
    'read-docs',               // 读取文档
    'run-tests',               // 运行测试
  ],
  sandbox: {
    type: 'virtual',
    allowedCommands: ['node', 'npm', 'git'],
  },
  instructions: `
    你是团队的编码助手。
    遇到不确定的 API 时,先搜索代码库中的用法示例。
    写代码后必须运行测试确认正确性。
  `,
}));
```

**反馈循环弥补推理不足**
模型一次推理可能出错,但 Harness 可以支持多次尝试:生成代码 → 执行测试 → 检查错误 → 修复 → 重测。这种迭代能力可以让相对弱的模型通过"试错"达到接近强模型的效果。

**上下文管理弥补记忆不足**
模型有上下文窗口限制,但 Harness 可以通过文件系统、技能文件、CHECKLIST 等方式管理超出窗口的信息。这相当于给模型配了一个"外脑"。

### 局限性:Harness 不能做什么

Harness 的放大效应不是无限的。以下能力主要依赖模型本身:

- **深层逻辑推理**:复杂的算法设计、并发问题排查、安全漏洞发现
- **长程规划**:跨多个文件的大规模重构,需要模型有全局理解
- **细微语义理解**:理解业务需求中的隐含条件和边界情况
- **代码质量判断**:识别设计模式、代码异味、架构问题

如果底层模型在这些方面与 Claude 有本质差距,仅靠 Harness 无法完全弥补。

### 综合评估

```
模型编码能力
     ↑
  极强 │  ⭐ Claude Code
       │
  较强 │       Flue + 强模型
       │
  中等 │           Flue + 中等模型
       │
  较弱 │               纯 API 调用
       │
       └──────────────────────────→ Harness 完善程度
          无      基础      完善      优秀
```

关键结论:

1. **Flue + 强模型 ≈ Claude Code**:如果 Pi 生态的模型在编码能力上接近 Claude,那么 Flue 的 Harness 设计足以支撑同样强大的编码 Agent
2. **Flue 能让模型超常发挥**:即使模型本身编码能力一般,完善的 Harness 可以通过工具、反馈和上下文管理让它在实际任务中表现更好
3. **Harness 是必要条件,不是充分条件**:Claude Code 的强大 = Claude 模型 + 优秀的 Harness。Flue 提供了优秀的 Harness,但 Agent 的天花板仍然在模型上
4. **Pi 生态的独特优势**:如果 Pi 生态有深度定制的中文理解、更好的本地化支持、或者对特定业务场景的优化,结合 Flue 的 Harness 能力,有可能在某些垂直场景超越 Claude Code

### 现实的判断

Flue 的 Harness 架构理念是经过验证的——Claude Code、Codex、OpenCode 内部都采用类似的架构。所以**理论上**,给 Flue 配上足够强的模型,完全可以达到 Claude Code 级别的编码能力。

最终答案取决于一个变量:**Pi 生态的模型与 Claude 在编码能力上的差距有多大**。如果差距在可接受的范围内,Flue 的 Harness 设计足以让最终体验接近甚至在某些方面超越 Claude Code。

## 引申阅读:pi-mono 生态进阶讲解

在了解了 Flue 和 Claude Code 的对比之后,有必要深入看看 **Pi**——一个与 Flue 理念相近、但架构选择截然不同的开源 Agent Harness 实现。

> Pi 官网:[pi.dev](https://pi.dev) | 仓库:[earendil-works/pi](https://github.com/earendil-works/pi) | 许可证:MIT

### 什么是 Pi?

Pi 是一个**终端编码 Agent**,由 [Earendil Inc.](https://earendil.com)(创始人 [@badlogicgames](https://x.com/badlogicgames))开发。它的首页标语很有意味:

> "There are many agent harnesses, but this one is yours."

Pi 自称"Agent Harness Mono Repo",这暗示了它与 Flue 一样,都认同 Harness-first 的理念。但两者的实现路径不同。

### Pi 的包生态(pi-mono 架构)

Pi 采用 monorepo 组织,核心包分为四层:

```
┌────────────────────────────────────────┐
│        @earendil-works/pi-tui          │
│      终端 UI 层(差异渲染)                │
├────────────────────────────────────────┤
│     @earendil-works/pi-coding-agent    │
│      编码 Agent CLI(产品形态)            │
├────────────────────────────────────────┤
│     @earendil-works/pi-agent-core      │
│      Agent 运行时(工具调用 + 状态管理)    │
├────────────────────────────────────────┤
│        @earendil-works/pi-ai           │
│    多供应商 LLM API(统一接口层)          │
└────────────────────────────────────────┘
```

| 包名 | 职责 | 类比 |
|------|------|------|
| **pi-ai** | 统一 LLM API 接口,支持 OpenAI、Anthropic、Google 等多供应商 | Flue 的 Model 层 |
| **pi-agent-core** | Agent 运行时,处理工具调用和状态管理 | Flue Runtime |
| **pi-coding-agent** | 交互式编码 Agent CLI,产品形态 | Claude Code |
| **pi-tui** | 终端 UI 库,带差异渲染能力 | Flue 不内置(可对接任意 UI) |

另有 **[pi-chat](https://github.com/earendil-works/pi-chat)** 独立仓库,用于 Slack/聊天自动化。

### Flue 与 Pi 的架构对比

| 维度 | Flue | Pi |
|------|------|----|
| **定位** | Harness 框架(让你搭建自己的环境) | 编码 Agent 产品(开箱即用但也可扩展) |
| **核心公式** | Agent = Model + Harness | 内置 Agent,通过包拆分实现灵活组合 |
| **模型支持** | 任意 LLM | 多供应商(OpenAI/Anthropic/Google 等) |
| **包管理** | 两个核心包:`@flue/runtime` + `@flue/cli` | 四个核心包:ai + agent-core + coding-agent + tui |
| **UI** | 不内置,可对接任意 UI | 自带 TUI(差异渲染) |
| **沙箱** | 内置虚拟沙箱 + Docker 远程沙箱 | 不内置权限系统,推荐容器化方案 |
| **容灾机制** | 内置 Sessions | 状态管理在 agent-core 中 |
| **开源生态** | Apache 2.0 | MIT |
| **适用场景** | 构建自定义 Agent Harness | 直接作为编码 Agent 使用或二次开发 |

### Pi 的独特设计理念

**1. 产品优先 vs 框架优先**

Flue 的定位是"框架"——你用它来搭建 Agent 的运行环境。Pi 的定位是"产品"——它首先是一个可以直接在终端里使用的编码 Agent。

这意味着:
- Pi 的 `pi-coding-agent` 开箱即用,安装后直接在终端里敲 `pi` 就能对话
- Flue 需要你先写 `createAgent()` 配置,然后 `npx flue connect` 连接
- Pi 适合"我要一个编程搭档",Flue 适合"我要构建自己的 Agent 平台"

**2. 自扩展性(Self-extensible)**

Pi 的一个核心理念是 **"self extensible"**——你可以用 Pi 自己来扩展 Pi。这个理念和 Claude Code 的"用 AI 写 AI 代码"类似,但 Pi 把它提到了架构层面。

**3. 会话共享文化**

Pi 有一个独特的设计:它鼓励用户将开源工作的 Agent 会话发布到 HuggingFace。创始人 `badlogicgames` 自己就定期发布 `pi-mono` 工作会话:

- [badlogicgames/pi-mono on HuggingFace](https://huggingface.co/datasets/badlogicgames/pi-mono)

这个做法非常有意思——它不是共享代码,而是共享 Agent 的**工作过程**。这些数据包含真实的工具调用、失败、修复和迭代记录,对改进 Agent 能力有极高的训练价值。

**4. 容器化安全策略**

Pi 没有内置权限系统,而是选择了"在 Harness 外解决安全"的路线:

- **OpenShell**:在策略控制的沙箱中运行整个 pi 进程
- **Gondolin**:在宿主机保留 pi 和认证信息,工具执行路由到本地 Linux 微型 VM
- **Plain Docker**:在容器中运行 pi 实现隔离

这与 Flue 内置沙箱的设计哲学不同——Flue 倾向于在框架层解决安全问题,Pi 倾向于在部署层解决。

### pi-mono 给 Flue 的启示

从 pi-mono 的架构中,我们可以提炼出几个对 Flue 生态有参考价值的设计思路:

**包拆分粒度**
Pi 把 AI 供应商接口(pi-ai)和 Agent 运行时(pi-agent-core)拆成独立包,这个拆分粒度值得 Flue 参考。如果你只需要统一的 LLM 调用接口,不需要完整的 Harness,可以只取 pi-ai 这种轻量包。

**会话公开**
Pi 把工作会话发布到 HuggingFace 的做法,解决了 AI 编码领域一个长期痛点:**缺少真实场景的高质量训练数据**。如果 Flue 生态也能建立类似的会话共享机制,对模型微调和 Harness 改进都很有价值。

**安全策略的外置 vs 内置**
Pi 选择在部署层解决安全问题(容器化),Flue 选择在框架层解决(内置沙箱)。两种思路没有绝对优劣,但 Pi 的做法更灵活(你可以选择任意容器化方案),Flue 的做法更便捷(开箱即有沙箱保护)。

### 小结

Pi 和 Flue 都是 Agent Harness 理念的优秀实践,只是抽象层级和产品定位不同:

- **Pi** 是一个完整的、可直接使用的编码 Agent 产品,同时它的包结构允许你深度定制
- **Flue** 是一个更底层的 Harness 框架,让你从空白开始构建自己的 Agent 运行环境
- 两者都认同 Harness-first、多模型支持、开放生态的设计哲学
- 两者的差异体现在安全性策略、UI 策略、包拆分粒度和会话共享文化上

## 总结

Flue 是一个让人眼前一亮的新框架。它把 Claude Code 这类编程 Agent 的架构抽象成一个可编程的 TypeScript 框架,让开发者可以构建自己的自主 Agent,而不需要从零开始造轮子。

如果你熟悉 Astro 的开发体验,Flue 给你的感觉会很相似——约定优于配置、一次编写随处部署、以开发者体验为中心。只不过这次,你构建的不再是网站,而是 AI Agent。

> 官网:[flueframework.com](https://flueframework.com/)
> GitHub:[github.com/withastro/flue](https://github.com/withastro/flue)
> 许可证:Apache 2.0
