# AGENTS.md

本文件面向所有 AI 编程 Agent（Claude Code、Codex、Copilot 等），是仓库的通用工作契约。`CLAUDE.md` 是 Claude Code 的专属入口，两者冲突时以更具体、更靠近目标文件的说明为准。

## 项目概览

Zane Playground 是一个用于总结经验、记录想法的个人网站，也是孵化产品 MVP 的游乐场。核心模块：思想记录、在线工具、创意 MVP、最佳实践、热点聚合、第三方工具集成、Cheat Sheet。

技术栈：React + TypeScript + Vite + Redux Toolkit + Tailwind CSS + shadcn/ui；后端 .NET 10（LTS）+ ASP.NET Core Minimal APIs；数据访问 EF Core 10；数据库 SQLite。

当前明确延后：用户鉴权（ADR-007）、社交平台一键分发（ADR-008）。

## 仓库结构（目标）

```text
src/                React 前端（Vite 根目录）
  api-client/       由 OpenAPI 生成的 TypeScript 客户端
  components/ui/    shadcn/ui 组件
src-dotnet/         .NET 10 API 与测试
  Zane.Api/
  Zane.Api.Tests/
  Zane.sln
docs/               全生命周期文档
scripts/            发布与会话归档脚本
```

当前代码尚未迁移到该结构，涉及实现时必须先确认迁移状态，不要把规划当现状。

## 命令

前端（当前可用）：

```bash
npm install
npm run dev -- --host 0.0.0.0
npm run build
npm run lint
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

验证要求：每次改动至少运行 `npm run build`、`npm run lint`；后端改动运行 `dotnet build` 与 `dotnet test`；涉及界面时手动检查目标页面。

## 架构要点

- 前端 SPA：React + Vite，Redux Toolkit 管理跨页面状态，Tailwind 管理样式 token，shadcn/ui 提供基础组件。
- UI 组件优先从 shadcn/ui 引入（`npx shadcn@latest add <component>`），放入 `src/components/ui/`；无特殊情况不得另起组件库或手写可替代组件。
- `@/` 指向 `src/`；shadcn 组件是项目自有代码，可按设计 token 调整。
- 后端：.NET 10 Minimal APIs，按领域组织 `Features/`，端点返回 `TypedResults`。
- 数据访问：只通过 EF Core 10；结构变更必须新增迁移，不手改表结构。
- 契约：服务端 OpenAPI 3.1 是唯一来源；前端类型由 `src/api-client` 生成，不手写重复 DTO。
- SQLite 由服务端独占访问；SQLite 时间统一按 UTC 读写，展示层再转本地时区。
- 外部数据（热点、股票、社交平台）通过适配器接入，必须可缓存、可降级。
- 鉴权落地前，写接口只允许本机或内网访问，公网只暴露只读接口。

## .NET 10 编码约定

优先使用 .NET 10 / C# 14 的现代能力：

- Minimal APIs + route group + `TypedResults`。
- `builder.Services.AddValidation()` 内置校验（DataAnnotations），统一 400 响应。
- 内置 OpenAPI（`AddOpenApi` / `MapOpenApi`，OpenAPI 3.1）。
- 统一 ProblemDetails 与 `IExceptionHandler`。
- JSON source generation、`TimeProvider`、`HybridCache`、OpenTelemetry。
- C# 14：`field` 关键字、扩展成员、空条件赋值、集合表达式、primary constructors。
- 初期不启用 Native AOT（ADR-009）。

## 开发约定

- 一个任务只做一件事；范围必须可验收。
- 设计取舍写入 `docs/`；架构决策新增 ADR 文件并在索引登记。
- 数据库迁移必须先在副本上演练。
- 密钥、Token、数据库文件不得提交到仓库。
- 外部依赖必须设置超时、重试上限与降级。

## 质量门槛

任务收尾前确认：

- 改动符合约定范围，没有顺手扩张。
- 相关文档已更新（PRD、架构、ADR、验收至少其一）。
- 前端 `npm run build`、`npm run lint` 通过。
- 后端 `dotnet build`、`dotnet test` 通过。
- 涉及数据或接口时，验证迁移、错误分支与空状态。
- 删除了调试代码与临时日志。

## 发布与运维

- 前端：GitHub Actions 构建后 rsync 到 1Panel。
- 后端：`dotnet publish -c Release`，systemd/1Panel 进程托管，Nginx 反代 `/api`。
- 数据库：SQLite 位于持久化目录，发布前备份，不随产物覆盖。
- 发布顺序：备份 → 后端（向后兼容）→ 迁移 → 前端 → 健康检查。
- AI 生成的改动同样需要人工确认后才能发布。

发布流程详见 `docs/06-release/`。

## 文档与生命周期

入口为 `docs/README.md`：

| 阶段 | 目录 |
| --- | --- |
| 立项与范围 | `docs/00-overview/` |
| 需求（分模块 PRD） | `docs/01-requirements/prd/` |
| 架构与技术 | `docs/02-architecture/` |
| 设计规范 | `docs/03-design/` |
| 开发流程 | `docs/04-development/` |
| 测试与质量 | `docs/05-quality/` |
| 发布与运维 | `docs/06-release/` |
| 运营与迭代 | `docs/07-operations/` |
| 项目治理（独立 ADR） | `docs/08-governance/adr/` |
| 参考手册 | `docs/09-reference/` |

## 会话持久化

- 归档：`npm run session:save` / `npm run session:summary`，记录写入 `.ai/`。
- 说明：`.ai/README.md`。
- 会话脚本仍依赖 Node 22+，与前端构建共用 Node，不影响 .NET 后端。

## 范围边界

需要做：个人博客与知识沉淀、在线工具、创意 MVP、热点聚合、最佳实践、工具集成、Cheat Sheet。

不做：多租户 SaaS、企业级权限与审批、重型 CMS、与个人知识管理无关的功能扩张。

延后：鉴权、社交分发。产品范围由负责人决定；Agent 负责执行质量，不替代产品判断与发布确认。

## AGENTS.md 生效规则

- 根目录 `AGENTS.md` 对所有目录生效。
- 子目录中的 `AGENTS.md` 覆盖其所在子树，越靠近目标文件优先级越高。
- 新增子目录契约时，只写该目录的差异，不复制根文件内容。
