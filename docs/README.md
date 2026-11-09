# 文档总索引

本目录覆盖 Zane Playground 的完整生命周期：立项、需求、架构、设计、开发、质量、发布、运营、治理与参考。文档是项目事实来源，优先于聊天记录。

> 状态说明：文档描述目标形态；前端 `src/`、后端 `src-dotnet/` 与生成客户端 `src/api-client/` 已建立。阶段 1 执行进度见 [`01-requirements/delivery-plan.md`](01-requirements/delivery-plan.md)，前端页面阶段见 [`01-requirements/delivery-plan-phase2.md`](01-requirements/delivery-plan-phase2.md)，路线状态见 [`01-requirements/roadmap.md`](01-requirements/roadmap.md)。
>
> 前端质量基线：`npm run build`、`npm run lint`、`npm run test:run`（Vitest + Testing Library + jsdom，当前 7 个文件 57 项）；样式只依赖 `src/styles/index.css` 的设计 token 与 Tailwind utility，不再引用已删除的 `app.css`。测试策略见 [`05-quality/test-strategy.md`](05-quality/test-strategy.md)。

## 文档体系来源

本目录是**项目自定义约定**，不是任何组织强制规定的标准：

- `CLAUDE.md` 与 `.claude/` 是 Claude Code 官方支持的项目入口机制。
- `AGENTS.md` 是跨 Agent 的社区约定（agents.md），用于给 Codex、Copilot 等提供同一份契约。
- `00`～`09` 的目录划分参考项目生命周期组织，PRD 与 ADR 分文件参考业界常见实践（ADR 由 Michael Nygard 提出；changelog 参考 Keep a Changelog）。
- 如需调整目录，先改本索引与 `AGENTS.md`，再迁移文件，避免多处事实漂移。

## 项目入口

| 文件 | 面向 | 说明 |
| --- | --- | --- |
| [`../AGENTS.md`](../AGENTS.md) | 所有 AI Agent | 通用工作契约、命令、边界、子目录覆盖规则 |
| [`../CLAUDE.md`](../CLAUDE.md) | Claude Code | Claude 专属入口与架构摘要 |
| [`../README.md`](../README.md) | 人类读者 | 项目简介、技术栈、快速开始 |
| [`../.ai/README.md`](../.ai/README.md) | AI 协作 | 会话归档与恢复策略 |
| [`../.claude/README.md`](../.claude/README.md) | Claude Code | 工作目录与命令模板 |

## 00 · 立项与范围

| 文档 | 内容 |
| --- | --- |
| [`00-overview/project-charter.md`](00-overview/project-charter.md) | 项目定义、愿景、目标与非目标、成功指标 |
| [`00-overview/scope-and-principles.md`](00-overview/scope-and-principles.md) | 范围矩阵与设计原则 |
| [`00-overview/glossary.md`](00-overview/glossary.md) | 领域术语表 |

## 01 · 需求与路线

| 文档 | 内容 |
| --- | --- |
| [`01-requirements/product-requirements.md`](01-requirements/product-requirements.md) | PRD 索引与模块关系 |
| [`01-requirements/feature-backlog.md`](01-requirements/feature-backlog.md) | 功能清单、优先级与状态 |
| [`01-requirements/roadmap.md`](01-requirements/roadmap.md) | 阶段路线与迁移计划 |
| [`01-requirements/delivery-plan.md`](01-requirements/delivery-plan.md) | 阶段 1 步骤 0–5、分步验收与出口门禁 |
| [`01-requirements/delivery-plan-phase2.md`](01-requirements/delivery-plan-phase2.md) | 阶段 2 前端页面 P0–P7、分步验收与阶段出口 |

### 分模块 PRD

每个模块一份独立文件；需求变更必须直接修改对应 PRD，并同步 backlog 与路线图。

| 文档 | 内容 |
| --- | --- |
| [`prd/prd-00-platform.md`](01-requirements/prd/prd-00-platform.md) | 平台基线：.NET 10 API、EF Core、健康检查、OpenAPI |
| [`prd/prd-01-notes.md`](01-requirements/prd/prd-01-notes.md) | 思想记录：CRUD、标签、搜索、导出 |
| [`prd/prd-02-tools.md`](01-requirements/prd/prd-02-tools.md) | 在线工具：二维码、Base64、ASCII |
| [`prd/prd-03-playground.md`](01-requirements/prd/prd-03-playground.md) | 创意 MVP：注册表、状态、独立路由 |
| [`prd/prd-04-patterns.md`](01-requirements/prd/prd-04-patterns.md) | 最佳实践：设计模式案例结构 |
| [`prd/prd-05-feeds.md`](01-requirements/prd/prd-05-feeds.md) | 热点聚合：适配器、缓存、降级 |
| [`prd/prd-06-integrations.md`](01-requirements/prd/prd-06-integrations.md) | 工具集成：Excalidraw |
| [`prd/prd-07-cheatsheets.md`](01-requirements/prd/prd-07-cheatsheets.md) | Cheat Sheet：检索与复制 |
| [`prd/prd-08-non-functional.md`](01-requirements/prd/prd-08-non-functional.md) | 非功能需求：性能、可用性、安全、数据 |

## 02 · 架构与技术

| 文档 | 内容 |
| --- | --- |
| [`02-architecture/system-architecture.md`](02-architecture/system-architecture.md) | React SPA、.NET 10 API、EF Core 与部署拓扑 |
| [`02-architecture/frontend-architecture.md`](02-architecture/frontend-architecture.md) | React/Vite/Redux Toolkit/Tailwind/shadcn/ui 与 API 客户端 |
| [`02-architecture/backend-and-data.md`](02-architecture/backend-and-data.md) | .NET 项目结构、EF Core 约定、SQLite 数据模型与迁移 |
| [`02-architecture/api-design.md`](02-architecture/api-design.md) | Minimal APIs、OpenAPI 契约、错误模型与端点 |

## 03 · 设计

| 文档 | 内容 |
| --- | --- |
| [`03-design/design-system.md`](03-design/design-system.md) | 视觉语言、设计 token 与组件规范 |
| [`03-design/page-specifications.md`](03-design/page-specifications.md) | 页面信息架构与交互说明 |

## 04 · 开发

| 文档 | 内容 |
| --- | --- |
| [`04-development/development-workflow.md`](04-development/development-workflow.md) | 分支、提交、评审、环境与命令 |
| [`04-development/coding-standards.md`](04-development/coding-standards.md) | C#、.NET 10、TypeScript、React 与样式规范 |
| [`04-development/ai-collaboration.md`](04-development/ai-collaboration.md) | 多 Agent 协作模型与任务模板 |

## 05 · 质量

| 文档 | 内容 |
| --- | --- |
| [`05-quality/test-strategy.md`](05-quality/test-strategy.md) | 测试分层、覆盖重点与执行方式 |
| [`05-quality/acceptance-criteria.md`](05-quality/acceptance-criteria.md) | 任务与模块的验收标准 |

## 06 · 发布与运维

| 文档 | 内容 |
| --- | --- |
| [`06-release/release-process.md`](06-release/release-process.md) | 版本、发布门禁与发布步骤 |
| [`06-release/deployment.md`](06-release/deployment.md) | 前端静态发布、.NET 进程与 SQLite 部署 |
| [`06-release/rollback-and-incidents.md`](06-release/rollback-and-incidents.md) | 回滚流程与事故处理 |

## 07 · 运营与迭代

| 文档 | 内容 |
| --- | --- |
| [`07-operations/content-operations.md`](07-operations/content-operations.md) | 内容生产、归档与（延后的）社交分发 |
| [`07-operations/monitoring-and-analytics.md`](07-operations/monitoring-and-analytics.md) | 可用性监控、日志与访问统计 |
| [`07-operations/feedback-and-iteration.md`](07-operations/feedback-and-iteration.md) | 反馈收集与迭代闭环 |

## 08 · 项目治理

| 文档 | 内容 |
| --- | --- |
| [`08-governance/decision-log.md`](08-governance/decision-log.md) | 决策记录索引（指向 ADR 文件） |
| [`08-governance/risk-register.md`](08-governance/risk-register.md) | 风险登记与缓解措施 |
| [`08-governance/changelog.md`](08-governance/changelog.md) | 版本变更记录 |
| [`08-governance/session-archive.md`](08-governance/session-archive.md) | AI 会话归档规范 |

### 架构决策记录（ADR）

每个决策一份独立文件，新增决策必须同时登记到 ADR 索引与决策记录。

| 文档 | 内容 |
| --- | --- |
| [`adr/README.md`](08-governance/adr/README.md) | ADR 索引、格式与规则 |
| [`adr/ADR-001-monorepo.md`](08-governance/adr/ADR-001-monorepo.md) | 前端 `src/` + 后端 `src-dotnet/` 同仓结构 |
| [`adr/ADR-002-sqlite.md`](08-governance/adr/ADR-002-sqlite.md) | 使用 SQLite 作为主数据库 |
| [`adr/ADR-003-frontend-stack.md`](08-governance/adr/ADR-003-frontend-stack.md) | React + TypeScript + Vite + RTK + Tailwind + shadcn/ui |
| [`adr/ADR-004-dotnet-10-backend.md`](08-governance/adr/ADR-004-dotnet-10-backend.md) | 后端采用 .NET 10 Minimal APIs |
| [`adr/ADR-005-ef-core-sqlite.md`](08-governance/adr/ADR-005-ef-core-sqlite.md) | EF Core 10 访问 SQLite |
| [`adr/ADR-006-release-pipeline.md`](08-governance/adr/ADR-006-release-pipeline.md) | 前端 CI + 后端发布链路 |
| [`adr/ADR-007-auth-deferred.md`](08-governance/adr/ADR-007-auth-deferred.md) | 用户鉴权延后 |
| [`adr/ADR-008-social-sync-deferred.md`](08-governance/adr/ADR-008-social-sync-deferred.md) | 社交平台分发延后 |
| [`adr/ADR-009-native-aot-deferred.md`](08-governance/adr/ADR-009-native-aot-deferred.md) | 初期不启用 Native AOT |

## 09 · 参考

| 文档 | 内容 |
| --- | --- |
| [`09-reference/cheatsheet.md`](09-reference/cheatsheet.md) | 前端与 .NET 命令、SQLite 操作与排障速查 |
| [`09-reference/integrations.md`](09-reference/integrations.md) | 外部工具与数据源接入清单 |

## 文档约定

- 新增文档必须在本索引登记。
- 每个 PRD、每个 ADR 独立成文件，不合并成大文档。
- 文档描述“目标”与“现状”时必须明确标注，不能把规划写成已实现。
- 需求变更同步更新 `01-requirements/`，架构变更同步更新 `02-architecture/` 与 ADR。
- 验收结果与发布记录写入 `05-quality/`、`06-release/` 或 `.ai/`，不只留在会话中。
