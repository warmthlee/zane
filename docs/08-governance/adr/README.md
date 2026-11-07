# ADR 索引

架构决策记录（Architecture Decision Record）。每个决策一个文件，只追加、不删除；结论变化时新增 ADR 并标注替代关系。

## 格式

```text
# ADR-000 · 标题
- 日期
- 状态：提议 / 已接受 / 已替代 / 废弃 / 延后
- 背景
- 决策
- 备选
- 影响
- 关联
```

## 列表

| ADR | 决策 | 状态 |
| --- | --- | --- |
| [ADR-001](ADR-001-monorepo.md) | 前后端分离、同仓维护 | 已接受 |
| [ADR-002](ADR-002-sqlite.md) | SQLite 作为唯一数据库 | 已接受 |
| [ADR-003](ADR-003-frontend-stack.md) | 前端技术栈 | 已接受 |
| [ADR-004](ADR-004-dotnet-10-backend.md) | 后端采用 .NET 10 | 已接受 |
| [ADR-005](ADR-005-ef-core-sqlite.md) | 数据访问采用 EF Core 10 | 已接受 |
| [ADR-006](ADR-006-release-pipeline.md) | 发布链路 | 已接受 |
| [ADR-007](ADR-007-auth-deferred.md) | 鉴权延后 | 已接受 |
| [ADR-008](ADR-008-social-sync-deferred.md) | 社交分发延后 | 已接受 |
| [ADR-009](ADR-009-native-aot-deferred.md) | 初期不启用 Native AOT | 已接受 |

## 维护规则

- 新增决策必须新建文件并在本表登记。
- 已接受的决策不直接改写结论；变更时新建 ADR，旧文件标注“已替代”。
- 决策影响的需求、架构、风险文档需同步更新。
