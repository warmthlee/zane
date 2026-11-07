# 功能清单

状态：`planned` / `in-progress` / `done` / `deferred` / `dropped`。优先级：P0 必须、P1 应该、P2 可选。

阶段 1 的落地顺序与分步验收见 [`delivery-plan.md`](delivery-plan.md)；本表只记录功能与优先级，不记录执行步骤。

## 平台与基础设施（PRD-00）

| ID | 功能 | 优先级 | 状态 | 依赖 |
| --- | --- | --- | --- | --- |
| PLAT-01 | 前端统一 `src/`，建立 `src-dotnet/` + `src/api-client/` | P0 | planned | — |
| PLAT-02 | .NET 10 ASP.NET Core Minimal APIs | P0 | planned | PLAT-01 |
| PLAT-03 | EF Core 10 + SQLite 接入 | P0 | planned | PLAT-02 |
| PLAT-04 | OpenAPI 3.1 与 TypeScript 客户端生成 | P0 | planned | PLAT-02 |
| PLAT-05 | 统一 ProblemDetails 与异常处理 | P0 | planned | PLAT-02 |
| PLAT-06 | 健康检查（含数据库） | P0 | planned | PLAT-03 |
| PLAT-07 | 结构化日志与 OpenTelemetry | P1 | planned | PLAT-02 |
| PLAT-08 | 备份与导出脚本 | P1 | planned | PLAT-03 |
| PLAT-09 | 用户鉴权 | — | deferred | ADR-007 |

## 思想记录（PRD-01）

| ID | 功能 | 优先级 | 状态 | 依赖 |
| --- | --- | --- | --- | --- |
| NOTE-01 | 记录 CRUD | P0 | planned | PLAT-03 |
| NOTE-02 | 标签与多对多关联 | P0 | planned | NOTE-01 |
| NOTE-03 | 关键词检索与标签筛选 | P0 | planned | NOTE-02 |
| NOTE-04 | 草稿自动保存 | P1 | planned | NOTE-01 |
| NOTE-05 | 导出 Markdown/JSON | P1 | planned | NOTE-01 |
| NOTE-10 | 同步目标配置 | — | deferred | ADR-008 |
| NOTE-11 | 一键同步与重试 | — | deferred | ADR-008 |

## 在线工具（PRD-02）

| ID | 功能 | 优先级 | 状态 | 依赖 |
| --- | --- | --- | --- | --- |
| TOOL-01 | 工具列表与分类 | P0 | planned | PLAT-01 |
| TOOL-02 | 二维码生成 | P0 | planned | TOOL-01 |
| TOOL-03 | Base64 编解码 | P0 | planned | TOOL-01 |
| TOOL-04 | ASCII 码表 | P0 | planned | TOOL-01 |
| TOOL-05 | 统一工具布局 | P1 | planned | TOOL-01 |

## 创意 MVP（PRD-03）

| ID | 功能 | 优先级 | 状态 | 依赖 |
| --- | --- | --- | --- | --- |
| MVP-01 | MVP 注册与上下线 | P1 | planned | PLAT-01 |
| MVP-02 | 古诗词 | P2 | planned | MVP-01 |
| MVP-03 | 英语学习 | P2 | planned | MVP-01 |
| MVP-04 | 打字练习 | P2 | planned | MVP-01 |

## 最佳实践与 Cheat Sheet（PRD-04 / PRD-07）

| ID | 功能 | 优先级 | 状态 | 依赖 |
| --- | --- | --- | --- | --- |
| PAT-01 | 最佳实践内容模型 | P1 | planned | NOTE-03 |
| PAT-02 | 设计模式案例展示 | P1 | planned | PAT-01 |
| CHT-01 | Cheat Sheet 列表与搜索 | P1 | planned | NOTE-03 |
| CHT-02 | 代码块复制 | P1 | planned | CHT-01 |

## 聚合与集成（PRD-05 / PRD-06）

| ID | 功能 | 优先级 | 状态 | 依赖 |
| --- | --- | --- | --- | --- |
| FEED-01 | 数据源适配器框架 | P1 | planned | PLAT-02 |
| FEED-02 | 百度头条 | P1 | planned | FEED-01 |
| FEED-03 | 微博头条 | P1 | planned | FEED-01 |
| FEED-04 | 股票信息与自选 | P2 | planned | FEED-01 |
| INT-01 | Excalidraw 集成 | P2 | planned | PLAT-01 |

## 变更规则

- 新增功能先更新对应 PRD，再在本表登记。
- 状态变化与验收结果同步更新。
- 延后与删除需注明原因与关联 ADR，不直接抹掉历史。
