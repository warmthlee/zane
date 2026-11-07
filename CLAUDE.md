# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目

Zane Playground：记录个人思想与经验、孵化产品 MVP 的个人网站。分模块需求见 `docs/01-requirements/prd/`。

技术栈：React + TypeScript + Vite + Redux Toolkit + Tailwind CSS + shadcn/ui；后端 .NET 10（LTS）+ ASP.NET Core Minimal APIs；EF Core 10 + SQLite。

当前延后：用户鉴权（ADR-007）、社交平台分发（ADR-008）。

## 命令

前端（当前可用）：

```bash
npm install
npm run dev -- --host 0.0.0.0
npm run build        # tsc -b && vite build
npm run lint         # oxlint
npm run preview
```

后端（规划，迁移后可用）：

```bash
dotnet restore
dotnet build
dotnet run --project src-dotnet/Zane.Api
dotnet test
dotnet ef database update --project src-dotnet/Zane.Api
```

当前仓库尚未迁移到 .NET 后端；不要假设 `dotnet` 项目已存在。

## 架构（目标）

```text
src/                 React SPA（Vite + RTK + Tailwind + shadcn/ui）
  api-client/        由 OpenAPI 生成的类型与客户端
  components/ui/     shadcn/ui 组件（纳入版本控制）
src-dotnet/          .NET 10 API（Minimal APIs + EF Core）
  Zane.Api/
  Zane.Api.Tests/
  Zane.sln
docs/                全生命周期文档
```

- 前端通过 `/api/v1/*` 调用后端；服务端 OpenAPI 是契约唯一来源。
- 后端按领域组织 `Features/`，使用 `TypedResults`、内置校验、ProblemDetails。
- 数据只通过 EF Core 10 访问；结构变更必须新增迁移。
- SQLite 时间统一 UTC；单实例写入，短事务。
- 热点/股票等外部数据通过适配器接入，使用 `HttpClient` + `HybridCache` + 后台任务。
- 鉴权落地前，写接口仅限本机或内网。
- 前端 UI 组件优先使用 shadcn/ui：通过 `npx shadcn@latest add <component>` 加入 `src/components/ui/`，不引第三方重型组件库。
- 路径别名 `@/` 指向 `src/`；`src/components/ui/` 视为项目自有代码，允许按设计 token 修改。

完整设计见 `docs/02-architecture/`，决策见 `docs/08-governance/adr/`。

## .NET 10 约定

- Minimal APIs + route group；请求/响应使用 `TypedResults`。
- `AddValidation()` + DataAnnotations 做请求校验。
- `AddOpenApi()` / `MapOpenApi()` 生成 OpenAPI 3.1，并据此生成前端客户端。
- 统一 ProblemDetails 与 `IExceptionHandler`。
- 使用 source-generated JSON、`TimeProvider`、`HybridCache`、OpenTelemetry。
- C# 14：`field`、扩展成员、空条件赋值、集合表达式、primary constructors。
- 初期不启用 Native AOT（ADR-009）。

## 工作方式

1. 开始任务前用 `.claude/commands/plan-task.md` 明确目标、范围、验收与验证命令。
2. 实现遵循 `AGENTS.md`；本文件只补充 Claude Code 相关约定。
3. 收尾用 `.claude/commands/verify-task.md`，确认前端 build/lint、后端 build/test、文档一致。
4. 架构决策新增独立 ADR 文件，并在 `docs/08-governance/adr/README.md` 登记。

## 文档入口

- 总索引：`docs/README.md`
- 分模块 PRD：`docs/01-requirements/prd/`
- 架构：`docs/02-architecture/`
- 开发规范：`docs/04-development/`
- 发布：`docs/06-release/`
- ADR：`docs/08-governance/adr/`

## 边界

不引入多租户、企业级权限、重型 CMS；不因 AI 生成速度快而扩张范围。鉴权与社交分发延后，不要提前实现。产品判断与发布确认由人负责。
