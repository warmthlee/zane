# ADR-005 · 数据访问采用 EF Core 10

- 日期：2026-11-07
- 状态：已接受
- 关联：ADR-002、ADR-004

## 背景

需要类型安全的数据访问、可版本化迁移与较低的维护成本。数据库为 SQLite。

## 决策

使用 EF Core 10 + `Microsoft.EntityFrameworkCore.Sqlite`：

- 实体与映射集中在 `Data/`。
- 结构变更使用 EF Core 迁移（`dotnet ef migrations add` / `database update`）。
- 查询优先 LINQ；复杂只读查询可使用 `AsNoTracking` 与投影。
- 批量更新使用 EF Core 10 的 `ExecuteUpdateAsync`（支持普通 lambda）。
- 可选复杂类型与 JSON 映射用于配置类数据。
- 多条件过滤使用 EF Core 10 命名查询过滤器（按需启用/忽略）。

## SQLite 注意事项

- 启用 WAL 与外键；设置 `busy_timeout`。
- 单实例写入，事务保持短小。
- EF Core 10 修正了 SQLite 的 UTC 时间处理：`DateTime`/`DateTimeOffset` 统一按 UTC 读写，展示层再转本地时区。
- 参数化集合的 SQL 形状有变化，快照测试需更新。
- 迁移中的破坏性操作（删列/改类型）在 SQLite 上能力有限，采用“新建表 → 迁移数据 → 替换”的两步策略。

## 备选

- Dapper：更轻，但迁移与映射需自行维护。
- `node:sqlite`：随 Node 方案一起废弃。

## 影响

- 需要安装 `dotnet-ef` 工具。
- 迁移文件纳入版本控制。
- 发布前必须在副本上演练迁移。
