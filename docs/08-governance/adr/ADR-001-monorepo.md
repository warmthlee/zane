# ADR-001 · 前后端分离、同仓维护

- 日期：2026-11-07
- 状态：已接受
- 关联：ADR-004、ADR-005

## 背景

项目需要结构化存储、检索、外部数据抓取与多类页面，纯前端无法承载；同时希望保持低维护成本与一致的类型/契约。

## 决策

采用同仓多项目结构，前端与后端各用一个顶层源码目录：

```text
src/                    React + TypeScript + Vite（Vite 根目录）
  api-client/           由服务端 OpenAPI 生成的 TypeScript 类型与客户端
src-dotnet/             .NET 10（ASP.NET Core Minimal APIs + EF Core）
  Zane.Api/
  Zane.Api.Tests/
  Zane.sln
docs/
```

- 后端是 API 契约的唯一来源。
- 前端类型由 OpenAPI 生成，不手写重复 DTO。
- 生成客户端放在 `src/api-client`，作为前端源码的一部分参与构建，不单独发 npm 包。
- `.NET` 与 TypeScript 之间不共享运行时校验代码；服务端用 DataAnnotations/自定义校验，前端用生成的类型 + 表单校验。

## 备选

- 纯前端 + BaaS：无法满足结构化查询与自托管数据要求。
- 多仓库：增加版本同步成本，个人项目不划算。
- `apps/` + `packages/` 布局：适合多应用 monorepo，本项目只有一个前端与一个后端，层级冗余。
- 手写共享类型：.NET 与 TypeScript 无法直接共享，容易漂移。

## 影响

- 需要维护 OpenAPI 生成流程。
- 前后端可独立构建，但契约变更必须同批发布。
- 部署需同时管理静态产物与 .NET 进程。
