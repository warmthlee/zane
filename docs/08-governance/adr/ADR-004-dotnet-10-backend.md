# ADR-004 · 后端采用 .NET 10

- 日期：2026-11-07
- 状态：已接受
- 关联：ADR-005、ADR-009

## 背景

后端需要稳定的 API、强类型、成熟的校验与数据访问能力，并希望利用 .NET 10 LTS 的长期支持与新特性。原 Node 方案不再采用。

## 决策

后端使用 .NET 10（LTS）+ ASP.NET Core 10，采用 Minimal APIs，并按 .NET 10 新特性编写：

| 特性 | 用法 |
| --- | --- |
| Minimal API 内置校验 | `builder.Services.AddValidation()` + DataAnnotations，统一 400 响应 |
| OpenAPI 3.1 | `AddOpenApi()` / `MapOpenApi()`，用于生成前端客户端 |
| `TypedResults` + route group | 端点分组、强类型返回 |
| ProblemDetails / `IExceptionHandler` | 统一错误响应 |
| JSON source generation | 减少反射、提升启动与序列化性能 |
| `TimeProvider` | 可测试的时间依赖 |
| `HybridCache` | 外部数据与热点缓存 |
| OpenTelemetry | 指标、追踪与日志 |
| C# 14 | `field` 关键字、扩展成员、空条件赋值、集合表达式、primary constructors |

项目结构：单个 ASP.NET Core 项目 + 按领域分目录：

```text
src-dotnet/
  Zane.sln
  Zane.Api/
    Program.cs
    Features/        # 端点与处理器（Notes/Tools/Feeds/...）
    Domain/          # 实体与领域规则
    Data/            # AppDbContext 与配置
    Migrations/      # EF Core 迁移
    Contracts/       # 请求/响应 DTO
    Infrastructure/  # 适配器、后台任务、缓存
  Zane.Api.Tests/    # xUnit
```

## 备选

- Node.js + Fastify/Express：团队目标改为 .NET。
- 控制器式 API：Minimal APIs 更贴合当前规模。
- Native AOT：暂缓，见 ADR-009。

## 影响

- 开发环境需要 .NET 10 SDK。
- 前端构建仍需要 Node（Vite）。
- 与前端共享契约依赖 OpenAPI 生成，不再手写共享 DTO。
- 需要补充 .NET 测试与 EF Core 迁移流程。
