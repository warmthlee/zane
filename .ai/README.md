# AI 协作与会话归档

本目录保存 AI 协作的运行时产物与会话归档，工具无关。项目契约以根目录 `AGENTS.md` 与 `CLAUDE.md` 为准，文档事实来源为 `docs/`。

## 原则

- 人负责范围、产品判断与发布确认。
- AI 负责实现、文档草稿与验证执行。
- 每个任务有明确验收标准。
- 会话是可恢复的工程产物，不是临时聊天。

## 归档内容

- 任务标题、目标与状态。
- 范围与关键决策。
- 代码变更摘要。
- 验证命令与结果。
- 发布、回滚与遗留风险。

## 文件

| 文件 | 说明 |
| --- | --- |
| `session-archive.db` | SQLite 归档 |
| `session-archive.json` | JSON 快照，便于查看与迁移 |
| `session-state-template.json` | 会话结构模板 |
| `releases/` | 发布与回滚记录（如使用发布脚本） |

## 使用

```bash
npm run session:save -- "任务标题" done "验证：build/lint 通过"
npm run session:summary
```

状态：`pending`、`in_progress`、`done`、`blocked`。依赖 `node:sqlite`，需要 Node 22+。

阶段 1 的步骤按会话归档，标题以步骤 ID 开头，例如 `S1 · 后端 walking skeleton`，与 `docs/01-requirements/delivery-plan.md` 的 S0–S5 一一对应。归档是会话摘要，进度与验收证据仍以交付计划为准。

## 与文档的关系

| 内容 | 位置 |
| --- | --- |
| 本次任务过程 | `.ai/` 归档 |
| 长期有效结论 | `docs/08-governance/decision-log.md` |
| 版本变更 | `docs/08-governance/changelog.md` |
| 风险 | `docs/08-governance/risk-register.md` |

归档与 `docs/` 冲突时，以 `docs/` 为准并修正归档。
