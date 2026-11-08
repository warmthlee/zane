# 决策记录索引

架构决策采用 ADR（Architecture Decision Record）管理，每个决策一个独立文件，存放在 [`adr/`](adr/)。

## 快速入口

- [ADR 索引](adr/README.md)
- 格式与维护规则见 [adr/README.md](adr/README.md)

## 当前决策

| ADR | 结论 | 状态 | 日期 |
| --- | --- | --- | --- |
| [ADR-001](adr/ADR-001-monorepo.md) | 前后端分离、同仓维护；API 契约由 OpenAPI 生成 | 已接受 | 2026-11-07 |
| [ADR-002](adr/ADR-002-sqlite.md) | SQLite 作为唯一数据库 | 已接受 | 2026-11-07 |
| [ADR-003](adr/ADR-003-frontend-stack.md) | React + TypeScript + Vite + RTK + Tailwind + shadcn/ui | 已接受 | 2026-11-07 |
| [ADR-004](adr/ADR-004-dotnet-10-backend.md) | 后端采用 .NET 10 + Minimal APIs | 已接受 | 2026-11-07 |
| [ADR-005](adr/ADR-005-ef-core-sqlite.md) | 数据访问采用 EF Core 10 + SQLite | 已接受 | 2026-11-07 |
| [ADR-006](adr/ADR-006-release-pipeline.md) | 前端 rsync + 后端 systemd/1Panel | 已接受 | 2026-11-07 |
| [ADR-007](adr/ADR-007-auth-deferred.md) | 鉴权延后 | 已接受（延后） | 2026-11-07 |
| [ADR-008](adr/ADR-008-social-sync-deferred.md) | 社交分发延后 | 已接受（延后） | 2026-11-07 |
| [ADR-009](adr/ADR-009-native-aot-deferred.md) | 初期不启用 Native AOT | 已接受 | 2026-11-07 |

## 规则

- 不删除历史决策；结论变化时新增 ADR 并标注替代关系。
- 决策影响的需求、架构、风险文档必须同步更新。
- 未定稿的讨论不写入 ADR，先记录在任务归档中。
