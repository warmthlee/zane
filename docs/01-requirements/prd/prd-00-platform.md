# PRD-00 · 平台基础

- 状态：in-progress（阶段 1 骨架完成；PLAT-08、PLAT-13 待实现）
- 阶段：阶段 1
- 关联：ADR-001、ADR-004、ADR-005

## 背景与目标

把现有前端原型迁移为可持续开发的前后端结构，并为后续所有功能提供统一的 API、数据访问、错误处理与配置基础。

## 用户故事

- 作为开发者，我可以通过一条命令启动前端与后端。
- 作为开发者，我可以通过 EF Core 迁移安全地演进数据库。
- 作为运维者，我可以通过健康接口确认服务与数据库状态。

## 功能要求

| 编号 | 要求 | 优先级 |
| --- | --- | --- |
| PLAT-01 | 前端统一在 `src/`，建立 `src-dotnet/` 与 `src/api-client/` | P0 |
| PLAT-02 | 后端采用 .NET 10（LTS）+ ASP.NET Core Minimal APIs | P0 |
| PLAT-03 | 使用 EF Core 10 + SQLite 提供方 | P0 |
| PLAT-04 | 统一配置与连接字符串管理 | P0 |
| PLAT-05 | `/api/v1/health` 健康检查（含数据库） | P0 |
| PLAT-06 | 统一 ProblemDetails 错误模型 | P0 |
| PLAT-07 | OpenAPI 3.1 文档自动生成 | P1 |
| PLAT-08 | 结构化日志与请求追踪 | P1 |
| PLAT-09 | 契约驱动：OpenAPI 生成前端类型，校验以服务端为准 | P1 |
| PLAT-10 | 鉴权 | 延后（见 ADR-007） |
| PLAT-11 | 前端组件基线：Tailwind + shadcn/ui，组件优先复用 | P1 |
| PLAT-12 | CI 与发布门禁：前后端构建测试、契约一致性与迁移演练 | P0 |
| PLAT-13 | 数据库备份与内容导出脚本 | P1 |

## 技术约束

- 目标框架：`net10.0`，启用可空引用类型与隐式 using。
- 使用 C# 14 特性：`field` 关键字、扩展成员、空条件赋值等（见 `docs/04-development/coding-standards.md`）。
- Minimal APIs 使用 route group + `TypedResults`。
- 请求校验使用 .NET 10 内置 Minimal API 校验（`AddValidation()` + DataAnnotations）。
- OpenAPI 使用内置 `Microsoft.AspNetCore.OpenApi`，输出 OpenAPI 3.1。
- 数据库访问只通过 EF Core，不在端点中拼接 SQL。
- 初期不启用 Native AOT（见 ADR-009）。

## 验收标准

- [x] `dotnet build` 与 `npm run build` 均通过。
- [x] `dotnet test` 通过（7 条）。
- [x] `dotnet ef database update` 可在空库创建结构。
- [x] 健康接口在数据库可用与不可用时分别返回 200 / 503。
- [x] OpenAPI 文档可访问且包含全部端点。

## 开放问题

- 前端与后端是否使用同一域名下的反向代理？见部署文档。
