# 变更记录

格式参考 Keep a Changelog；版本遵循语义化版本。文档与代码变更分别标注。

## [Unreleased]

### Added

- 全生命周期文档结构：立项、需求、架构、设计、开发、质量、发布、运营、治理、参考。
- 分模块 PRD：`docs/01-requirements/prd/`（平台、记录、工具、MVP、最佳实践、聚合、集成、Cheat Sheet、非功能）。
- 独立 ADR：`docs/08-governance/adr/`（ADR-001～009）。
- 阶段 1 交付计划：`docs/01-requirements/delivery-plan.md`（步骤 S0–S5、分步验收与出口门禁）。
- `AGENTS.md`（中文跨 Agent 契约）与 `CLAUDE.md`（Claude Code 入口）。
- shadcn/ui 作为唯一 UI 组件来源：CLI 加入 `src/components/ui/`，组件源码入库。
- 阶段 1 · S0 固化文档基线：文档与协作契约按目录分组提交，工作区回到干净状态。
- 阶段 1 · S1 后端 walking skeleton：`src-dotnet/`（`Zane.sln`、`Zane.Api`、`Zane.Api.Tests`）、`/api/v1/health`、`/openapi/v1.json`、ProblemDetails + `IExceptionHandler`、`AddValidation()` 示例端点与 xUnit 测试。
- 阶段 1 · S2 EF Core 最小模型：`Note` 实体与 `AppDbContext`、`InitialCreate` 迁移、SQLite WAL/外键/忙等待设置、健康检查接入真实数据库探针。
- 阶段 1 · S3 前端工程化补齐：Tailwind CSS v4（仅 theme + utilities，不引入 preflight 以保持既有视觉）、`@/` 别名、shadcn/ui 初始化与 `button`/`card`/`input`；前端目录重构为 `app/`、`components/`、`features/notes/`、`lib/`、`styles/`。

### Changed

- 后端从 Node 切换为 .NET 10（LTS）+ ASP.NET Core Minimal APIs。
- 数据访问采用 EF Core 10；数据库保持 SQLite。
- 项目结构改为前端 `src/`、后端 `src-dotnet/`、生成客户端 `src/api-client/`。
- API 契约以 OpenAPI 3.1 为唯一来源，前端类型由生成客户端提供。
- 项目定位更新为“总结经验、记录想法 + 产品 MVP 游乐场”。

### Deferred

- 用户鉴权（ADR-007）。
- 社交平台一键分发（ADR-008）。

### Planned

- 落地 `src-dotnet/`、`src/api-client/` 与 shadcn/ui 组件基线。
- 接入 EF Core 迁移、测试框架与发布门禁。

## [0.0.0] - 2026-10-29

### Added（初始版本）

- 初始前端原型与基础博客页面。
- 发布脚本与会话归档脚本。

---

## 记录规则

- 每次发布追加版本号与日期。
- 分类使用 Added / Changed / Fixed / Removed / Security。
- 破坏性变更单独标注，并链接 ADR。
- 文档结构变更也在此登记。
