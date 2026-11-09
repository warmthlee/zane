# 后端与数据设计

## 运行形态

- .NET 10（LTS）ASP.NET Core Minimal APIs，Kestrel 常驻进程。
- EF Core 10 + SQLite，服务端独占数据文件。
- 后台任务使用 `BackgroundService`，与 API 同进程（初期）。
- 生产由 systemd 或 1Panel 进程管理托管，Nginx 反向代理 `/api`。

## 项目结构

```text
src-dotnet/
  Zane.sln
  Zane.Api/
    Program.cs               # 服务注册、中间件、端点映射
    Features/
      Notes/                 # 文章/长文（后续）
      Memos/                 # 想法流端点、口令、标签解析
      Tools/
      Patterns/
      Cheatsheets/
      Feeds/
      Mvps/
    Domain/                  # 实体与领域规则
    Data/                    # AppDbContext、实体配置
    Migrations/              # EF Core 迁移
    Contracts/               # 请求/响应 DTO
    Infrastructure/          # 适配器、后台任务、缓存
    appsettings.json
  Zane.Api.Tests/            # xUnit + WebApplicationFactory
```

按领域组织，避免单个 `Program.cs` 膨胀；端点通过扩展方法分组注册。

## .NET 10 关键用法

| 能力 | 用法 |
| --- | --- |
| Minimal API 校验 | `builder.Services.AddValidation()`；DTO 使用 DataAnnotations；返回统一 400 |
| OpenAPI 3.1 | `AddOpenApi()` + `MapOpenApi()`；XML 注释进入文档 |
| 端点返回 | `TypedResults.Ok/Created/NoContent/Problem` |
| 路由分组 | `MapGroup("/api/v1")`，按 feature 拆分扩展方法 |
| 错误处理 | `IExceptionHandler` + `ProblemDetails` |
| JSON | source-generated `JsonSerializerContext` |
| 时间 | 注入 `TimeProvider`，禁止直接 `DateTime.UtcNow` |
| 缓存 | `HybridCache` |
| 观测 | OpenTelemetry（ASP.NET Core、HttpClient、EF Core） |
| C# 14 | `field`、扩展成员、空条件赋值、集合表达式、primary constructors |

不启用 Native AOT（ADR-009）。

## EF Core 10 约定

- 一个 `AppDbContext`，实体配置使用 `IEntityTypeConfiguration<T>`。
- 查询默认 `AsNoTracking()`（只读场景）；更新时显式跟踪。
- 复杂只读查询使用投影，不加载整实体。
- 批量更新使用 `ExecuteUpdateAsync`（EF Core 10 支持普通 lambda，可写条件逻辑）。
- 需要软删除或状态过滤时使用 EF Core 10 命名查询过滤器，按场景 `IgnoreQueryFilters(["Name"])`。
- 配置类数据可使用复杂类型 + JSON 映射（`ToJson()`）。
- 迁移只增不改；破坏性变更采用“新表 → 数据迁移 → 替换”。

## SQLite 配置

```csharp
// 连接字符串示例
"Data Source=/var/lib/zane/zane.db;Cache=Shared"
```

启动时执行：

- `PRAGMA journal_mode=WAL;`
- `PRAGMA foreign_keys=ON;`
- `PRAGMA busy_timeout=5000;`

注意：

- 只允许单实例写入；不要水平扩展多个进程写同一文件。
- 事务保持短小，避免长时间持锁。
- EF Core 10 的 SQLite 提供方统一按 UTC 处理 `DateTime`/`DateTimeOffset`；展示层转本地时区。
- 参数化集合的 SQL 形状在 EF Core 10 有变化，SQL 快照测试需更新。

## 数据模型（初版）

### 文章与长文记录

| 表 | 关键字段 | 说明 |
| --- | --- | --- |
| `notes` | id, title, content_md, status, created_at, updated_at, published_at | 文章/长文记录 |
| `tags` | id, name, slug | 标签 |
| `note_tags` | note_id, tag_id | 多对多 |

`status`：`draft`、`published`、`archived`。

### 想法流

| 表 | 关键字段 | 说明 |
| --- | --- | --- |
| `memos` | id, content, created_at, updated_at, deleted_at | 首页短想法 |
| `memo_tags` | id, memo_id, tag | 从正文解析出的标签 |

- `content` 为纯文本，长度 1–500；不渲染 Markdown。
- `deleted_at` 为空表示未删除；使用 EF Core 查询过滤器默认排除软删除记录。
- 标签由服务端解析，规则见 [PRD-09](../01-requirements/prd/prd-09-memos.md#标签语法)；标签最长 32 字符，每条最多 8 个。
- `memo_tags(memo_id, tag)` 唯一索引；`memo_tags(tag, memo_id)` 支持标签筛选。
- 时间统一 UTC 存储；日历按 `Site:TimeZone`（默认 `Asia/Shanghai`）分组。

### 内容与工具

| 表 | 关键字段 | 说明 |
| --- | --- | --- |
| `patterns` | id, title, topic, difficulty, content_md, created_at, updated_at | 最佳实践 |
| `cheatsheets` | id, title, category, content_md, sort_order | Cheat Sheet |
| `mvps` | id, slug, name, status, entry_url, notes | 创意 MVP 注册 |
| `integrations` | id, slug, name, provider, config_json, enabled | 第三方集成 |

### 聚合

| 表 | 关键字段 | 说明 |
| --- | --- | --- |
| `feed_sources` | id, provider, name, enabled, config_json, last_fetched_at | 数据源 |
| `feed_items` | id, source_id, external_id, title, url, payload_json, fetched_at | 归一化条目 |

`feed_items(source_id, external_id)` 建唯一索引。

### 延后表（当前不建）

- `users` / `sessions`：鉴权延后（ADR-007）。
- `sync_targets` / `sync_records`：社交分发延后（ADR-008）。

## 索引与检索

- `notes(status, updated_at)`、`notes(published_at)`。
- `note_tags(tag_id, note_id)`。
- `memos(deleted_at, created_at)` 支持时间线；`memo_tags(memo_id, tag)` 唯一索引、`memo_tags(tag, memo_id)` 普通索引。
- `feed_items(source_id, external_id)` 唯一索引。
- 全文检索使用 SQLite FTS5；若 EF Core 映射不便，使用原生 SQL 查询并保持只读。

## 迁移流程

```bash
dotnet ef migrations add AddNotes --project src-dotnet/Zane.Api
dotnet ef database update --project src-dotnet/Zane.Api
```

- 迁移文件纳入版本控制。
- 发布前在数据库副本上执行。
- 生产迁移前备份；破坏性变更需两步迁移。
- 回滚以“恢复备份 + 回退代码”为主，不依赖反向迁移。

## 后台任务

- 每个数据源一个适配器，实现统一接口。
- `BackgroundService` 按配置间隔执行；使用 `PeriodicTimer`。
- 通过 `HybridCache` 或数据库记录避免重复抓取。
- 失败记录日志与 `last_error`，不抛出到请求线程。

## 想法流口令与日历

- 配置键：`Memos:Passphrase`，通过环境变量 `Memos__Passphrase` 或用户机密注入，不写入仓库；最小长度 8。
- 服务端对配置值与请求值计算 SHA-256，使用 `CryptographicOperations.FixedTimeEquals` 比较。
- 写请求使用 `X-Memo-Passphrase` 头；`POST /api/v1/memos/unlock` 仅校验口令，不建立服务端会话。
- 解锁与写操作按来源 IP 使用 ASP.NET Core 限流：默认 5 次 / 5 分钟，超限 `429`。
- 未配置口令时启动日志记录 warning，写接口与 `unlock` 返回 `503`（`MEMO_PASSPHRASE_NOT_CONFIGURED`）；生产部署必须配置，否则只允许只读。
- 站点时区配置键：`Site:TimeZone`，默认 `Asia/Shanghai`；启动时用 `TimeZoneInfo.FindSystemTimeZoneById` 校验，无效则启动失败并记录明确错误。
- 日历聚合按本地日期分组：先把 `created_at` 转为站点时区，再取 `yyyy-MM-dd`；返回 52 周完整日期，未来日期计数为 0。
- SQLite 没有完整的 IANA 时区函数；日历查询只按 UTC 范围取出 `created_at`，在应用层用 `TimeZoneInfo` 分组，避免在 SQL 中做时区转换。
- 共享口令不是用户鉴权，不提供按用户隔离与所有者判断；未来由 MEMO-11 替换。

## 安全

- 写接口在鉴权落地前仅限本机/内网或受信网络；Memos 额外要求共享口令，但口令不能替代网络限制。
- 口令不得写入日志、URL、query 或前端持久化到 `localStorage`；前端会话保存在 `sessionStorage`，收到 `401` 时清除。
- SQLite 文件位于非静态目录，Web 服务器不可直接访问。
- 连接字符串与会话密钥通过环境变量注入。
- 外部输入统一校验；日志脱敏。
- 外部 HTTP 使用 `IHttpClientFactory`，设置超时与重试上限。

## 健康检查

`/api/v1/health`：

- 检查数据库可连接（`CanConnectAsync`）。
- 返回版本、运行时长、数据库状态。
- 数据库不可用返回 503。
