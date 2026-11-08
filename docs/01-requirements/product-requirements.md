# 产品需求索引

每个功能域一份独立 PRD，本文只做索引与状态汇总。

## PRD 列表

| PRD | 主题 | 当前状态 | 主要阶段 |
| --- | --- | --- | --- |
| [PRD-00](prd/prd-00-platform.md) | 平台基础（.NET 10 + EF Core） | planned | 阶段 1 |
| [PRD-01](prd/prd-01-notes.md) | 思想记录 | planned | 阶段 1（社交分发延后） |
| [PRD-02](prd/prd-02-tools.md) | 在线工具 | planned | 阶段 2 |
| [PRD-03](prd/prd-03-playground.md) | 创意 MVP 游乐场 | planned | 阶段 5 |
| [PRD-04](prd/prd-04-patterns.md) | 最佳实践 | planned | 阶段 3 |
| [PRD-05](prd/prd-05-feeds.md) | 热点聚合 | planned | 阶段 4 |
| [PRD-06](prd/prd-06-integrations.md) | 第三方工具集成 | planned | 阶段 4 |
| [PRD-07](prd/prd-07-cheatsheets.md) | Cheat Sheet | planned | 阶段 2 |
| [PRD-08](prd/prd-08-non-functional.md) | 非功能需求 | planned | 全阶段 |

## 技术基线

- 前端：React + TypeScript + Vite + Redux Toolkit + Tailwind CSS + shadcn/ui。
- 后端：.NET 10（LTS）+ ASP.NET Core Minimal APIs。
- 数据访问：EF Core 10 + SQLite。
- 契约：服务端 OpenAPI 3.1 → 生成 TypeScript 客户端。

## 当前明确延后

| 能力 | 原因 | 关联 |
| --- | --- | --- |
| 用户鉴权 | 个人使用，早期先跑通内容能力 | ADR-007 |
| 社交平台一键分发 | 依赖平台 API、审核与限流 | ADR-008 |

延后能力在 PRD 中保留需求描述，但状态为 `deferred`，不进入当前验收。

## 变更规则

- 新增功能先建立或更新对应 PRD，再登记 `feature-backlog.md`。
- PRD 的状态、优先级、验收标准变化必须同步索引。
- 需求变更影响架构时，同步更新 `../02-architecture/` 与 ADR。
