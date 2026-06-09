---
title: "基于 Claude Code 构建业务 Harness:从通用工具到业务交付引擎"
description: "Claude Code 本身就是一个 Harness 产品——本文介绍如何用 CLAUDE.md、Skills、MCP、Hooks 把业务上下文、工具、安全规则和交付流程织入,让通用 Agent 变成懂业务的交付引擎。"
category: blog
pubDate: 2026-06-09
---

> Claude Code 本身就是一个 Harness 产品——我们要做的不是重新造一个,而是用它的扩展机制把业务上下文、工具、安全规则和交付流程"织"进去,让它从一个通用编程助手变成一个懂业务的交付引擎。

## 一、问题:通用 Agent 做不了业务交付

Claude Code 在编程场景下很强,但在业务团队直接使用时会遇到一个根本问题:**它不懂你的业务。**

具体表现为:

- **不知道项目约定**:你们的组件叫什么名字、路由怎么组织、状态管理用什么方案,它一概不知
- **不会用内部工具**:公司内部的 RPC 调用方式、Mock 平台、发布系统、接口文档平台,它都接不上
- **没有交付流程**:业务需求不只是"写代码",还包括调试、自测、检查点、代码审查、提交规范
- **缺少安全边界**:它不知道哪些环境可以自动化操作、哪些数据不能截图、哪些命令不能执行

这些问题恰好是 Harness 要解决的。Claude Code 已经提供了一个强大的通用 Harness(文件系统、Shell、Git、浏览器控制),我们需要做的是**在它的基础上构建业务 Harness 层**。

## 二、Claude Code 的 Harness 基础设施

在动手设计之前,先拆解 Claude Code 自身已经提供了哪些 Harness 能力:

| 层次 | Claude Code 内置能力 | 对应 Harness 概念 |
|------|---------------------|------------------|
| **上下文** | `CLAUDE.md`、项目级 / 用户级指令 | 项目上下文、角色定义 |
| **工具** | Shell 执行、文件读写、代码编辑 | 工具系统 |
| **技能** | Skill 系统(Markdown + 可执行脚本) | 技能系统 |
| **外部连接** | MCP 服务器(Model Context Protocol) | 工具扩展 |
| **自动化** | Hooks(工具调用前后的钩子) | 反馈循环、流程编排 |
| **安全** | 权限模式、沙箱机制 | 安全沙箱 |
| **浏览器** | Chrome DevTools 集成 | 可视化验证 |
| **记忆** | Memory 系统(跨会话持久化) | 状态管理 |

这些能力覆盖了 [什么是 Harness](/posts/2026-06-09-what-is-harness/) 一文中定义的 Harness 四大核心能力层。我们的任务不是从零搭建,而是**用业务知识填充每一层**。

## 三、设计原则

### 原则一:Harness-first,不写脚本

这与 Flue 框架的理念一致(详见 [Flue 框架](/posts/2026-06-09-flue-framework/)):不给 Agent 编排每一步操作,而是把业务规则写进上下文和技能中,让 Agent 自主决策。

```
❌ 错误做法:写一个脚本,让 Agent 按固定步骤执行
✅ 正确做法:把"自测用例必须写入 CHECKLIST.md"写进 CLAUDE.md,
   让 Agent 在合适时机自主执行
```

### 原则二:最小权限,分层控制

不同业务场景需要的权限不同。通过 Claude Code 的权限系统和 Hooks,可以实现:

- 文档翻译场景:只给文件读写权限
- 代码开发场景:给 Shell、Git、文件读写权限
- 调试验证场景:额外给浏览器控制权限,但限制只能访问 dev 环境

### 原则三:证据驱动,可回溯

业务交付不能只靠 Agent 说"我完成了"。每一步操作都要有证据:截图、日志、用例执行结果。

## 四、架构设计

### 整体分层

```
┌──────────────────────────────────────────────┐
│            业务交付流程层                       │
│  需求分析 → 代码生成 → 调试验证 → 代码审查 → 提交  │
│  载体:Skills + CLAUDE.md + CHECKLIST.md       │
├──────────────────────────────────────────────┤
│            业务上下文层                         │
│  项目约定 / 技术栈 / 组件库 / 接口规范            │
│  载体:CLAUDE.md + Memory                     │
├──────────────────────────────────────────────┤
│            工具扩展层                           │
│  MCP 服务器:接口平台 / Mock 平台 / 发布系统      │
│  Skills:代码生成 / 调试 URL / 用例执行          │
├──────────────────────────────────────────────┤
│            安全控制层                           │
│  权限白名单 / Hooks 校验 / 环境隔离              │
│  载体:settings.json + hooks 配置              │
├──────────────────────────────────────────────┤
│            Claude Code 基座                    │
│  文件系统 / Shell / Git / 浏览器 / Memory       │
└──────────────────────────────────────────────┘
```

### 各层的设计要点

#### 1. 业务上下文层:CLAUDE.md

CLAUDE.md 是业务 Harness 的"灵魂"。它告诉 Agent "你是谁、你面对的是什么项目、你应该遵循什么规则"。

一个好的业务 CLAUDE.md 应该包含:

```markdown
# 项目上下文

## 技术栈
- 框架:Smallfish(H5 MPA)
- 组件库:@your-org/xxx-components
- 状态管理:hooks + context
- 构建工具:webpack(通过 smallfish.config.js 配置)

## 代码约定
- 页面路由放在 src/pages/ 下,每个页面一个目录
- 组件放在 src/components/ 下
- 接口调用通过 OneAPI 生成的 service 层
- 样式使用 CSS Modules

## 交付规范
- 分支命名:feature/<需求ID>-<简短描述>
- 提交信息格式:feat/fix/docs: <描述>
- 每次交付必须包含自测用例
- dev 环境可自动化调试,pre 环境只能人工测试
```

CLAUDE.md 支持三个层级,按优先级从高到低:

| 层级 | 文件位置 | 适用范围 |
|------|---------|---------|
| 项目级 | `.claude/CLAUDE.md` 或项目根 `CLAUDE.md` | 当前项目所有会话 |
| 用户级 | `~/.claude/CLAUDE.md` | 该用户的所有项目 |
| 企业级 | 组织内部统一分发的指令模板 | 所有团队成员 |

#### 2. 工具扩展层:Skill + MCP

**Skill 是什么?**

Skill 是 Claude Code 的"技能包"——用 Markdown 定义领域知识,配合可执行脚本,让 Agent 获得特定能力。它是业务 Harness 中"技能系统"的实现载体。

一个 Skill 的典型结构:

```
.claude/skills/
  smallfish-dev/
    skill.md          # 技能描述和使用说明
    generate-page.sh  # 生成页面脚手架
    run-dev.sh        # 启动开发服务器
    build-url.js      # 生成调试 URL
```

`skill.md` 的内容定义了 Agent 何时、如何使用这个技能:

```markdown
---
name: smallfish-dev
description: Smallfish H5 开发技能
---

## 触发条件
当用户需要创建新页面、启动开发服务器或调试 H5 页面时触发。

## 操作步骤
1. 创建页面:执行 generate-page.sh
2. 启动服务:执行 run-dev.sh
3. 调试页面:使用 build-url.js 生成带参数的调试 URL

## 注意事项
- 开发服务器端口:8000
- 本地域名必须使用 local.example.com
- 调试环境只能用 dev,禁止用 pre
```

**MCP 是什么?**

MCP(Model Context Protocol)是 Claude Code 连接外部服务的标准协议。通过 MCP 服务器,Agent 可以访问公司内部平台,而不需要硬编码 API 调用。

在业务 Harness 中,MCP 用于连接:

| MCP 服务器 | 用途 | 业务价值 |
|-----------|------|---------|
| Chrome DevTools | 浏览器控制、截图、网络检查 | 页面调试和可视化验证 |
| OneAPI / 接口平台 | 获取后端接口定义、生成 service 代码 | 接口对接自动化 |
| AIMA / 需求平台 | 读取需求详情、更新任务状态 | 需求上下文自动获取 |
| 内部知识库 | 查询内部前端知识库 | 技术问题自动检索 |
| CDN / 素材平台 | 上传图片、获取 CDN 链接 | 素材管理自动化 |

MCP 配置示例(`.claude/settings.json`):

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["@anthropic-ai/chrome-devtools-mcp"]
    },
    "oneapi": {
      "command": "npx",
      "args": ["@your-org/oneapi-mcp"]
    }
  }
}
```

#### 3. 安全控制层:权限 + Hooks

**权限白名单**

通过 `.claude/settings.json` 的 `permissions` 配置,预先授权安全的只读操作,减少交互打断:

```json
{
  "permissions": {
    "allow": [
      "Bash(git log*)",
      "Bash(git diff*)",
      "Bash(git status*)",
      "Bash(cat *)",
      "Bash(ls *)",
      "Bash(find *)",
      "Bash(grep *)",
      "Read",
      "mcp__chrome-devtools__take_snapshot",
      "mcp__chrome-devtools__list_console_messages"
    ]
  }
}
```

**Hooks 校验**

Hooks 是在工具调用前后执行的 Shell 命令,用于实现流程控制和规则校验。这是业务 Harness 中"反馈循环"的关键实现。

几个典型的业务 Hooks:

```json
{
  "hooks": {
    "postToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "echo '[$(date)] File modified: $CLAUDE_FILE_PATH' >> .claude/change-log.txt"
          }
        ]
      }
    ]
  }
}
```

这个 Hook 在每次文件修改后记录变更日志,用于后续审计和回溯。

#### 4. 业务交付流程层:Skills 编排

业务交付流程不适合硬编码在脚本中,而是通过 Skill 组合 + CLAUDE.md 指令实现"柔性编排"。

以一个典型的前端需求交付为例,整个流程由多个 Skill 协同完成:

```
需求输入
  │
  ├── Skill: requirement-clarification
  │   澄清需求细节,确认技术方案
  │
  ├── Skill: oneapi
  │   获取后端接口定义,生成 service 代码
  │
  ├── Skill: smallfish(或 bigfish)
  │   创建页面、编写组件、配置路由
  │
  ├── Skill: agent-browser(通过 MCP)
  │   打开调试页面、执行自测用例、截图保存
  │
  ├── Skill: code-review-team
  │   代码审查、质量检查
  │
  └── 人工确认 → 提交代码
```

每个 Skill 的触发时机由 CLAUDE.md 中的指令决定,而不是固定脚本。Agent 根据当前阶段自主判断该调用哪个 Skill。

## 五、配置示例:一个面向前端团队的业务 Harness

以下是一个抽象的、面向前端团队的业务 Harness 配置,各占位符请按你的实际技术栈替换:

### 目录结构

```
.claude/
  CLAUDE.md                    # 项目级业务上下文
  settings.json                # 权限、MCP、Hooks 配置
  settings.local.json          # 个人本地配置(不提交)
  skills/
    requirement-clarification/     # 需求澄清:解析模糊需求,反问补全关键信息
      skill.md
    oneapi/                        # 接口对接:通过 MCP 获取后端接口定义,生成 service 代码
      skill.md
    smallfish/                     # Smallfish 开发:创建页面、编写组件、配置路由
      skill.md
      generate-page.sh
      run-dev.sh
    bigfish/                       # Bigfish 开发:适用于 PC 中后台场景
      skill.md
    debug-workflow/                # 调试流程:生成调试 URL、JSBridge Mock 注入、截图验证
      skill.md
      generate-debug-url.js
    code-review-team/              # 代码审查:多 Agent 协同审查,安全检查、性能建议
      skill.md
    agent-browser/                 # 浏览器自动化:页面截图、交互操作、网络请求检查
      skill.md
  agents/
    code-reviewer.md               # 代码审查 Agent 定义
```

### settings.json 核心配置

```json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(npm run *)",
      "Bash(node *)",
      "Bash(tnpm *)",
      "Bash(find *)",
      "Bash(grep *)",
      "Bash(ls *)",
      "Read",
      "mcp__chrome-devtools__*"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force*)"
    ]
  },
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["@anthropic-ai/chrome-devtools-mcp"]
    },
    "ant-frontend-knowledge": {
      "command": "npx",
      "args": ["@your-org/ant-frontend-knowledge-mcp"]
    },
    "oneapi": {
      "command": "npx",
      "args": ["@your-org/oneapi-mcp"]
    }
  }
}
```

### CLAUDE.md 核心内容

```markdown
# 前端项目

## 角色
你是前端技术组的 AI 编程助手。

## 技术栈
- Smallfish H5 框架(MPA 多页应用)
- 组件库:@your-org/inslife-components
- 接口层:OneAPI 生成
- 构建工具:webpack + smallfish.config.js

## 交付规范
- 需求完成后必须生成自测用例并写入 CHECKLIST.md
- 代码提交前使用 code-review-team skill 进行自审
- dev 环境可自动化调试,pre 环境只生成 URL 供人工测试
- 分支命名:feature/<需求ID>-<描述>

## 调试规则
- 本地开发使用 local.example.com 域名
- 调试 URL 必须通过 generate-debug-url.js 脚本生成,禁止手动拼接
- 移动端视口默认 390x844
```

## 六、对比:有 Harness vs 没有 Harness

| 场景 | 没有 Harness | 有 Harness |
|------|-------------|-----------|
| **创建页面** | 告诉 Agent "帮我创建一个页面",它不知道你们的目录结构和命名约定 | Agent 读取 CLAUDE.md,知道放在 `src/pages/` 下,自动遵循约定 |
| **对接接口** | 手动复制接口定义给 Agent | Agent 通过 OneAPI MCP 自动获取接口定义并生成 service 代码 |
| **调试页面** | Agent 不知道需要 JSBridge Mock,直接打开页面白屏 | Agent 使用 debug-workflow Skill 生成带调试参数的 URL |
| **安全控制** | Agent 可能误操作 pre 环境或执行危险命令 | 通过权限白名单和 CLAUDE.md 规则约束,pre 环境只生成 URL |
| **自测验证** | Agent 说"改完了",但没有证据 | 用例写入 CHECKLIST.md,每条有截图和结果 |
| **知识检索** | Agent 遇到内部框架问题只能猜 | 通过内部知识库 MCP 检索内部知识库 |

## 七、设计路线图

从零到一的构建路径,按阶段递进:

### Phase 1:上下文先行(1-2 天)

> 目标:让 Agent 知道"这是什么项目"

1. 编写项目级 `CLAUDE.md`,包含技术栈、代码约定、目录结构
2. 配置基础权限白名单,减少交互打断
3. 团队成员 review 并达成共识

### Phase 2:工具接入(3-5 天)

> 目标:让 Agent "能干活"

1. 配置 MCP 服务器:Chrome DevTools、OneAPI、知识库检索
2. 编写核心 Skill:页面创建、开发服务器、调试 URL 生成
3. 验证每个工具链路的可用性

### Phase 3:流程编排(1 周)

> 目标:让 Agent "按流程干活"

1. 设计交付 SOP:需求 → 开发 → 调试 → 审查 → 提交
2. 在 CLAUDE.md 中写入流程规则
3. 编写辅助 Skill:需求澄清、代码审查、自测用例生成
4. 用真实需求做端到端验证

### Phase 4:持续优化(持续)

> 目标:让 Agent "越用越好"

1. 收集使用反馈,迭代 CLAUDE.md 和 Skills
2. 通过 Memory 系统积累团队偏好和历史决策
3. 扩展 MCP 接入更多内部平台
4. 建立 Skill 共享机制,跨团队复用

## 八、总结

Claude Code 已经是一个成熟的 Harness 产品。对于业务团队来说,不需要重新造轮子,而是利用它提供的扩展机制——CLAUDE.md(上下文)、Skills(技能)、MCP(工具连接)、Hooks(流程控制)、权限系统(安全)——把业务知识"织"进去。

这个设计的核心思路是 **Harness-first**:不给 Agent 编排硬编码脚本,而是通过上下文和规则让它自主行动。Agent 的"智能"来自模型,"能力"来自 Harness。我们构建的业务 Harness,本质上是在回答一个问题:**如何让一个通用 Agent 变成一个懂业务的交付伙伴?**

答案是:给它正确的上下文、正确的工具、正确的规则,然后信任它。

## 参考

- [什么是 Harness——AI Agent 的操作环境](/posts/2026-06-09-what-is-harness/)
- [Flue — Agent Harness 框架](/posts/2026-06-09-flue-framework/)
- [OpenAI — Harness Engineering](https://openai.com/zh-Hans-CN/index/harness-engineering/)
- [Anthropic — Harness Design for Long-Running Apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
