# 系统架构

## 总体形态

前后端分离、同仓维护：

```text
浏览器
  │
  ▼
src（React SPA）
  │  /api/v1/*（JSON，OpenAPI 3.1 契约）
  ▼
src-dotnet/Zane.Api（.NET 10 Minimal APIs）
  ├── EF Core 10 ──► SQLite（唯一持久化存储）
  ├── 外部适配器（百度/微博/股票/社交平台，后者延后）
  └── BackgroundService（抓取、缓存刷新）
```

## 组件职责

| 组件 | 职责 | 不负责 |
| --- | --- | --- |
| `src` | 页面渲染、交互、纯前端工具计算 | 直接访问数据库、持有第三方密钥 |
| `src-dotnet` | API、校验、领域逻辑、EF Core、适配器、后台任务 | 页面渲染 |
| `src/api-client` | 由 OpenAPI 生成的 TypeScript 类型与客户端 | 手写业务逻辑 |
| SQLite | 结构化数据持久化 | 多实例并发写 |

## 技术选型

| 层 | 选择 | 说明 |
| --- | --- | --- |
| 前端框架 | React + TypeScript + Vite | 构建快、类型安全 |
| 状态管理 | Redux Toolkit / RTK Query | 跨页面状态与服务端缓存 |
| 样式 | Tailwind CSS | 统一 token |
| UI 组件 | shadcn/ui | 组件源码入库，优先复用，保留 Radix 可访问性 |
| 后端 | .NET 10（LTS）+ ASP.NET Core 10 | Minimal APIs、内置校验、OpenAPI |
| 数据访问 | EF Core 10 + `Microsoft.EntityFrameworkCore.Sqlite` | 迁移、LINQ、类型安全 |
| 契约 | OpenAPI 3.1 | 生成前端客户端 |
| 缓存 | `HybridCache` | 外部数据与热点 |
| 观测 | OpenTelemetry + 结构化日志 | 指标、追踪、日志 |
| 测试 | xUnit + `WebApplicationFactory` + Playwright | 单元/集成/端到端 |

## 关键数据流

### 记录

1. 前端提交 JSON → Minimal API 校验（`AddValidation()`）。
2. Handler 通过 EF Core 写入 `notes` / `note_tags`。
3. 返回 `TypedResults.Created` 或 `TypedResults.Ok`。
4. 前端用生成的客户端类型解析响应。

### 热点聚合

1. `BackgroundService` 按间隔调用各数据源适配器。
2. 适配器使用 `HttpClient`（超时、重试上限）拉取并归一化。
3. 结果写入 `feed_items`，并更新 `feed_sources.last_fetched_at`。
4. API 读取数据库缓存；失败时返回上次缓存与时间戳。

### 在线工具

1. 纯前端工具在浏览器完成。
2. 需要服务端的工具走 `/api/v1/tools/*`。
3. 不记录敏感输入。

## 横切关注点

| 关注点 | 方案 |
| --- | --- |
| 鉴权 | 当前延后（ADR-007）；写接口仅本机/内网开放 |
| 校验 | .NET 10 内置 Minimal API 校验 + DataAnnotations |
| 错误处理 | ProblemDetails + `IExceptionHandler`，统一错误码 |
| 日志 | 结构化日志，含请求 ID、耗时、错误码 |
| 缓存 | `HybridCache`；外部数据落库缓存 |
| 降级 | 外部源失败返回缓存或空状态 |
| 配置 | `appsettings*.json` + 环境变量；密钥不入库 |
| 时间 | `TimeProvider`；SQLite 统一 UTC |
| 备份 | 每日复制 SQLite 文件，保留 N 份 |

## 环境

| 环境 | 用途 | 数据 |
| --- | --- | --- |
| local | 本地开发 | 本地 SQLite 文件 |
| preview | 发布前验证 | 独立 SQLite 副本 |
| production | 线上 | 生产 SQLite + 定期备份 |

## 部署拓扑（目标）

```text
Nginx / 1Panel
  ├── /            → src 静态产物
  └── /api/*       → .NET 进程（Kestrel，反向代理）
                      └── SQLite（持久化目录）
```

- 前端由 CI 构建并 rsync 到服务器。
- 后端 `dotnet publish -c Release` 后由 systemd/1Panel 托管。
- SQLite 文件不随发布覆盖，纳入备份。

详见 `../06-release/deployment.md`。
